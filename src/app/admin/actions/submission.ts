"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { approveSubmission, rejectSubmission } from "@/lib/submissions";
import { esc, markDecision } from "@/lib/telegram";
import { formatSom } from "@/lib/ranking";
import type { FormState } from "./shared";

export async function approveSubmissionAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();

  // Admin chekdagi haqiqiy summaga qarab ariza beruvchi ko'rsatgan summani tuzatishi mumkin
  const raw = String(formData.get("amount") ?? "").replace(/[\s,._]/g, "");
  if (raw && !/^\d{1,15}$/.test(raw)) return { error: "Summa faqat raqamlardan iborat bo'lsin" };

  const res = await approveSubmission(id, admin.id, raw ? { amount: BigInt(raw) } : {});
  if (!res.ok) return { error: res.message };

  const sub = await db.submission.findUnique({ where: { id } });
  if (sub?.telegramMessageId) {
    await markDecision(
      sub.telegramMessageId,
      `✅ <b>Tasdiqlandi</b> — ${esc(admin.name)} (panel)\n${esc(res.brandName)} · ${esc(formatSom(res.amount))}\nE'lon saytda joylandi.`
    );
  }
  redirect("/admin/submissions?approved=1");
}

export async function rejectSubmissionAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 5) return { error: "Rad etish sababini yozing (kamida 5 belgi)" };

  const res = await rejectSubmission(id, admin.id, reason);
  if (!res.ok) return { error: res.message };

  const sub = await db.submission.findUnique({ where: { id } });
  if (sub?.telegramMessageId) {
    await markDecision(sub.telegramMessageId, `❌ <b>Rad etildi</b> — ${esc(admin.name)}\nSabab: ${esc(reason)}`);
  }
  redirect("/admin/submissions?rejected=1");
}
