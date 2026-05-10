import Link from "next/link";
import { MapPin, Phone, Trophy, BadgeCheck } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Listing } from "@/data/listings";
import { getCity } from "@/data/cities";
import { getCategory } from "@/data/categories";
import { getDictionary, type Locale } from "@/i18n";

type Props = {
  listing: Listing;
  lang: Locale;
  showRank?: boolean;
  className?: string;
};

export function ListingCard({ listing, lang, showRank, className }: Props) {
  const city = getCity(listing.city);
  const category = getCategory(listing.category);
  const href = `/${lang}/${listing.category}/${listing.city}/${listing.slug}`;
  const t = getDictionary(lang);

  return (
    <article
      itemScope
      itemType="https://schema.org/LocalBusiness"
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      {showRank && listing.rank && listing.rank <= 3 && (
        <div className="absolute -top-3 -left-3 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold to-primary text-white shadow-md">
          <Trophy size={16} />
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base leading-tight" itemProp="name">
              <Link href={href} className="hover:text-primary transition-colors">
                <span className="absolute inset-0" aria-hidden />
                {listing.name}
              </Link>
            </h3>
            {listing.verified && (
              <BadgeCheck
                size={16}
                className="text-primary shrink-0"
                aria-label={t.listing.verified}
              />
            )}
          </div>
          {category && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {category.name}
              {city && ` · ${city.name}`}
            </p>
          )}
        </div>
        {listing.featured && (
          <Badge variant="gold" className="shrink-0">
            TOP
          </Badge>
        )}
      </div>

      <p
        className="text-sm text-muted-foreground line-clamp-2 mb-4"
        itemProp="description"
      >
        {listing.shortDescription}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border">
        <StarRating rating={listing.rating} reviewCount={listing.reviewCount} size="sm" />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {listing.address && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              <span className="truncate max-w-[120px]">{city?.name}</span>
            </span>
          )}
          {listing.phone && (
            <span className="inline-flex items-center gap-1 hidden sm:inline-flex">
              <Phone size={12} />
            </span>
          )}
        </div>
      </div>

      <meta itemProp="url" content={href} />
    </article>
  );
}
