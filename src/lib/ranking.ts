/**
 * Ranking engine — sof funksiyalar (bazaga bog'liq emas).
 *
 * Qoidalar:
 *  - Reyting saqlanmaydi, har doim to'lovlardan hisoblanadi.
 *  - Faqat CONFIRMED to'lovlar hisoblanadi.
 *  - Summalar yig'iladi (reset yo'q), lekin brend faqat `activeUntil` gacha ko'rinadi.
 *  - Har bir to'lov brendni to'lov sanasidan boshlab ACTIVE_MONTHS oyga faol qiladi
 *    (to'lovlar muddatni yig'maydi, oxirgi to'lov sanasidan qayta sanaydi).
 *  - Teng summada: avval shu summaga yetgan brend yuqorida, keyin brandId bo'yicha.
 */

export const DEFAULT_ACTIVE_MONTHS = 3;
export const DEFAULT_MIN_PAYMENT = 50_000n;

export type PaymentInput = {
  amount: bigint;
  paymentDate: Date;
  status: "CONFIRMED" | "VOIDED";
};

export type BrandCategoryState = {
  totalPaid: bigint;
  /** Hozirgi summaga yetgan (oxirgi tasdiqlangan) to'lov sanasi */
  reachedAt: Date | null;
  /** Oxirgi to'lov + activeMonths. To'lov yo'q bo'lsa null */
  activeUntil: Date | null;
};

export type RankEntry = {
  brandId: string;
  totalPaid: bigint;
  reachedAt: Date | null;
  activeUntil: Date | null;
};

export type RankedEntry<T extends RankEntry> = T & { rank: number };

/** UTC bo'yicha oy qo'shish; oy oxirida to'lgan bo'lsa (31-yan + 1 oy) oxirgi kunga tushadi. */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
  ).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d;
}

/** To'lovlar ro'yxatidan BrandCategory keshini qayta hisoblaydi (source of truth = payments). */
export function deriveState(
  payments: PaymentInput[],
  activeMonths: number = DEFAULT_ACTIVE_MONTHS
): BrandCategoryState {
  const valid = payments.filter((p) => p.status === "CONFIRMED");
  if (valid.length === 0) {
    return { totalPaid: 0n, reachedAt: null, activeUntil: null };
  }
  let totalPaid = 0n;
  let latest = valid[0].paymentDate;
  for (const p of valid) {
    totalPaid += p.amount;
    if (p.paymentDate > latest) latest = p.paymentDate;
  }
  return {
    totalPaid,
    reachedAt: latest,
    activeUntil: addMonths(latest, activeMonths),
  };
}

export function isActive(
  entry: { activeUntil: Date | null },
  now: Date = new Date()
): boolean {
  return entry.activeUntil !== null && entry.activeUntil > now;
}

/** totalPaid DESC, reachedAt ASC, brandId ASC — to'liq deterministik. */
function compareEntries(a: RankEntry, b: RankEntry): number {
  if (a.totalPaid !== b.totalPaid) return a.totalPaid > b.totalPaid ? -1 : 1;
  const ta = a.reachedAt?.getTime() ?? Infinity;
  const tb = b.reachedAt?.getTime() ?? Infinity;
  if (ta !== tb) return ta - tb;
  return a.brandId < b.brandId ? -1 : a.brandId > b.brandId ? 1 : 0;
}

/** Bitta kategoriya ichidagi reyting: faqat faol brendlar, deterministik tartib. */
export function rankEntries<T extends RankEntry>(
  entries: T[],
  now: Date = new Date()
): RankedEntry<T>[] {
  return entries
    .filter((e) => e.totalPaid > 0n && isActive(e, now))
    .sort(compareEntries)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

/**
 * Bosh sahifa: brendning barcha FAOL kategoriyalaridagi summalar yig'indisi.
 * Muddati o'tgan kategoriya summasi hisoblanmaydi.
 */
export function globalScores<T extends RankEntry>(
  entries: T[],
  now: Date = new Date()
): { brandId: string; totalPaid: bigint; reachedAt: Date | null; rank: number }[] {
  const byBrand = new Map<string, RankEntry>();
  for (const e of entries) {
    if (e.totalPaid <= 0n || !isActive(e, now)) continue;
    const cur = byBrand.get(e.brandId);
    if (!cur) {
      byBrand.set(e.brandId, { ...e });
    } else {
      cur.totalPaid += e.totalPaid;
      // Umumiy yetib borgan vaqt = eng kech reachedAt
      if (e.reachedAt && (!cur.reachedAt || e.reachedAt > cur.reachedAt)) {
        cur.reachedAt = e.reachedAt;
      }
    }
  }
  return [...byBrand.values()]
    .sort(compareEntries)
    .map(({ brandId, totalPaid, reachedAt }, i) => ({
      brandId,
      totalPaid,
      reachedAt,
      rank: i + 1,
    }));
}

export const PREMIUM_COUNT = 3;
export const RED_ZONE_COUNT = 3;
/** Qizil zona faqat premium bilan kesishmasligi uchun kamida shuncha brend bo'lganda ko'rsatiladi */
export const MIN_BRANDS_FOR_RED_ZONE = PREMIUM_COUNT + RED_ZONE_COUNT + 1;
export const EXPIRING_SOON_DAYS = 14;

export type Tier = "premium" | "standard" | "red";

/**
 * Bosh sahifa/kategoriya zonalari — faqat reyting pozitsiyasiga qarab.
 * Qizil zona = ro'yxat oxiridagi 3 o'rin ("reytingning oxirida"), muddat tugashi emas.
 */
export function tierFor(rank: number, total: number): Tier {
  if (rank <= PREMIUM_COUNT) return "premium";
  if (total >= MIN_BRANDS_FOR_RED_ZONE && rank > total - RED_ZONE_COUNT) return "red";
  return "standard";
}

/** Muddati tugashiga necha kun qoldi (faqat yaqin bo'lsa, aks holda null). */
export function expiringInDays(
  activeUntil: Date | null,
  now: Date = new Date()
): number | null {
  if (!activeUntil || activeUntil <= now) return null;
  const days = Math.ceil((activeUntil.getTime() - now.getTime()) / 86_400_000);
  return days <= EXPIRING_SOON_DAYS ? days : null;
}

export type AmountCheck = { ok: true } | { ok: false; error: string };

/** Backend validatsiyasi: butun musbat son va minimal summadan kam emas. */
export function validatePaymentAmount(
  amount: bigint,
  minAmount: bigint = DEFAULT_MIN_PAYMENT
): AmountCheck {
  if (amount <= 0n) return { ok: false, error: "Summa musbat bo'lishi kerak" };
  if (amount < minAmount) {
    return {
      ok: false,
      error: `Minimal summa ${formatSom(minAmount)}`,
    };
  }
  return { ok: true };
}

/** 75000n -> "75 000 so'm" */
export function formatSom(amount: bigint): string {
  const s = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${s} so'm`;
}
