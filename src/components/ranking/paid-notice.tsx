import Link from "next/link";
import { Info } from "lucide-react";
import { getDictionary, localeHref, type Locale } from "@/i18n";

/** Pullik reyting ekanini ochiq ko'rsatuvchi izoh. Reyting ko'rsatilgan har sahifada bo'lishi shart. */
export function PaidNotice({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).rank;
  return (
    <p
      role="note"
      className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground"
    >
      <Info size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
      <span>
        {t.notice}{" "}
        <Link href={localeHref(lang, "/biz-haqimizda")} className="text-primary hover:underline">
          {t.noticeMore}
        </Link>
      </span>
    </p>
  );
}
