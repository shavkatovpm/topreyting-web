import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

type Tx = Prisma.TransactionClient | typeof db;

// BigInt/Date JSON'ga to'g'ridan-to'g'ri yozilmaydi
function plain(v: unknown): Prisma.InputJsonValue | undefined {
  if (v === undefined || v === null) return undefined;
  return JSON.parse(
    JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x))
  );
}

/** Faqat qo'shiladi. Tranzaksiya ichida chaqirilsa, o'zgarish bilan birga saqlanadi. */
export async function logAudit(
  tx: Tx,
  entry: {
    /** Tizim yoki mehmon (masalan sayt orqali kelgan ariza) amali uchun null */
    adminId: string | null;
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: unknown;
    newValue?: unknown;
  }
) {
  await tx.auditLog.create({
    data: {
      adminId: entry.adminId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      oldValue: plain(entry.oldValue),
      newValue: plain(entry.newValue),
    },
  });
}
