import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { deriveState } from "@/lib/ranking";
import { getSettings } from "@/lib/settings";

/**
 * BrandCategory keshini (totalPaid / reachedAt / activeUntil) to'lovlardan qayta hisoblaydi.
 * Payment yaratilganda yoki VOID qilinganda ayni tranzaksiya ichida chaqiriladi.
 */
export async function recomputeBrandCategory(
  tx: Prisma.TransactionClient,
  brandCategoryId: string
) {
  const [payments, settings] = await Promise.all([
    tx.payment.findMany({
      where: { brandCategoryId },
      select: { amount: true, paymentDate: true, status: true },
    }),
    getSettings(tx),
  ]);
  const state = deriveState(payments, settings.activeMonths);
  await tx.brandCategory.update({ where: { id: brandCategoryId }, data: state });
  return state;
}
