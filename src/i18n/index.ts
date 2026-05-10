import type { Locale } from "./config";
import { uz } from "./dictionaries/uz";
import { ru } from "./dictionaries/ru";

const dictionaries = { uz, ru } as const;

export type Dictionary = typeof uz;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export {
  type Locale,
  locales,
  defaultLocale,
  isLocale,
  localeNames,
  localeHref,
} from "./config";
