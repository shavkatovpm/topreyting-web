export const locales = ["uz", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, { native: string; english: string }> = {
  uz: { native: "O'zbekcha", english: "Uzbek" },
  ru: { native: "Русский", english: "Russian" },
};

/**
 * Build a locale-aware browser URL.
 * UZ (default) lives at the root — no prefix.
 * RU lives under /ru/* prefix.
 *
 *   localeHref("uz")               → "/"
 *   localeHref("uz", "/maqolalar") → "/maqolalar"
 *   localeHref("ru")               → "/ru"
 *   localeHref("ru", "/maqolalar") → "/ru/maqolalar"
 */
export function localeHref(locale: Locale, path = ""): string {
  const p = path && !path.startsWith("/") ? `/${path}` : path;
  if (locale === defaultLocale) return p || "/";
  return `/${locale}${p}`;
}
