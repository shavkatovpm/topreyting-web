import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Chek fayllari public papkadan TASHQARIDA saqlanadi va faqat adminlarga beriladi.
// Droplet'da STORAGE_DIR ni doimiy (persistent) papkaga yo'naltiring.
const ROOT = path.resolve(process.env.STORAGE_DIR ?? path.join(process.cwd(), "storage"));
const RECEIPTS = path.join(ROOT, "receipts");

const SAFE_NAME = /^[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/;

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
