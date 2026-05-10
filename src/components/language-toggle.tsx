"use client";

import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { locales, type Locale } from "@/i18n/config";

export function LanguageToggle({
  currentLang,
  className,
}: {
  currentLang: Locale;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const next: Locale = currentLang === "uz" ? "ru" : "uz";

  const handleClick = () => {
    // Replace the first segment (current locale) with the new locale
    const segments = pathname.split("/");
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const target = segments.join("/") || `/${next}`;

    // Persist via cookie so middleware respects future visits
    document.cookie = `topreyting_lang=${next};path=/;max-age=31536000;samesite=lax`;
    router.push(target);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        next === "ru" ? "Switch to Russian" : "O'zbekchaga o'tish"
      }
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-semibold uppercase tracking-wider hover:bg-secondary transition-colors",
        className
      )}
    >
      <Languages size={14} className="text-primary" />
      <span>{currentLang}</span>
    </button>
  );
}
