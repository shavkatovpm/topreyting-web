import { timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { approveSubmission } from "@/lib/submissions";
import { answerCallback, esc, markDecision } from "@/lib/telegram";
import { formatSom } from "@/lib/ranking";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Telegram "Tasdiqlash" tugmasi. Faqat:
 *  1) Telegram yuborgan (secret header to'g'ri) so'rovlar qabul qilinadi;
 *  2) tugmani bosgan odamning Telegram ID'si faol adminga biriktirilgan bo'lishi kerak.
 * Guruhdagi boshqa odamlar tugmani bossa ham hech narsa bo'lmaydi.
 */
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = req.headers.get("x-telegram-bot-api-secret-token") ?? "";
  if (!secret || !safeEqual(got, secret)) return new Response("forbidden", { status: 403 });

  const update = (await req.json().catch(() => null)) as {
    callback_query?: { id: string; data?: string; from?: { id: number } };
  } | null;
  const cb = update?.callback_query;
  if (!cb?.data?.startsWith("approve:") || !cb.from) return Response.json({ ok: true });

  const submissionId = cb.data.slice("approve:".length);
  const admin = await db.adminUser.findFirst({
    where: { telegramId: String(cb.from.id), disabledAt: null },
  });
  if (!admin) {
    await answerCallback(cb.id, "Sizda tasdiqlash huquqi yo'q. Telegram ID admin akkauntiga biriktirilmagan.");
    return Response.json({ ok: true });
  }

  const res = await approveSubmission(submissionId, admin.id);
  if (!res.ok) {
    await answerCallback(cb.id, res.message);
    return Response.json({ ok: true });
  }

  await answerCallback(cb.id, `✅ Tasdiqlandi: ${res.brandName}`);
  const sub = await db.submission.findUnique({ where: { id: submissionId } });
  if (sub?.telegramMessageId) {
    await markDecision(
      sub.telegramMessageId,
      `✅ <b>Tasdiqlandi</b> — ${esc(admin.name)}\n${esc(res.brandName)} · ${esc(formatSom(res.amount))}\nE'lon saytda joylandi.`
    );
  }
  return Response.json({ ok: true });
}
