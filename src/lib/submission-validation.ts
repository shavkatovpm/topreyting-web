/**
 * "Reytingga qo'shilish" arizasini tekshirish — sof funksiyalar (server va testlar uchun).
 * Xato kodlari lug'atdagi `join.errors` kalitlariga mos.
 */
import { validatePaymentAmount } from "./ranking.ts";

export const MIN_SHORT = 50;
export const MIN_FULL = 200;
export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

export type SubmissionErrorCode =
  | "name"
  | "category"
  | "short"
  | "full"
  | "url"
  | "contact"
  | "agree"
  | "amount"
  | "receiptMissing"
  | "receiptType"
  | "receiptSize";

export type SubmissionBrandData = {
  name: string;
  shortDescription: string;
  fullDescription: string;
  websiteUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  priceRange?: string;
  workingHours?: string;
  services: string[];
};

export type ValidSubmission = {
  categorySlug: string;
  brand: SubmissionBrandData;
  contactName: string;
  contactPhone: string;
  amount: bigint;
};

export type ValidationResult =
  | { ok: true; value: ValidSubmission }
  | { ok: false; code: SubmissionErrorCode };

/** Boshqaruv belgilarini olib tashlaydi, bo'shliqlarni tozalaydi */
function clean(v: unknown, max: number): string {
  return String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

/** Faqat http(s) havola. "@nom" Telegram/Instagram uchun to'liq havolaga aylantiriladi. */
export function normalizeUrl(
  raw: string,
  kind: "site" | "telegram" | "instagram"
): string | null | undefined {
  const v = raw.trim();
  if (!v) return undefined;
  let candidate = v;
  if (v.startsWith("@")) {
    const handle = v.slice(1);
    if (!/^[A-Za-z0-9._]{2,64}$/.test(handle)) return null;
    if (kind === "telegram") candidate = `https://t.me/${handle}`;
    else if (kind === "instagram") candidate = `https://instagram.com/${handle}`;
    else return null;
  }
  try {
    const u = new URL(candidate);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString().slice(0, 300);
  } catch {
    return null;
  }
}

export function validateSubmission(
  f: Record<string, unknown>,
  minAmount: bigint
): ValidationResult {
  const name = clean(f.name, 100);
  if (name.length < 2) return { ok: false, code: "name" };

  const categorySlug = clean(f.categorySlug, 60);
  if (!categorySlug) return { ok: false, code: "category" };

  const shortDescription = clean(f.shortDescription, 300);
  if (shortDescription.length < MIN_SHORT) return { ok: false, code: "short" };

  const fullDescription = clean(f.fullDescription, 8000);
  if (fullDescription.length < MIN_FULL) return { ok: false, code: "full" };

  const websiteUrl = normalizeUrl(clean(f.websiteUrl, 300), "site");
  const instagramUrl = normalizeUrl(clean(f.instagramUrl, 300), "instagram");
  const telegramUrl = normalizeUrl(clean(f.telegramUrl, 300), "telegram");
  if (websiteUrl === null || instagramUrl === null || telegramUrl === null) {
    return { ok: false, code: "url" };
  }

  const contactName = clean(f.contactName, 80);
  const contactPhone = clean(f.contactPhone, 80);
  if (contactName.length < 2 || contactPhone.length < 5) return { ok: false, code: "contact" };

  if (!(f.agree === "on" || f.agree === "true" || f.agree === true)) {
    return { ok: false, code: "agree" };
  }

  const digits = clean(f.amount, 20).replace(/[\s,._]/g, "");
  if (!/^\d{1,15}$/.test(digits)) return { ok: false, code: "amount" };
  const amount = BigInt(digits);
  if (!validatePaymentAmount(amount, minAmount).ok) return { ok: false, code: "amount" };

  const services = String(f.services ?? "")
    .split(/\r?\n/)
    .map((s) => clean(s, 120))
    .filter(Boolean)
    .slice(0, 20);

  return {
    ok: true,
    value: {
      categorySlug,
      contactName,
      contactPhone,
      amount,
      brand: {
        name,
        shortDescription,
        fullDescription,
        websiteUrl,
        instagramUrl,
        telegramUrl,
        phone: clean(f.phone, 40) || undefined,
        address: clean(f.address, 200) || undefined,
        city: clean(f.city, 60) || undefined,
        priceRange: clean(f.priceRange, 80) || undefined,
        workingHours: clean(f.workingHours, 120) || undefined,
        services,
      },
    },
  };
}

/** Fayl mazmuniga qarab turi (mijoz yuborgan Content-Type'ga ishonilmaydi). */
export function detectReceiptType(
  buf: Uint8Array
): { ext: "jpg" | "png" | "webp" | "pdf"; mime: string } | null {
  const b = buf;
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { ext: "png", mime: "image/png" };
  }
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && // RIFF
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 // WEBP
  ) {
    return { ext: "webp", mime: "image/webp" };
  }
  if (b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d) {
    return { ext: "pdf", mime: "application/pdf" };
  }
  return null;
}
