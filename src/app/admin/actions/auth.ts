"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import type { FormState } from "./shared";

// Oddiy xotiradagi cheklov: bitta IP dan 15 daqiqada 8 ta xato urinish.
// (Bitta server jarayoni uchun yetarli; ko'p serverga o'tilsa bazaga ko'chiriladi.)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

// Foydalanuvchi mavjud emasligini vaqt orqali bildirmaslik uchun soxta xesh
const DUMMY_HASH =
  "scrypt$00000000000000000000000000000000$" + "0".repeat(128);

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.resetAt > now && rec.count >= MAX_ATTEMPTS) {
    return { error: "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = email ? await db.adminUser.findUnique({ where: { email } }) : null;
  const ok = await verifyPassword(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || admin.disabledAt || !ok) {
    const cur = rec && rec.resetAt > now ? rec : { count: 0, resetAt: now + WINDOW_MS };
    cur.count += 1;
    attempts.set(ip, cur);
    return { error: "Email yoki parol noto'g'ri" };
  }

  attempts.delete(ip);
  await createSession(admin.id);
  await logAudit(db, {
    adminId: admin.id,
    action: "LOGIN",
    entityType: "AdminUser",
    entityId: admin.id,
  });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
