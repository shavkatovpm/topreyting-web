import test from "node:test";
import assert from "node:assert/strict";
import { detectReceiptType, normalizeUrl, validateBoost, validateSubmission } from "./submission-validation.ts";

const good = {
  name: "Najot Ta'lim",
  categorySlug: "oquv-markazlar",
  shortDescription: "O'quv markazi: dasturlash, dizayn va marketing kurslari Toshkent shahrida.",
  fullDescription: "Najot Ta'lim haqida batafsil ma'lumot. ".repeat(8),
  contactName: "Ali",
  contactPhone: "+998 90 123 45 67",
  agree: "on",
  amount: "50 000",
};
const MIN = 50_000n;

test("to'g'ri ariza qabul qilinadi", () => {
  const r = validateSubmission(good, MIN);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.value.amount, 50_000n);
    assert.equal(r.value.brand.name, "Najot Ta'lim");
  }
});

test("har bir majburiy maydon o'z kodi bilan rad etiladi", () => {
  const code = (patch: Record<string, unknown>) => {
    const r = validateSubmission({ ...good, ...patch }, MIN);
    return r.ok ? "ok" : r.code;
  };
  assert.equal(code({ name: "A" }), "name");
  assert.equal(code({ categorySlug: "" }), "category");
  assert.equal(code({ shortDescription: "qisqa" }), "short");
  assert.equal(code({ fullDescription: "qisqa" }), "full");
  assert.equal(code({ contactPhone: "" }), "contact");
  assert.equal(code({ agree: undefined }), "agree");
  assert.equal(code({ amount: "49 999" }), "amount");
  assert.equal(code({ amount: "abc" }), "amount");
  assert.equal(code({ websiteUrl: "javascript:alert(1)" }), "url");
});

test("minimal summa sozlamadan olinadi", () => {
  assert.equal(validateSubmission({ ...good, amount: "20 000" }, 10_000n).ok, true);
  assert.equal(validateSubmission({ ...good, amount: "20 000" }, 50_000n).ok, false);
});

test("havolalar: faqat http(s), @nom to'liq havolaga aylanadi", () => {
  assert.equal(normalizeUrl("", "site"), undefined);
  assert.equal(normalizeUrl("https://najot.uz", "site"), "https://najot.uz/");
  assert.equal(normalizeUrl("javascript:alert(1)", "site"), null);
  assert.equal(normalizeUrl("data:text/html,x", "site"), null);
  assert.equal(normalizeUrl("@najot_talim", "telegram"), "https://t.me/najot_talim");
  assert.equal(normalizeUrl("@najot", "instagram"), "https://instagram.com/najot");
  assert.equal(normalizeUrl("@najot", "site"), null);
  assert.equal(normalizeUrl("najot uz", "site"), null);
});

test("hissa oshirish: faqat aloqa, summa va brend/kategoriya kerak", () => {
  const boost = {
    boostBrandId: "clx1234567890abcdefghijkl",
    categorySlug: "bizneslar",
    contactName: "Ali",
    contactPhone: "+998 90 123 45 67",
    agree: "on",
    amount: "60 000",
  };
  const code = (patch: Record<string, unknown>) => {
    const r = validateBoost({ ...boost, ...patch }, MIN);
    return r.ok ? "ok" : r.code;
  };
  const ok = validateBoost(boost, MIN);
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.value.amount, 60_000n);
  assert.equal(code({ boostBrandId: "" }), "category");
  assert.equal(code({ categorySlug: "" }), "category");
  assert.equal(code({ contactName: "" }), "contact");
  assert.equal(code({ agree: undefined }), "agree");
  assert.equal(code({ amount: "49 999" }), "amount"); // minimal summa bu yerda ham
  assert.equal(code({ amount: "-5" }), "amount");
});

test("chek turi fayl mazmunidan aniqlanadi (nomiga ishonilmaydi)", () => {
  assert.equal(detectReceiptType(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0]))?.ext, "jpg");
  assert.equal(detectReceiptType(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.ext, "png");
  assert.equal(detectReceiptType(Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]))?.ext, "pdf");
  const webp = Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
  assert.equal(detectReceiptType(webp)?.ext, "webp");
  // SVG/HTML/exe rad etiladi
  assert.equal(detectReceiptType(new TextEncoder().encode("<svg onload=alert(1)>")), null);
  assert.equal(detectReceiptType(new TextEncoder().encode("<html><script>")), null);
  assert.equal(detectReceiptType(Uint8Array.from([0x4d, 0x5a, 0x90, 0])), null);
  assert.equal(detectReceiptType(new Uint8Array(0)), null);
});
