"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePublic } from "@/lib/revalidate";
import { getSettings } from "@/lib/settings";
import { recomputeBrandCategory } from "@/lib/payments";
import { firstError, formToObject, type FormState } from "./shared";

const schema = z.object({
  minPaymentAmount: z.string().min(1, "Minimal summani kiriting"),
  activeMonths: z.coerce.number().int().min(1, "Kamida 1 oy").max(24, "24 oydan oshmasin"),
  paymentDetails: z.string().max(600, "600 belgidan oshmasin").optional(),
});

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireSuperAdmin();
  const parsed = schema.safeParse(formToObject(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  const digits = parsed.data.minPaymentAmount.replace(/[\s,._]/g, "");
  if (!/^\d+$/.test(digits) || BigInt(digits) <= 0n) {
    return { error: "Minimal summa musbat butun son bo'lsin" };
  }

  const old = await getSettings();
  const next = {
    minPaymentAmount: digits,
    activeMonths: String(parsed.data.activeMonths),
    paymentDetails: parsed.data.paymentDetails ?? "",
  };
  await db.$transaction(async (tx) => {
    for (const [key, value] of Object.entries(next)) {
      await tx.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }
    // Muddat (oy) o'zgargan bo'lsa, barcha brendlarning activeUntil'i qayta hisoblanadi
    if (old.activeMonths !== parsed.data.activeMonths) {
      const all = await tx.brandCategory.findMany({ select: { id: true } });
      for (const { id } of all) await recomputeBrandCategory(tx, id);
    }
    await logAudit(tx, {
      adminId: admin.id,
      action: "SETTINGS_UPDATED",
      entityType: "Setting",
      entityId: "global",
      oldValue: old,
      newValue: next,
    });
  });
  revalidatePublic();
  redirect("/admin/settings?saved=1");
}
