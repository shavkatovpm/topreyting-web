import test from "node:test";
import assert from "node:assert/strict";
import {
  addMonths,
  deriveState,
  expiringInDays,
  formatSom,
  tierFor,
  globalScores,
  rankEntries,
  validatePaymentAmount,
  type PaymentInput,
} from "./ranking.ts";

const d = (s: string) => new Date(s + "T00:00:00Z");
const pay = (
  amount: bigint,
  date: string,
  status: PaymentInput["status"] = "CONFIRMED"
): PaymentInput => ({ amount, paymentDate: d(date), status });

const entry = (brandId: string, payments: PaymentInput[]) => ({
  brandId,
  ...deriveState(payments),
});

test("arxitektura misoli: Najot 50k, Mohirdev 70k, Najot +25k", () => {
  const now = d("2026-02-01");
  const najot1 = entry("najot", [pay(50_000n, "2026-01-10")]);
  const mohir = entry("mohirdev", [pay(70_000n, "2026-01-11")]);
  let ranked = rankEntries([najot1, mohir], now);
  assert.deepEqual(ranked.map((r) => r.brandId), ["mohirdev", "najot"]);

  const najot2 = entry("najot", [
    pay(50_000n, "2026-01-10"),
    pay(25_000n, "2026-01-20"),
  ]);
  ranked = rankEntries([najot2, mohir], now);
  assert.deepEqual(ranked.map((r) => r.brandId), ["najot", "mohirdev"]);
  assert.equal(ranked[0].totalPaid, 75_000n);
  assert.equal(ranked[0].rank, 1);
});

test("teng summa: avval yetib kelgan yuqorida, keyin brandId", () => {
  const now = d("2026-02-01");
  const a = entry("b", [pay(100_000n, "2026-01-05")]);
  const b = entry("a", [pay(100_000n, "2026-01-09")]);
  assert.deepEqual(rankEntries([b, a], now).map((r) => r.brandId), ["b", "a"]);

  const c = entry("z", [pay(100_000n, "2026-01-05")]);
  const e = entry("y", [pay(100_000n, "2026-01-05")]);
  assert.deepEqual(rankEntries([c, e], now).map((r) => r.brandId), ["y", "z"]);
});

test("VOID to'lov hisobga olinmaydi va reyting qayta o'zgaradi", () => {
  const s = deriveState([
    pay(50_000n, "2026-01-01"),
    pay(200_000n, "2026-01-15", "VOIDED"),
  ]);
  assert.equal(s.totalPaid, 50_000n);
  assert.deepEqual(s.reachedAt, d("2026-01-01"));
});

test("3 oy to'lamasa brend ko'rinmaydi, yana to'lasa qaytadi", () => {
  const payments = [pay(50_000n, "2026-01-10")];
  const e = entry("x", payments);
  assert.equal(rankEntries([e], d("2026-04-09")).length, 1);
  assert.equal(rankEntries([e], d("2026-04-10")).length, 0);

  const renewed = entry("x", [...payments, pay(50_000n, "2026-04-20")]);
  const ranked = rankEntries([renewed], d("2026-05-01"));
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].totalPaid, 100_000n); // summa yig'ilib boradi
});

test("to'lovlar muddatni yig'maydi: oxirgi to'lov sanasidan 3 oy", () => {
  const s = deriveState([pay(50_000n, "2026-01-10"), pay(50_000n, "2026-01-12")]);
  assert.deepEqual(s.activeUntil, d("2026-04-12"));
});

test("addMonths oy oxirida to'g'ri ishlaydi", () => {
  assert.deepEqual(addMonths(d("2026-01-31"), 1), d("2026-02-28"));
  assert.deepEqual(addMonths(d("2026-11-30"), 3), d("2027-02-28"));
  assert.deepEqual(addMonths(d("2024-11-30"), 3), d("2025-02-28"));
});

test("to'lovsiz brend reytingga tushmaydi", () => {
  const e = entry("x", []);
  assert.equal(rankEntries([e], d("2026-01-01")).length, 0);
});

test("bosh sahifa: faol kategoriyalar summasi yig'iladi, eskirgani hisoblanmaydi", () => {
  const now = d("2026-03-01");
  const rows = [
    { ...entry("najot", [pay(175_000n, "2026-02-01")]) },
    { ...entry("najot", [pay(80_000n, "2026-02-10")]) },
    { ...entry("najot", [pay(999_000n, "2025-06-01")]) }, // muddati o'tgan
    { ...entry("mohirdev", [pay(150_000n, "2026-02-05")]) },
  ];
  const g = globalScores(rows, now);
  assert.deepEqual(g.map((r) => [r.brandId, r.totalPaid]), [
    ["najot", 255_000n],
    ["mohirdev", 150_000n],
  ]);
});

test("minimal summa tekshiruvi (default 50 000)", () => {
  assert.equal(validatePaymentAmount(49_999n).ok, false);
  assert.equal(validatePaymentAmount(50_000n).ok, true);
  assert.equal(validatePaymentAmount(0n).ok, false);
  assert.equal(validatePaymentAmount(-5n).ok, false);
  assert.equal(validatePaymentAmount(20_000n, 10_000n).ok, true);
});

test("zonalar: top 3 premium, oxirgi 3 qizil, kam brendda qizil yo'q", () => {
  const tiers = (total: number) =>
    Array.from({ length: total }, (_, i) => tierFor(i + 1, total));
  assert.deepEqual(tiers(10), [
    "premium", "premium", "premium",
    "standard", "standard", "standard", "standard",
    "red", "red", "red",
  ]);
  assert.deepEqual(tiers(7), [
    "premium", "premium", "premium", "standard", "red", "red", "red",
  ]);
  // 6 va undan kam: qizil zona yo'q (premium bilan kesishmasligi uchun)
  assert.deepEqual(tiers(6), [
    "premium", "premium", "premium", "standard", "standard", "standard",
  ]);
  assert.deepEqual(tiers(2), ["premium", "premium"]);
});

test("muddati yaqinlashgan brend: 14 kundan kam qolsa belgi chiqadi", () => {
  const now = d("2026-04-01");
  assert.equal(expiringInDays(d("2026-04-10"), now), 9);
  assert.equal(expiringInDays(d("2026-04-15"), now), 14);
  assert.equal(expiringInDays(d("2026-04-16"), now), null);
  assert.equal(expiringInDays(d("2026-03-30"), now), null); // allaqachon tugagan
  assert.equal(expiringInDays(null, now), null);
});

test("formatSom", () => {
  assert.equal(formatSom(75_000n), "75 000 so'm");
  assert.equal(formatSom(1_250_000n), "1 250 000 so'm");
});
