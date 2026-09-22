"use client";

import { useState } from "react";
import { Field, inputCls } from "../../_components/ui";
import { quickCreateCategory } from "../../actions/category";

type Cat = { id: string; name: string; status: string };

/** Kategoriya checklisti + "kerakli kategoriya yo'q" holati uchun joyida yaratish. */
export function CategoryPicker({
  initial,
  selected,
}: {
  initial: Cat[];
  selected: string[];
}) {
  const [categories, setCategories] = useState(initial);
  const [checked, setChecked] = useState<Set<string>>(new Set(selected));
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function submitNew() {
    const name = newName.trim();
    if (name.length < 3) {
      setError("Kamida 3 belgi");
      return;
    }
    setPending(true);
    setError(null);
    const res = await quickCreateCategory(name);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCategories((prev) =>
      [...prev, { id: res.id, name: res.name, status: "UNPUBLISHED" }].sort((a, b) => a.name.localeCompare(b.name))
    );
    setChecked((prev) => new Set(prev).add(res.id));
    setNewName("");
    setAdding(false);
  }

  return (
    <Field group label="Kategoriyalar" hint="Kamida bittasini tanlang. To'lov aynan kategoriya bo'yicha hisoblanadi.">
      <div className="space-y-3">
        {categories.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((c) => {
              const hidden = c.status === "UNPUBLISHED";
              return (
                <label
                  key={c.id}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    hidden ? "border-amber-200 bg-amber-50" : "border-border bg-background"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={c.id}
                    checked={checked.has(c.id)}
                    onChange={() => toggle(c.id)}
                  />
                  {c.name}
                  {hidden && (
                    <span className="ml-auto text-xs font-medium text-amber-700">
                      yashirin — saytda ko&apos;rinmaydi
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}

        {adding ? (
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-border p-3">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitNew();
                }
              }}
              placeholder="Yangi kategoriya nomi"
              className={`${inputCls} max-w-xs`}
            />
            <button
              type="button"
              onClick={submitNew}
              disabled={pending}
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {pending ? "Qo'shilmoqda…" : "Qo'shish"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setNewName("");
                setError(null);
              }}
              className="text-xs text-muted-foreground underline"
            >
              Bekor qilish
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="text-sm text-primary hover:underline">
            + Kerakli kategoriya yo&apos;q, yangi qo&apos;shish
          </button>
        )}
        {error && <p className="text-xs text-red-700">{error}</p>}
        {adding && (
          <p className="text-xs text-muted-foreground">
            Yangi kategoriya avval yashirin bo&apos;ladi — uni &laquo;Kategoriyalar&raquo; bo&apos;limida SEO matni bilan
            to&apos;ldirib nashr qiling.
          </p>
        )}
      </div>
    </Field>
  );
}
