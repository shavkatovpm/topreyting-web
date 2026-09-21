"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePublic } from "@/lib/revalidate";
import { SLUG_PATTERN } from "@/lib/slug";
import { firstError, formToObject, lines, type FormState } from "./shared";

// Thin/dublikat sahifalarni oldini olish: nashr qilish uchun minimal kontent
const MIN_SHORT = 50;
const MIN_FULL = 200;

const optUrl = z.string().url("To'g'ri havola kiriting (https://...)").max(300).optional();

const schema = z.object({
  name: z.string().min(2, "Kamida 2 belgi").max(100),
  slug: z.string().regex(SLUG_PATTERN, "Faqat kichik lotin harflari, raqam va tire").max(80),
  alternateNames: z.string().optional(),
  logoUrl: optUrl,
  shortDescription: z.string().min(20, "Kamida 20 belgi").max(300, "300 belgidan oshmasin"),
  fullDescription: z.string().min(20, "Kamida 20 belgi").max(20000),
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
  faqs: z.string().optional(), // har qator: "Savol | Javob"
  categoryIds: z.array(z.string()).min(1, "Kamida bitta kategoriya tanlang"),
  status: z.enum(["ACTIVE", "UNPUBLISHED"]),
});

function parseFaqs(v: string | undefined) {
  return lines(v)
    .map((l) => l.split("|").map((s) => s.trim()))
    .filter((p) => p.length >= 2 && p[0] && p[1])
    .map(([q, ...rest]) => ({ q, a: rest.join(" | ") }));
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

  if (status === "ACTIVE") {
    if (f.shortDescription.length < MIN_SHORT)
      return { error: `Nashr uchun qisqa tavsif kamida ${MIN_SHORT} belgi bo'lsin` };
    if (f.fullDescription.length < MIN_FULL)
      return { error: `Nashr uchun to'liq tavsif kamida ${MIN_FULL} belgi bo'lsin (unikal, brendga xos matn)` };
  }

  const clash = await db.brand.findUnique({ where: { slug: f.slug } });
  if (clash && clash.id !== id) return { error: "Bu slug boshqa brendda ishlatilgan" };

  const cats = await db.category.findMany({
    where: { id: { in: categoryIds }, status: { not: "DELETED" } },
  });
  if (cats.length !== categoryIds.length) return { error: "Tanlangan kategoriya topilmadi" };

  const data = {
    name: f.name,
    slug: f.slug,
    alternateNames: lines(f.alternateNames),
    logoUrl: f.logoUrl ?? null,
    shortDescription: f.shortDescription,
    fullDescription: f.fullDescription,
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
    faqs: parseFaqs(f.faqs),
    status,
  };

  if (!id) {
    const created = await db.$transaction(async (tx) => {
      const b = await tx.brand.create({
        data: {
          ...data,
          createdById: admin.id,
          categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
        },
      });
      await logAudit(tx, {
        adminId: admin.id,
        action: "BRAND_CREATED",
        entityType: "Brand",
        entityId: b.id,
        newValue: { ...data, categoryIds },
      });
      return b;
    });
    revalidatePublic();
    redirect(`/admin/brands/${created.id}?saved=1`);
  }

  const old = await db.brand.findUnique({
    where: { id },
    include: { categories: { include: { payments: { select: { id: true } } } } },
  });
  if (!old || old.status === "DELETED") return { error: "Brend topilmadi" };

  // To'lovi bor kategoriyadan brendni ayirib bo'lmaydi (tarix yo'qolmasin)
  const removed = old.categories.filter((bc) => !categoryIds.includes(bc.categoryId));
  if (removed.some((bc) => bc.payments.length > 0)) {
    return { error: "To'lov tarixi bor kategoriyadan brendni olib tashlab bo'lmaydi" };
  }

  await db.$transaction(async (tx) => {
    if (old.slug !== data.slug) {
      await tx.slugHistory.upsert({
        where: { entityType_oldSlug: { entityType: "brand", oldSlug: old.slug } },
        update: { entityId: id },
        create: { entityType: "brand", entityId: id, oldSlug: old.slug },
      });
    }
    await tx.brand.update({ where: { id }, data });
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
      newValue: { ...data, categoryIds },
    });
  });
  revalidatePublic();
  redirect(`/admin/brands/${id}?saved=1`);
}

/** Soft delete: ADMIN ham qila oladi. To'lov tarixi va audit saqlanib qoladi. */
export async function setBrandStatus(id: string, status: "ACTIVE" | "UNPUBLISHED" | "DELETED") {
  const admin = await requireAdmin();
  const old = await db.brand.findUnique({ where: { id } });
  if (!old || old.status === status) return;

  if (status === "ACTIVE" && (old.shortDescription.length < MIN_SHORT || old.fullDescription.length < MIN_FULL)) {
    redirect(`/admin/brands/${id}?error=${encodeURIComponent("Nashr uchun tavsif yetarli emas. Avval tavsifni to'ldiring.")}`);
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
