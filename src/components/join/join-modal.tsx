"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { Dictionary, Locale } from "@/i18n";
import { OPEN_JOIN_EVENT } from "./join-button";

type Join = Dictionary["join"];
type Option = { slug: string; name: string };

type Props = {
  lang: Locale;
  t: Join;
  categories: Option[];
  cities: Option[];
  minAmount: number;
  activeMonths: number;
  paymentDetails: string;
};

const MIN_SHORT = 50;
const MIN_FULL = 200;
const MAX_FILE = 5 * 1024 * 1024;

const empty = {
  name: "",
  categorySlug: "",
  city: "",
  shortDescription: "",
  fullDescription: "",
  websiteUrl: "",
  instagramUrl: "",
  telegramUrl: "",
  phone: "",
  address: "",
  priceRange: "",
  workingHours: "",
  services: "",
  contactName: "",
  contactPhone: "",
  agree: false,
  amount: "",
};
type Fields = typeof empty;

// Server qaytaradigan xato kodi qaysi bosqichga tegishli ekani
const STEP_OF: Record<string, number> = {
  name: 0, category: 0, short: 0, full: 0,
  url: 1,
  contact: 2, agree: 2,
  amount: 3, receiptMissing: 3, receiptType: 3, receiptSize: 3,
};

const input =
  "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const area =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const btnPrimary =
  "inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50";
const btnGhost =
  "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium hover:bg-secondary";

const money = (n: number, lang: Locale) =>
  `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${lang === "ru" ? "сум" : "so'm"}`;

