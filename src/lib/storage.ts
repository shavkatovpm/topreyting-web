import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Chek fayllari public papkadan TASHQARIDA saqlanadi va faqat adminlarga beriladi.
// Logolar ham shu (deploy tegmaydigan, doimiy) papkada saqlanadi, lekin PUBLIC ravishda
// beriladi (/logos/[fayl] — src/app/logos/[file]/route.ts).
// Droplet'da STORAGE_DIR ni doimiy (persistent) papkaga yo'naltiring.
const ROOT = path.resolve(process.env.STORAGE_DIR ?? path.join(process.cwd(), "storage"));
const RECEIPTS = path.join(ROOT, "receipts");
const LOGOS = path.join(ROOT, "logos");

const SAFE_NAME = /^[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/;
const LOGO_SAFE_NAME = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

export async function saveReceipt(buf: Uint8Array, ext: string): Promise<string> {
  await mkdir(RECEIPTS, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(RECEIPTS, name), buf, { flag: "wx" });
  return name;
}

/** Fayl nomi qat'iy tekshiriladi (path traversal yo'q). */
export async function readReceipt(name: string): Promise<Buffer | null> {
  if (!SAFE_NAME.test(name)) return null;
  try {
    return await readFile(path.join(RECEIPTS, name));
  } catch {
    return null;
  }
}

export async function saveLogo(buf: Uint8Array, ext: "jpg" | "png" | "webp"): Promise<string> {
  await mkdir(LOGOS, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(LOGOS, name), buf, { flag: "wx" });
  return name;
}

export async function readLogo(name: string): Promise<Buffer | null> {
  if (!LOGO_SAFE_NAME.test(name)) return null;
  try {
    return await readFile(path.join(LOGOS, name));
  } catch {
    return null;
  }
}

/** Eski logo faylini o'chiradi (almashtirilganda yoki olib tashlanganda). Yo'q bo'lsa jim o'tadi. */
export async function deleteLogo(name: string): Promise<void> {
  if (!LOGO_SAFE_NAME.test(name)) return;
  try {
    await unlink(path.join(LOGOS, name));
  } catch {
    // fayl allaqachon yo'q — muammo emas
  }
}

/** `/logos/<fayl>` ko'rinishidagi (bizning yuklaganimiz) logoUrl'dan fayl nomini ajratadi. */
export function logoFileName(url: string | null | undefined): string | null {
  if (!url || !url.startsWith("/logos/")) return null;
  const name = url.slice("/logos/".length);
  return LOGO_SAFE_NAME.test(name) ? name : null;
}
