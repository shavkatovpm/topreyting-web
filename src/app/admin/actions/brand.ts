"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePublic } from "@/lib/revalidate";
import { SLUG_PATTERN } from "@/lib/slug";
import { deleteLogo, logoFileName, saveLogo } from "@/lib/storage";
import { detectReceiptType } from "@/lib/submission-validation";
import { firstError, formToObject, lines, type FormState } from "./shared";

const MAX_LOGO_BYTES = 3 * 1024 * 1024;

const optUrl = z.string().url("To'g'ri havola kiriting (https://...)").max(300).optional();

const schema = z.object({
  name: z.string().min(2, "Kamida 2 belgi").max(100),
  slug: z.string().regex(SLUG_PATTERN, "Faqat kichik lotin harflari, raqam va tire").max(80),
  alternateNames: z.string().optional(),
  // Tavsif uzunligiga cheklov yo'q — nashr uchun yagona shart: logo + kamida bitta to'lov (pastda tekshiriladi)
  shortDescription: z.string().max(300, "300 belgidan oshmasin").optional(),
  fullDescription: z.string().max(20000).optional(),
  websiteUrl: optUrl,
  instagramUrl: optUrl,
  telegramUrl: optUrl,
  phone: z.string().max(40).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(60).optional(),
  priceRange: z.string().max(80).optional(),
  workingHours: z.string().max(120).optional(),
  yearFounded: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional(),
  services: z.string().optional(),
  features: z.string().optional(),
  faqsJson: z.string().optional(), // FaqEditor (client) yasagan JSON: [{q,a}]
  categoryIds: z.array(z.string()).min(1, "Kamida bitta kategoriya tanlang"),
  status: z.enum(["ACTIVE", "UNPUBLISHED"]),
});

const faqSchema = z.array(z.object({ q: z.string().min(1).max(200), a: z.string().min(1).max(2000) })).max(20);

