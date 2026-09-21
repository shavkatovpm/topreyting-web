import "server-only";
import type { SubmissionBrandData } from "@/lib/submission-validation";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { recomputeBrandCategory } from "@/lib/payments";
import { revalidatePublic } from "@/lib/revalidate";
import { getSettings } from "@/lib/settings";
import { formatSom, validatePaymentAmount } from "@/lib/ranking";
import { slugify } from "@/lib/slug";

export type ApproveResult =
  | { ok: true; brandId: string; brandName: string; categorySlug: string; brandSlug: string; amount: bigint }
  | { ok: false; reason: "not_found" | "already" | "amount"; message: string };

/**
 * Arizani tasdiqlaydi: BITTA tranzaksiyada Brend (ACTIVE) + BrandCategory + Payment (CONFIRMED)
 * yaratiladi, reyting avtomatik yangilanadi. Ikki marta bosilsa ham faqat bir marta ishlaydi.
 * Admin panel ham, Telegram tugmasi ham shu funksiyani chaqiradi.
 */
export async function approveSubmission(
  id: string,
  adminId: string,
  opts: { amount?: bigint } = {}
): Promise<ApproveResult> {
  const settings = await getSettings();
  const result = await db.$transaction(async (tx): Promise<ApproveResult> => {
    const sub = await tx.submission.findUnique({ where: { id }, include: { category: true } });
    if (!sub) return { ok: false, reason: "not_found", message: "Ariza topilmadi" };

    const amount = opts.amount ?? sub.amount;
    const check = validatePaymentAmount(amount, settings.minPaymentAmount);
    if (!check.ok) return { ok: false, reason: "amount", message: check.error };

    // Bir vaqtda ikki admin bossa: faqat bittasi PENDING -> APPROVED qila oladi
    const claimed = await tx.submission.updateMany({
      where: { id, status: "PENDING" },
      data: { status: "APPROVED", reviewedById: adminId, reviewedAt: new Date() },
    });
    if (claimed.count === 0) {
      return { ok: false, reason: "already", message: "Ariza allaqachon ko'rib chiqilgan" };
    }

    const d = sub.data as unknown as SubmissionBrandData;
    const base = slugify(d.name) || "brend";
    let slug = base;
    for (let n = 2; await tx.brand.findUnique({ where: { slug } }); n++) slug = `${base}-${n}`;

    const brand = await tx.brand.create({
      data: {
        slug,
        name: d.name,
        shortDescription: d.shortDescription,
        fullDescription: d.fullDescription,
        websiteUrl: d.websiteUrl ?? null,
        instagramUrl: d.instagramUrl ?? null,
        telegramUrl: d.telegramUrl ?? null,
        phone: d.phone ?? null,
        address: d.address ?? null,
        city: d.city ?? null,
        priceRange: d.priceRange ?? null,
        workingHours: d.workingHours ?? null,
        services: d.services,
        status: "ACTIVE",
        createdById: adminId,
        categories: { create: { categoryId: sub.categoryId } },
      },
      include: { categories: true },
    });
    const bc = brand.categories[0];

    const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
    const payment = await tx.payment.create({
      data: {
        brandCategoryId: bc.id,
        amount,
        paymentDate: today,
        reference: `SUB-${sub.id}`,
        note: "Sayt orqali ariza",
        createdById: adminId,
      },
    });
    const state = await recomputeBrandCategory(tx, bc.id);
    await tx.submission.update({ where: { id }, data: { brandId: brand.id } });

    await logAudit(tx, {
      adminId,
      action: "SUBMISSION_APPROVED",
      entityType: "Submission",
      entityId: id,
      newValue: {
        brand: brand.name,
        category: sub.category.name,
        amount: formatSom(amount),
        declared: formatSom(sub.amount),
        totalAfter: formatSom(state.totalPaid),
        paymentId: payment.id,
      },
    });

    return {
      ok: true,
      brandId: brand.id,
      brandName: brand.name,
      categorySlug: sub.category.slug,
      brandSlug: brand.slug,
      amount,
    };
  });

  if (result.ok) revalidatePublic();
  return result;
}

export async function rejectSubmission(id: string, adminId: string, reason: string) {
  const claimed = await db.submission.updateMany({
    where: { id, status: "PENDING" },
    data: { status: "REJECTED", reviewedById: adminId, reviewedAt: new Date(), rejectReason: reason },
  });
  if (claimed.count === 0) return { ok: false as const, message: "Ariza allaqachon ko'rib chiqilgan" };
  await logAudit(db, {
    adminId,
    action: "SUBMISSION_REJECTED",
    entityType: "Submission",
    entityId: id,
    newValue: { reason },
  });
  return { ok: true as const };
}
