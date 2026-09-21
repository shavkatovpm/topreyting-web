import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { DEFAULT_ACTIVE_MONTHS, DEFAULT_MIN_PAYMENT } from "@/lib/ranking";

type Tx = Prisma.TransactionClient | typeof db;

export type Settings = {
  minPaymentAmount: bigint;
  activeMonths: number;
  /** To'lov rekvizitlari (karta raqami, qabul qiluvchi): modalning 4-bosqichida ko'rsatiladi */
  paymentDetails: string;
};

export async function getSettings(tx: Tx = db): Promise<Settings> {
  const rows = await tx.setting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const min = map.get("minPaymentAmount");
  const months = Number(map.get("activeMonths"));
  return {
    minPaymentAmount: min && /^\d+$/.test(min) ? BigInt(min) : DEFAULT_MIN_PAYMENT,
    activeMonths: Number.isInteger(months) && months > 0 ? months : DEFAULT_ACTIVE_MONTHS,
    paymentDetails: map.get("paymentDetails") ?? "",
  };
}
