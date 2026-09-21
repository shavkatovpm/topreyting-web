"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePublic } from "@/lib/revalidate";
import { RESERVED_CATEGORY_SLUGS, SLUG_PATTERN } from "@/lib/slug";
import { firstError, formToObject, type FormState } from "./shared";

const schema = z.object({
  name: z.string().min(2, "Kamida 2 belgi").max(80),
  slug: z
    .string()
    .regex(SLUG_PATTERN, "Faqat kichik lotin harflari, raqam va tire (masalan: oquv-markazlar)")
    .max(60)
    .refine((s) => !RESERVED_CATEGORY_SLUGS.has(s), "Bu slug band (tizim sahifasi bilan to'qnashadi)"),
  h1: z.string().min(3, "Kamida 3 belgi").max(120),
  seoTitle: z.string().min(10, "Kamida 10 belgi").max(70, "70 belgidan oshmasin"),
  metaDescription: z.string().min(50, "Kamida 50 belgi").max(170, "170 belgidan oshmasin"),
  shortDescription: z.string().min(20, "Kamida 20 belgi").max(400),
  longContent: z.string().max(20000).optional(),
});

export async function saveCategory(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = schema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const data = { ...parsed.data, longContent: parsed.data.longContent ?? "" };

  const clash = await db.category.findUnique({ where: { slug: data.slug } });
  if (clash && clash.id !== id) return { error: "Bu slug boshqa kategoriyada ishlatilgan" };

  if (!id) {
    const created = await db.$transaction(async (tx) => {
      const c = await tx.category.create({ data });
      await logAudit(tx, {
        adminId: admin.id,
        action: "CATEGORY_CREATED",
        entityType: "Category",
        entityId: c.id,
        newValue: data,
      });
      return c;
    });
    revalidatePublic();
    redirect(`/admin/categories/${created.id}?saved=1`);
  }

  const old = await db.category.findUnique({ where: { id } });
  if (!old) return { error: "Kategoriya topilmadi" };
  await db.$transaction(async (tx) => {
    if (old.slug !== data.slug) {
      // Eski URL 301 bilan yangisiga o'tishi uchun
      await tx.slugHistory.upsert({
        where: { entityType_oldSlug: { entityType: "category", oldSlug: old.slug } },
        update: { entityId: id },
        create: { entityType: "category", entityId: id, oldSlug: old.slug },
      });
    }
    await tx.category.update({ where: { id }, data });
    await logAudit(tx, {
      adminId: admin.id,
      action: "CATEGORY_UPDATED",
      entityType: "Category",
      entityId: id,
      oldValue: old,
      newValue: data,
    });
  });
  revalidatePublic();
  redirect(`/admin/categories/${id}?saved=1`);
}

export async function setCategoryStatus(id: string, status: "ACTIVE" | "UNPUBLISHED" | "DELETED") {
  // O'chirish faqat SUPER_ADMIN; nashr qilish/yashirish ADMIN ham qila oladi
  const admin = status === "DELETED" ? await requireSuperAdmin() : await requireAdmin();
  const old = await db.category.findUnique({ where: { id } });
  if (!old || old.status === status) return;
  await db.$transaction(async (tx) => {
    await tx.category.update({ where: { id }, data: { status } });
    await logAudit(tx, {
      adminId: admin.id,
      action: `CATEGORY_${status}`,
      entityType: "Category",
      entityId: id,
      oldValue: { status: old.status },
      newValue: { status },
    });
  });
  revalidatePublic();
  redirect("/admin/categories");
}
