import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Imzolangan (HMAC-SHA256) HttpOnly cookie. Ichida faqat adminId va muddat.
// Rol va "bloklangan" holati HAR SO'ROVDA bazadan o'qiladi (src/lib/auth.ts).
const COOKIE = "tr_admin";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 soat

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET o'rnatilmagan yoki 32 belgidan qisqa (.env)");
  }
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export async function createSession(adminId: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = Buffer.from(JSON.stringify({ id: adminId, exp })).toString("base64url");
  const value = `${payload}.${sign(payload)}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function readSession(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const { id, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof id !== "string" || typeof exp !== "number" || exp < Date.now() / 1000) return null;
    return id;
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
