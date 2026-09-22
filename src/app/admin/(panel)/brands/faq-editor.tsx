"use client";

import { useState } from "react";
import { inputCls, textareaCls } from "../../_components/ui";

type Faq = { q: string; a: string };

/**
 * "Savol | Javob" bitta qatorga yozish o'rniga alohida maydonlar — xato qilish qiyinroq.
 * Natija yashirin `faqsJson` maydoniga JSON sifatida yoziladi (server shuni o'qiydi).
 */
export function FaqEditor({ initial }: { initial: Faq[] }) {
  const [items, setItems] = useState<Faq[]>(initial);

  function update(i: number, key: "q" | "a", value: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  const clean = items.filter((it) => it.q.trim() && it.a.trim());

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border p-3">
          <input
            value={it.q}
            onChange={(e) => update(i, "q", e.target.value)}
            placeholder="Savol"
            className={inputCls}
          />
          <textarea
            value={it.a}
            onChange={(e) => update(i, "a", e.target.value)}
            placeholder="Javob"
            rows={2}
            className={textareaCls}
          />
          <button type="button" onClick={() => remove(i)} className="text-xs text-red-700 underline">
            Bu savolni o&apos;chirish
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { q: "", a: "" }])}
        className="text-sm text-primary hover:underline"
      >
        + Savol qo&apos;shish
      </button>
      <input type="hidden" name="faqsJson" value={JSON.stringify(clean)} />
    </div>
  );
}
