"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePublic } from "@/lib/revalidate";
import { recomputeBrandCategory } from "@/lib/payments";
import { getSettings } from "@/lib/settings";
import { validatePaymentAmount, formatSom } from "@/lib/ranking";
import { firstError, formToObject, type FormState } from "./shared";

const addSchema = z.object({
  brandCategoryId: z.string().min(1, "Brend va kategoriyani tanlang"),
  amount: z.string().min(1, "Summani kiriting"),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Sanani kiriting"),
  reference: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
});

export async function addPayment(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = addSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const f = parsed.data;

  // "50 000" / "50,000" / "50000" -> 50000n
  const digits = f.amount.replace(/[\s,._]/g, "");
  if (!/^\d+$/.test(digits)) return { error: "Summa faqat raqamlardan iborat bo'lsin" };
  const amount = BigInt(digits);

  const paymentDate = new Date(`${f.paymentDate}T00:00:00Z`);
  if (Number.isNaN(paymentDate.getTime())) return { error: "Sana noto'g'ri" };
  if (paymentDate.getTime() > Date.now() + 24 * 3600 * 1000) {
    return { error: "Kelajak sanasini kiritib bo'lmaydi" };
  }

  const settings = await getSettings();
  const check = validatePaymentAmount(amount, settings.minPaymentAmount);
  if (!check.ok) return { error: check.error };

  const bc = await db.brandCategory.findUnique({
    where: { id: f.brandCategoryId },
    include: { brand: true, category: true },
  });
  if (!bc || bc.brand.status === "DELETED" || bc.category.status === "DELETED") {
    return { error: "Brend yoki kategoriya topilmadi" };
  }

  await db.$transaction(async (tx) => {
    const p = await tx.payment.create({
      data: {
        brandCategoryId: bc.id,
        amount,
        paymentDate,
        reference: f.reference ?? null,
        note: f.note ?? null,
        createdById: admin.id,
      },
    });
    const state = await recomputeBrandCategory(tx, bc.id);
    await logAudit(tx, {
      adminId: admin.id,
      action: "PAYMENT_ADDED",
      entityType: "Payment",
      entityId: p.id,
      newValue: {
        brand: bc.brand.name,
        category: bc.category.name,
        amount: formatSom(amount),
        totalAfter: formatSom(state.totalPaid),
        reference: f.reference,
      },
    });
  });
  revalidatePublic();
  redirect("/admin/payments?added=1");
}

/** To'lov o'chirilmaydi — VOID qilinadi (sabab majburiy). Faqat SUPER_ADMIN. */
export async function voidPayment(paymentId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireSuperAdmin();
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 5) return { error: "Bekor qilish sababini yozing (kamida 5 belgi)" };

  const p = await db.payment.findUnique({
    where: { id: paymentId },
    include: { brandCategory: { include: { brand: true, category: true } } },
  });
  if (!p || p.status !== "CONFIRMED") return { error: "To'lov topilmadi yoki allaqachon bekor qilingan" };

  await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: p.id },
      data: { status: "VOIDED", voidedAt: new Date(), voidReason: reason, voidedById: admin.id },
    });
    const state = await recomputeBrandCategory(tx, p.brandCategoryId);
    await logAudit(tx, {
      adminId: admin.id,
      action: "PAYMENT_VOIDED",
      entityType: "Payment",
      entityId: p.id,
      oldValue: { status: "CONFIRMED", amount: formatSom(p.amount) },
      newValue: {
        status: "VOIDED",
        reason,
        brand: p.brandCategory.brand.name,
        category: p.brandCategory.category.name,
        totalAfter: formatSom(state.totalPaid),
      },
    });
  });
  revalidatePublic();
  redirect("/admin/payments?voided=1");
}