export function JoinModal({ lang, t, categories, cities, minAmount, activeMonths, paymentDetails }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Fields>({ ...empty, amount: String(minAmount) });
  const [file, setFile] = useState<File | null>(null);
  const [hp, setHp] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((p) => ({ ...p, [k]: v }));

  const reset = useCallback(() => {
    setStep(0);
    setF({ ...empty, amount: String(minAmount) });
    setFile(null);
    setError(null);
    setDone(false);
  }, [minAmount]);

  // Sahifadagi istalgan "Reytingga qo'shilish" tugmasi oynani ochadi
  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<{ categorySlug?: string }>).detail?.categorySlug;
      if (slug && categories.some((c) => c.slug === slug)) setF((p) => ({ ...p, categorySlug: slug }));
      dialogRef.current?.showModal();
    };
    window.addEventListener(OPEN_JOIN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_JOIN_EVENT, onOpen);
  }, [categories]);

  const close = () => dialogRef.current?.close();

  function validate(s: number): string | null {
    const e = t.errors;
    if (s === 0) {
      if (f.name.trim().length < 2) return e.name;
      if (!f.categorySlug) return e.category;
      if (f.shortDescription.trim().length < MIN_SHORT) return e.short;
      if (f.fullDescription.trim().length < MIN_FULL) return e.full;
    }
    if (s === 2) {
      if (f.contactName.trim().length < 2 || f.contactPhone.trim().length < 5) return e.contact;
      if (!f.agree) return e.agree;
    }
    if (s === 3) {
      const amount = Number(f.amount.replace(/[\s,._]/g, ""));
      if (!Number.isFinite(amount) || amount < minAmount) return e.amount;
      if (!file) return e.receiptMissing;
      if (file.size > MAX_FILE) return e.receiptSize;
    }
    return null;
  }

  function next() {
    const err = validate(step);
    setError(err);
    if (!err) setStep((s) => s + 1);
  }

  async function submit() {
    const err = validate(3);
    setError(err);
    if (err) return;
    setBusy(true);
    try {
      const fd = new FormData();
      for (const [k, v] of Object.entries(f)) fd.set(k, typeof v === "boolean" ? (v ? "on" : "") : v);
      fd.set("receipt", file!);
      fd.set("lang", lang);
      fd.set("hp", hp);
      const res = await fetch("/api/submissions", { method: "POST", body: fd });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (json?.ok) {
        setDone(true);
      } else {
        const code = json?.error ?? "server";
        setError((t.errors as Record<string, string>)[code] ?? t.errors.server);
        if (code in STEP_OF) setStep(STEP_OF[code]);
      }
    } catch {
      setError(t.errors.server);
    } finally {
      setBusy(false);
    }
  }

  const catName = categories.find((c) => c.slug === f.categorySlug)?.name ?? "";
  const label = "mb-1 block text-sm font-medium";
  const hint = "mt-1 block text-xs text-muted-foreground";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="join-title"
      onClose={() => {
        if (done) reset();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      className="m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50 open:flex"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 id="join-title" className="text-lg font-bold">{t.modalTitle}</h2>
          {!done && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t.step} {step + 1} {t.of} 4 · {t.steps[step]}
            </p>
          )}
        </div>
        <button type="button" onClick={close} aria-label={t.close} className="rounded-md p-1.5 hover:bg-secondary">
          <X size={18} />
        </button>
      </div>

      {!done && (
        <div className="flex gap-1.5 px-5 pt-4" aria-hidden>
          {t.steps.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold">{t.successTitle}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t.successText}</p>
            <button type="button" onClick={close} className={`${btnPrimary} mt-6`}>{t.close}</button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* honeypot: odam ko'rmaydi va to'ldirmaydi */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {step === 0 && (
              <>
                <div>
                  <label className={label} htmlFor="j-name">{t.name} *</label>
                  <input id="j-name" className={input} value={f.name} maxLength={100} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label} htmlFor="j-cat">{t.category} *</label>
                    <select id="j-cat" className={input} value={f.categorySlug} onChange={(e) => set("categorySlug", e.target.value)}>
                      <option value="">{t.choose}</option>
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={label} htmlFor="j-city">{t.city}</label>
                    <select id="j-city" className={input} value={f.city} onChange={(e) => set("city", e.target.value)}>
                      <option value="">—</option>
                      {cities.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={label} htmlFor="j-short">{t.shortDescription} *</label>
                  <textarea id="j-short" rows={3} maxLength={300} className={area} value={f.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
                  <span className={hint}>{t.shortHint} ({f.shortDescription.trim().length}/{MIN_SHORT})</span>
                </div>
                <div>
                  <label className={label} htmlFor="j-full">{t.fullDescription} *</label>
                  <textarea id="j-full" rows={6} maxLength={8000} className={area} value={f.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} />
                  <span className={hint}>{t.fullHint} ({f.fullDescription.trim().length}/{MIN_FULL})</span>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label} htmlFor="j-site">{t.website}</label>
                    <input id="j-site" type="url" inputMode="url" placeholder="https://" className={input} value={f.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} />
                  </div>
                  <div>
                    <label className={label} htmlFor="j-phone">{t.phone}</label>
                    <input id="j-phone" type="tel" placeholder="+998 ..." className={input} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className={label} htmlFor="j-ig">{t.instagram}</label>
                    <input id="j-ig" placeholder="@nom yoki https://" className={input} value={f.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
                  </div>
                  <div>
                    <label className={label} htmlFor="j-tg">{t.telegram}</label>
                    <input id="j-tg" placeholder="@nom yoki https://" className={input} value={f.telegramUrl} onChange={(e) => set("telegramUrl", e.target.value)} />
                  </div>
                  <div>
                    <label className={label} htmlFor="j-addr">{t.address}</label>
                    <input id="j-addr" className={input} value={f.address} onChange={(e) => set("address", e.target.value)} />
                  </div>
                  <div>
                    <label className={label} htmlFor="j-hours">{t.workingHours}</label>
                    <input id="j-hours" className={input} value={f.workingHours} onChange={(e) => set("workingHours", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={label} htmlFor="j-price">{t.priceRange}</label>
                  <input id="j-price" className={input} value={f.priceRange} onChange={(e) => set("priceRange", e.target.value)} />
                </div>
                <div>
                  <label className={label} htmlFor="j-serv">{t.services}</label>
                  <textarea id="j-serv" rows={4} className={area} value={f.services} onChange={(e) => set("services", e.target.value)} />
                  <span className={hint}>{t.servicesHint}</span>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.review}</p>
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-muted-foreground">{catName}</p>
                  <p className="mt-2 line-clamp-3 text-muted-foreground">{f.shortDescription}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label} htmlFor="j-cn">{t.contactName} *</label>
                    <input id="j-cn" className={input} value={f.contactName} onChange={(e) => set("contactName", e.target.value)} />
                  </div>
                  <div>
                    <label className={label} htmlFor="j-cp">{t.contactPhone} *</label>
                    <input id="j-cp" className={input} value={f.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
                  </div>
                </div>
                <span className={hint}>{t.contactHint}</span>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} />
                  <span>{t.agree}</span>
                </label>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-sm text-muted-foreground">
                  {t.payIntro.replace("{min}", money(minAmount, lang)).replace("{months}", String(activeMonths))}
                </p>
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.payTo}</p>
                  <p className="whitespace-pre-line text-sm font-medium">{paymentDetails.trim() || t.payToEmpty}</p>
                </div>
                <div>
                  <label className={label} htmlFor="j-amount">{t.amount} *</label>
                  <input id="j-amount" inputMode="numeric" className={input} value={f.amount} onChange={(e) => set("amount", e.target.value)} />
                </div>
                <div>
                  <label className={label} htmlFor="j-file">{t.receipt} *</label>
                  <input
                    id="j-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <span className={hint}>{t.receiptHint}</span>
                </div>
              </>
            )}

            <p role="alert" aria-live="polite" className={error ? "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" : "sr-only"}>
              {error}
            </p>
          </div>
        )}
      </div>

      {!done && (
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          {step > 0 ? (
            <button type="button" className={btnGhost} onClick={() => { setError(null); setStep(step - 1); }} disabled={busy}>
              {t.back}
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" className={btnPrimary} onClick={next}>{t.next}</button>
          ) : (
            <button type="button" className={btnPrimary} onClick={submit} disabled={busy}>
              {busy ? t.sending : t.submit}
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
