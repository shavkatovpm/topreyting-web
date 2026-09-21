import Link from "next/link";
import { Clock, Crown } from "lucide-react";
import { formatSom } from "@/lib/ranking";
import type { RankedBrand } from "@/lib/public-data";
import { cn } from "@/lib/utils";
import { getDictionary, localeHref, type Locale } from "@/i18n";

const tierStyles = {
  premium: "border-gold/60 bg-gradient-to-br from-gold/15 via-card to-card shadow-md",
  standard: "border-border bg-card",
  red: "border-red-300 bg-red-50/70 dark:bg-red-950/20 dark:border-red-900",
} as const;

const rankStyles = {
  premium: "bg-gold text-foreground",
  standard: "bg-secondary text-foreground",
  red: "bg-red-100 text-red-800",
} as const;

// Pullik havolalar: Google talabi bo'yicha rel="sponsored"
const OUT_REL = "sponsored nofollow noopener noreferrer";

export function BrandRow({
  item,
  lang,
  categorySlug,
}: {
  item: RankedBrand;
  lang: Locale;
  /** Brend sahifasiga havola qaysi kategoriya ostida bo'lishi (standart: birinchi kategoriya) */
  categorySlug?: string;
}) {
  const t = getDictionary(lang).rank;
  const { brand, rank, total, tier, expiresInDays, categories } = item;
  const cat = categorySlug ?? categories[0]?.slug;
  const href = localeHref(lang, `/${cat}/${brand.slug}`);

  const links = [
    { url: brand.websiteUrl, label: t.site },
    { url: brand.telegramUrl, label: "Telegram" },
    { url: brand.instagramUrl, label: "Instagram" },
  ].filter((l): l is { url: string; label: string } => !!l.url);

  return (
    <article
      className={cn("flex gap-4 rounded-2xl border p-4 md:p-5 transition-shadow hover:shadow-md", tierStyles[tier])}
      data-tier={tier}
    >
      <div
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-full text-base font-bold tabular-nums md:h-12 md:w-12",
          rankStyles[tier]
        )}
        aria-label={`${t.rankLabel}: ${rank}`}
      >
        {rank}
      </div>

      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoUrl}
          alt=""
          loading="lazy"
          className="hidden h-12 w-12 shrink-0 rounded-lg border border-border bg-white object-contain sm:block"
        />
      ) : (
        <div
          aria-hidden
          className="hidden h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-lg font-bold text-primary sm:grid"
        >
          {brand.name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-lg font-semibold leading-tight">
            <Link href={href} className="hover:text-primary">
              {brand.name}
            </Link>
          </h3>
          {tier === "premium" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/25 px-2 py-0.5 text-xs font-semibold">
              <Crown size={12} aria-hidden /> {t.premium}
            </span>
          )}
          {tier === "red" && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
              {t.redZone}
            </span>
          )}
          {expiresInDays !== null && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
              <Clock size={12} aria-hidden /> {expiresInDays} {t.daysLeft}
            </span>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{brand.shortDescription}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {categories.map((c) => (
            <Link key={c.slug} href={localeHref(lang, `/${c.slug}`)} className="hover:text-primary">
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold tabular-nums">
            {t.total}: {formatSom(total)}
          </span>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel={OUT_REL}
              className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-secondary"
            >
              {l.label}
            </a>
          ))}
          <Link href={href} className="ml-auto text-sm font-medium text-primary hover:underline">
            {t.details} →
          </Link>
        </div>
      </div>
    </article>
  );
}
