import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getSettings } from "@/lib/settings";
import { saveReceipt } from "@/lib/storage";
import { formatSom } from "@/lib/ranking";
import { sendSubmissionToGroup, submissionCaption } from "@/lib/telegram";
import {
  MAX_RECEIPT_BYTES,
  detectReceiptType,
  validateSubmission,
  type SubmissionErrorCode,
} from "@/lib/submission-validation";

export const runtime = "nodejs";

// Oddiy cheklov: bitta IP dan soatiga 5 ta ariza (bitta server jarayoni uchun)
const hits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PENDING = 300; // navbatni to'ldirib tashlashdan himoya

const fail = (code: SubmissionErrorCode | "rate" | "server", status: number) =>
  NextResponse.json({ ok: false, error: code }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = hits.get(ip);
  if (rec && rec.resetAt > now) {
    if (rec.count >= LIMIT) return fail("rate", 429);
    rec.count += 1;
  } else {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("server", 400);
  }

  // Honeypot: odam ko'rmaydigan maydon to'ldirilgan bo'lsa — bot. Jim "muvaffaqiyat" qaytaramiz.
  if (String(form.get("hp") ?? "").trim()) return NextResponse.json({ ok: true });

  const fields: Record<string, unknown> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string") fields[k] = v;

  const settings = await getSettings();
  const parsed = validateSubmission(fields, settings.minPaymentAmount);
  if (!parsed.ok) return fail(parsed.code, 422);

  const file = form.get("receipt");
  if (!(file instanceof File) || file.size === 0) return fail("receiptMissing", 422);
  if (file.size > MAX_RECEIPT_BYTES) return fail("receiptSize", 422);
  const buf = new Uint8Array(await file.arrayBuffer());
  const type = detectReceiptType(buf);
  if (!type) return fail("receiptType", 422);

  const category = await db.category.findFirst({
    where: { slug: parsed.value.categorySlug, status: "ACTIVE" },
  });
  if (!category) return fail("category", 422);

  if ((await db.submission.count({ where: { status: "PENDING" } })) >= MAX_PENDING) {
    return fail("rate", 429);
  }

  try {
    const receiptFile = await saveReceipt(buf, type.ext);
    const lang = fields.lang === "ru" ? "ru" : "uz";
    const sub = await db.submission.create({
      data: {
        categoryId: category.id,
        data: parsed.value.brand,
        contactName: parsed.value.contactName,
        contactPhone: parsed.value.contactPhone,
        amount: parsed.value.amount,
        receiptFile,
        receiptMime: type.mime,
        lang,
        ipHash: createHash("sha256")
          .update(ip + (process.env.SESSION_SECRET ?? ""))
          .digest("hex")
          .slice(0, 32),
      },
    });
    await logAudit(db, {
      adminId: null,
      action: "SUBMISSION_CREATED",
      entityType: "Submission",
      entityId: sub.id,
      newValue: { brand: parsed.value.brand.name, category: category.name, amount: formatSom(parsed.value.amount) },
    });

    // Telegram xabari muvaffaqiyatsiz bo'lsa ham ariza saqlangan: u admin panelda ko'rinadi
    try {
      const messageId = await sendSubmissionToGroup({
        id: sub.id,
        caption: submissionCaption({
          brandName: parsed.value.brand.name,
          category: category.name,
          amount: formatSom(parsed.value.amount),
          contactName: parsed.value.contactName,
          contactPhone: parsed.value.contactPhone,
          shortDescription: parsed.value.brand.shortDescription,
        }),
        receipt: buf,
        mime: type.mime,
      });
      if (messageId) await db.submission.update({ where: { id: sub.id }, data: { telegramMessageId: messageId } });
    } catch (e) {
      console.error("[submissions] Telegram yuborilmadi:", e instanceof Error ? e.message : e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[submissions]", e);
    return fail("server", 500);
  }
}
