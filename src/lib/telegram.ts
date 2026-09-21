import "server-only";
import { site } from "@/lib/site";

/**
 * Adminlar Telegram guruhiga xabar yuborish. Sozlanmagan bo'lsa (lokal) hech narsa qilmaydi:
 * arizalar baribir admin paneldagi "Arizalar" bo'limida ko'rinadi.
 *
 * Muhit o'zgaruvchilari: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_WEBHOOK_SECRET.
 */
const token = () => process.env.TELEGRAM_BOT_TOKEN;
const chatId = () => process.env.TELEGRAM_CHAT_ID;

export const telegramEnabled = () => Boolean(token() && chatId());

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function call(method: string, body: FormData | Record<string, unknown>) {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "content-type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json().catch(() => null)) as { ok: boolean; result?: any; description?: string } | null;
  if (!json?.ok) throw new Error(`Telegram ${method}: ${json?.description ?? res.status}`);
  return json.result;
}

function panelUrl(id: string): string | null {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  // Telegram localhost/http havolali tugmani qabul qilmaydi
  return base.startsWith("https://") && !base.includes("localhost") ? `${base}/admin/submissions/${id}` : null;
}

export function submissionCaption(s: {
  brandName: string;
  category: string;
  amount: string;
  contactName: string;
  contactPhone: string;
  shortDescription: string;
}) {
  return [
    "🆕 <b>Yangi ariza</b>",
    `<b>Brend:</b> ${esc(s.brandName)}`,
    `<b>Kategoriya:</b> ${esc(s.category)}`,
    `<b>Summa:</b> ${esc(s.amount)}`,
    `<b>Aloqa:</b> ${esc(s.contactName)}, ${esc(s.contactPhone)}`,
    "",
    esc(s.shortDescription.slice(0, 300)),
    "",
    "Chekni tekshiring. «Tasdiqlash» bosilsa to'lov tushadi va e'lon avtomatik joylanadi.",
  ].join("\n");
}

/** Chekni caption va tugmalar bilan guruhga yuboradi. Xabar ID'sini qaytaradi (yoki null). */
export async function sendSubmissionToGroup(args: {
  id: string;
  caption: string;
  receipt: Uint8Array;
  mime: string;
}): Promise<string | null> {
  if (!telegramEnabled()) return null;
  const url = panelUrl(args.id);
  const keyboard = {
    inline_keyboard: [
      [{ text: "✅ Tasdiqlash", callback_data: `approve:${args.id}` }],
      ...(url ? [[{ text: "Panelda ochish / rad etish", url }]] : []),
    ],
  };

  const isPdf = args.mime === "application/pdf";
  const form = new FormData();
  form.set("chat_id", chatId()!);
  form.set("caption", args.caption);
  form.set("parse_mode", "HTML");
  form.set("reply_markup", JSON.stringify(keyboard));
  form.set(
    isPdf ? "document" : "photo",
    new Blob([args.receipt as BlobPart], { type: args.mime }),
    isPdf ? "receipt.pdf" : "receipt.jpg"
  );
  const msg = await call(isPdf ? "sendDocument" : "sendPhoto", form);
  return String(msg.message_id);
}

export async function answerCallback(callbackId: string, text: string) {
  if (!token()) return;
  await call("answerCallbackQuery", { callback_query_id: callbackId, text, show_alert: true }).catch(() => {});
}

/** Qaror qabul qilingach xabarni yangilaydi va tugmalarni olib tashlaydi. */
export async function markDecision(messageId: string, caption: string) {
  if (!telegramEnabled()) return;
  await call("editMessageCaption", {
    chat_id: chatId(),
    message_id: Number(messageId),
    caption,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: [] },
  }).catch(() => {});
}