/** Noto'g'ri/bo'sh JSON kelsa xato bermaydi — shunchaki savol-javob bo'sh qoladi. */
function parseFaqsJson(raw: string | undefined) {
  if (!raw) return [];
  try {
    const parsed = faqSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function saveBrand(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = schema.safeParse(formToObject(formData, ["categoryIds"]));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { categoryIds, status, ...f } = parsed.data;

  // Yangi brend to'g'ridan-to'g'ri nashr qilinmaydi: to'lov faqat brend yaratilgandan
  // KEYIN, alohida qadamda kiritiladi — shu tranzaksiyada hali bo'lishi mumkin emas.
  if (status === "ACTIVE" && !id) {
    return {
      error:
        "Yangi brendni bevosita nashr qilib bo'lmaydi. Avval «Yashirin» sifatida saqlang, to'lov kiritilgandan so'ng nashr qiling.",
    };
  }

  const clash = await db.brand.findUnique({ where: { slug: f.slug } });
  if (clash && clash.id !== id) return { error: "Bu slug boshqa brendda ishlatilgan" };

  const cats = await db.category.findMany({
    where: { id: { in: categoryIds }, status: { not: "DELETED" } },
  });
  if (cats.length !== categoryIds.length) return { error: "Tanlangan kategoriya topilmadi" };

  // Logo: fayl haqiqiy tasvirmi — kengaytmasiga emas, bayt tarkibiga qarab tekshiriladi
  const logoFileEntry = formData.get("logoFile");
  const removeLogo = formData.get("removeLogo") === "on";
  let newLogoName: string | null = null;
  if (logoFileEntry instanceof File && logoFileEntry.size > 0) {
    if (logoFileEntry.size > MAX_LOGO_BYTES) {
      return { error: `Logo hajmi ${Math.floor(MAX_LOGO_BYTES / 1024 / 1024)} MB dan oshmasin` };
    }
    const buf = new Uint8Array(await logoFileEntry.arrayBuffer());
    const detected = detectReceiptType(buf);
    if (!detected || detected.ext === "pdf") {
      return { error: "Logo faqat JPG, PNG yoki WEBP bo'lishi kerak" };
    }
    newLogoName = await saveLogo(buf, detected.ext);
  }

  const data = {
    name: f.name,
    slug: f.slug,
    alternateNames: lines(f.alternateNames),
    shortDescription: f.shortDescription ?? "",
    fullDescription: f.fullDescription ?? "",
    websiteUrl: f.websiteUrl ?? null,
    instagramUrl: f.instagramUrl ?? null,
    telegramUrl: f.telegramUrl ?? null,
    phone: f.phone ?? null,
    address: f.address ?? null,
    city: f.city ?? null,
    priceRange: f.priceRange ?? null,
    workingHours: f.workingHours ?? null,
    yearFounded: f.yearFounded ?? null,
    services: lines(f.services),
    features: lines(f.features),
    faqs: parseFaqsJson(f.faqsJson),
    status,
  };

  if (!id) {
    const logoUrl = newLogoName ? `/logos/${newLogoName}` : null;
    const created = await db.$transaction(async (tx) => {
      const b = await tx.brand.create({
        data: {
          ...data,
          logoUrl,
          createdById: admin.id,
          categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
        },
      });
      await logAudit(tx, {
        adminId: admin.id,
        action: "BRAND_CREATED",
        entityType: "Brand",
        entityId: b.id,
        newValue: { ...data, logoUrl, categoryIds },
      });
      return b;
    });
    revalidatePublic();
    redirect(`/admin/brands/${created.id}?saved=1`);
  }

  const old = await db.brand.findUnique({
    where: { id },
    include: { categories: { include: { payments: { select: { status: true } } } } },
  });
  if (!old || old.status === "DELETED") return { error: "Brend topilmadi" };

  // To'lovi bor kategoriyadan brendni ayirib bo'lmaydi (tarix yo'qolmasin)
  const removed = old.categories.filter((bc) => !categoryIds.includes(bc.categoryId));
  if (removed.some((bc) => bc.payments.length > 0)) {
    return { error: "To'lov tarixi bor kategoriyadan brendni olib tashlab bo'lmaydi" };
  }

  // Eski logo fayli almashtirilganda yoki olib tashlanganda o'chiriladi (bizniki bo'lsagina —
  // qo'lda kiritilgan tashqi URL bo'lsa tegilmaydi).
  let logoUrl = old.logoUrl;
  if (newLogoName) {
    const prevName = logoFileName(old.logoUrl);
    if (prevName) await deleteLogo(prevName);
    logoUrl = `/logos/${newLogoName}`;
  } else if (removeLogo) {
    const prevName = logoFileName(old.logoUrl);
    if (prevName) await deleteLogo(prevName);
    logoUrl = null;
  }

  // Nashr sharti: logo + kamida bitta tasdiqlangan to'lov + kamida bitta NASHR QILINGAN
  // kategoriya (aks holda brend "faol" bo'lsa ham hech qayerda ko'rinmaydi — bu ikki marta
  // sodir bo'lgan haqiqiy xato). Tavsif uzunligi tekshirilmaydi.
  if (status === "ACTIVE") {
    if (!logoUrl) return { error: "Nashr qilish uchun logo majburiy" };
    const hasPayment = old.categories.some((bc) => bc.payments.some((p) => p.status === "CONFIRMED"));
    if (!hasPayment) return { error: "Nashr qilish uchun kamida bitta to'lov kiritilgan bo'lishi kerak" };
    const hasVisibleCategory = cats.some((c) => c.status === "ACTIVE");
    if (!hasVisibleCategory) {
      return {
        error:
          "Nashr qilish uchun bog'langan kategoriyalardan kamida bittasi nashr qilingan bo'lishi kerak (hozir hammasi yashirin). Avval «Kategoriyalar» bo'limida kerakli kategoriyani nashr qiling.",
      };
    }
  }

  await db.$transaction(async (tx) => {
    if (old.slug !== data.slug) {
      await tx.slugHistory.upsert({
        where: { entityType_oldSlug: { entityType: "brand", oldSlug: old.slug } },
        update: { entityId: id },
        create: { entityType: "brand", entityId: id, oldSlug: old.slug },
      });
    }
    await tx.brand.update({ where: { id }, data: { ...data, logoUrl } });
    if (removed.length) {
      await tx.brandCategory.deleteMany({ where: { id: { in: removed.map((r) => r.id) } } });
    }
    const have = new Set(old.categories.map((bc) => bc.categoryId));
    for (const categoryId of categoryIds.filter((c) => !have.has(c))) {
      await tx.brandCategory.create({ data: { brandId: id, categoryId } });
    }
    await logAudit(tx, {
      adminId: admin.id,
      action: "BRAND_UPDATED",
      entityType: "Brand",
      entityId: id,
      oldValue: { ...old, categories: undefined, categoryIds: old.categories.map((c) => c.categoryId) },
      newValue: { ...data, logoUrl, categoryIds },
    });
  });
  revalidatePublic();
  redirect(`/admin/brands/${id}?saved=1`);
}

/** Soft delete: ADMIN ham qila oladi. To'lov tarixi va audit saqlanib qoladi. */
export async function setBrandStatus(id: string, status: "ACTIVE" | "UNPUBLISHED" | "DELETED") {
  const admin = await requireAdmin();
  const old = await db.brand.findUnique({
    where: { id },
    include: {
      categories: {
        include: { payments: { select: { status: true } }, category: { select: { status: true } } },
      },
    },
  });
  if (!old || old.status === status) return;

  if (status === "ACTIVE") {
    if (!old.logoUrl) {
      redirect(`/admin/brands/${id}?error=${encodeURIComponent("Nashr qilish uchun logo majburiy")}`);
    }
    const hasPayment = old.categories.some((bc) => bc.payments.some((p) => p.status === "CONFIRMED"));
    if (!hasPayment) {
      redirect(`/admin/brands/${id}?error=${encodeURIComponent("Nashr qilish uchun kamida bitta to'lov kiritilgan bo'lishi kerak")}`);
    }
    const hasVisibleCategory = old.categories.some((bc) => bc.category.status === "ACTIVE");
    if (!hasVisibleCategory) {
      redirect(
        `/admin/brands/${id}?error=${encodeURIComponent("Nashr qilish uchun bog'langan kategoriyalardan kamida bittasi nashr qilingan bo'lishi kerak")}`
      );
    }
  }

  await db.$transaction(async (tx) => {
    await tx.brand.update({ where: { id }, data: { status } });
    await logAudit(tx, {
      adminId: admin.id,
      action: `BRAND_${status}`,
      entityType: "Brand",
      entityId: id,
      oldValue: { status: old.status },
      newValue: { status },
    });
  });
  revalidatePublic();
  redirect(status === "DELETED" ? "/admin/brands" : `/admin/brands/${id}?saved=1`);
}
