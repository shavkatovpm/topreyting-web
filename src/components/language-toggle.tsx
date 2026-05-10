"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "topreyting_lang";

type Lang = "uz" | "ru";

export function LanguageToggle({ className }: { className?: string }) {
  const [lang, setLang] = useState<Lang>("uz");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Lang | null) ?? "uz";
    setLang(saved);
    document.documentElement.lang = saved;
    setHydrated(true);
  }, []);

  const toggle = () => {
    const next: Lang = lang === "uz" ? "ru" : "uz";
    setLang(next);
    document.documentElement.lang = next;
    localStorage.setItem(STORAGE_KEY, next);
  };

  if (!hydrated) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex h-10 w-[64px] items-center justify-center rounded-md border border-border bg-background",
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "uz" ? "Switch to Russian" : "O'zbekchaga o'tish"}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-semibold uppercase tracking-wider hover:bg-secondary transition-colors",
        className
      )}
    >
      <Languages size={14} className="text-primary" />
      <span>{lang}</span>
    </button>
  );
}
