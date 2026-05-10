import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  Phone,
  Globe,
  Mail,
  Clock,
  BadgeCheck,
  Trophy,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { categories, getCategory } from "@/data/categories";
import { getCity } from "@/data/cities";
import { listings, getListing, getListingsByCategory } from "@/data/listings";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/cards/listing-card";
import { JsonLd } from "@/components/json-ld";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
} from "@/lib/jsonld";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map((l) => ({
    category: l.category,
    city: l.city,
    slug: l.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; city: string; slug: string }>;
}): Promise<Metadata> {
  const { category: catSlug, city: citySlug, slug } = await params;
  const listing = getListing(slug);
  const category = getCategory(catSlug);
  const city = getCity(citySlug);
  if (!listing || !category || !city) return {};

  const title = `${listing.name} — ${city.name} | Reyting ${listing.rating.toFixed(1)}/5`;
  const description = `${listing.name}: ${listing.shortDescription} ${listing.reviewCount} ta sharh, reyting ${listing.rating.toFixed(1)}. Manzil, telefon, narxlar.`;

  return {
    title,
    description,
    alternates: { canonical: `/${catSlug}/${citySlug}/${slug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/${catSlug}/${citySlug}/${slug}`,
      type: "article",
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ category: string; city: string; slug: string }>;
}) {
  const { category: catSlug, city: citySlug, slug } = await params;
  const listing = getListing(slug);
  const category = getCategory(catSlug);
  const city = getCity(citySlug);

  if (!listing || !category || !city) notFound();
  if (listing.category !== catSlug || listing.city !== citySlug) notFound();

  const related = getListingsByCategory(catSlug)
    .filter((l) => l.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground flex-wrap">
          <li>
            <Link href="/" className="hover:text-foreground">
              <span data-lang="uz">Bosh sahifa</span>
              <span data-lang="ru">Главная</span>
            </Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link href={`/${catSlug}`} className="hover:text-foreground">
              {category.namePlural}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link href={`/${catSlug}/${citySlug}`} className="hover:text-foreground">
              {city.name}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium line-clamp-1">{listing.name}</li>
        </ol>
      </nav>

      <article className="container-page py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* MAIN */}
          <div>
            <header>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                      {listing.name}
                    </h1>
                    {listing.verified && (
                      <BadgeCheck
                        size={26}
                        className="text-primary"
                        aria-label="Tasdiqlangan"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {category.name} · {city.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {listing.rank && listing.rank <= 3 && (
                    <Badge variant="gold" className="text-sm py-1.5 px-3">
                      <Trophy size={14} />
                      TOP-{listing.rank}
                    </Badge>
                  )}
                  {listing.featured && (
                    <Badge variant="primary">
                      <span data-lang="uz">Tavsiya etiladi</span>
                      <span data-lang="ru">Рекомендуется</span>
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <StarRating rating={listing.rating} reviewCount={listing.reviewCount} size="lg" />
                <span className="text-sm text-muted-foreground">
                  <span data-lang="uz">{listing.reviewCount} ta sharh asosida</span>
                  <span data-lang="ru">на основе {listing.reviewCount} отзывов</span>
                </span>
              </div>
            </header>

            <section className="mt-8">
              <h2 className="text-xl font-semibold mb-3">
                <span data-lang="uz">Tavsif</span>
                <span data-lang="ru">Описание</span>
              </h2>
              <div className="prose-article max-w-none">
                {listing.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-4">
                <span data-lang="uz">Xizmatlar</span>
                <span data-lang="ru">Услуги</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {listing.services.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-4">
                <span data-lang="uz">Afzalliklari</span>
                <span data-lang="ru">Преимущества</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {listing.features.map((f) => (
                  <Badge key={f} variant="outline" className="py-1.5">
                    {f}
                  </Badge>
                ))}
              </div>
            </section>

            {listing.faqs.length > 0 && (
              <section className="mt-12 border-t border-border pt-10" id="savol-javob">
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                  <span data-lang="uz">Savol-javoblar</span>
                  <span data-lang="ru">Вопросы и ответы</span>
                </h2>
                <div className="space-y-3">
                  {listing.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group rounded-lg border border-border bg-card p-5 open:bg-secondary/30 transition-colors"
                    >
                      <summary className="font-semibold cursor-pointer list-none flex items-start justify-between gap-4">
                        <span>{faq.q}</span>
                        <span className="text-primary group-open:rotate-45 transition-transform shrink-0">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-muted-foreground leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-12 border-t border-border pt-10" id="sharhlar">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    <span data-lang="uz">Sharhlar</span>
                    <span data-lang="ru">Отзывы</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span data-lang="uz">{listing.reviewCount} ta sharh</span>
                    <span data-lang="ru">отзывов: {listing.reviewCount}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-border bg-background hover:bg-secondary px-4 py-2 text-sm font-medium transition-colors"
                  disabled
                >
                  <span data-lang="uz">Sharh qoldirish</span>
                  <span data-lang="ru">Оставить отзыв</span>
                </button>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-8 text-center">
                <p className="text-muted-foreground">
                  <span data-lang="uz">
                    Sharhlar tizimi tez orada ishga tushadi.
                  </span>
                  <span data-lang="ru">
                    Система отзывов скоро запустится.
                  </span>
                </p>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-4">
                <span data-lang="uz">Kontakt ma&apos;lumotlari</span>
                <span data-lang="ru">Контактные данные</span>
              </h3>
              <div className="space-y-3 text-sm">
                {listing.address && (
                  <div className="flex gap-2">
                    <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{listing.address}</span>
                  </div>
                )}
                {listing.phone && (
                  <a
                    href={`tel:${listing.phone.replace(/\s/g, "")}`}
                    className="flex gap-2 hover:text-primary transition-colors"
                  >
                    <Phone size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{listing.phone}</span>
                  </a>
                )}
                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 hover:text-primary transition-colors"
                  >
                    <Globe size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="break-all">{listing.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
                {listing.email && (
                  <a
                    href={`mailto:${listing.email}`}
                    className="flex gap-2 hover:text-primary transition-colors"
                  >
                    <Mail size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="break-all">{listing.email}</span>
                  </a>
                )}
                {listing.workingHours && (
                  <div className="flex gap-2">
                    <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{listing.workingHours}</span>
                  </div>
                )}
                {listing.yearFounded && (
                  <div className="flex gap-2">
                    <Calendar size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <span data-lang="uz">{listing.yearFounded}-yildan beri</span>
                      <span data-lang="ru">с {listing.yearFounded} года</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {listing.priceRange && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold mb-2 text-sm">
                  <span data-lang="uz">Narxlar</span>
                  <span data-lang="ru">Цены</span>
                </h3>
                <p className="text-lg font-semibold text-primary">{listing.priceRange}</p>
              </div>
            )}

            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-gold/5 p-5">
              <h3 className="font-semibold mb-2 text-sm">
                <span data-lang="uz">Bu siznikingmi?</span>
                <span data-lang="ru">Это ваше?</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                <span data-lang="uz">
                  Sizning bizneslaringizni tasdiqlash va ma&apos;lumotlarni
                  boshqarish uchun ro&apos;yxatdan o&apos;ting.
                </span>
                <span data-lang="ru">
                  Зарегистрируйтесь, чтобы подтвердить свой бизнес и управлять
                  данными.
                </span>
              </p>
              <Link
                href="/qoshish"
                className="block text-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <span data-lang="uz">Tasdiqlash</span>
                <span data-lang="ru">Подтвердить</span>
              </Link>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30 mt-16">
          <div className="container-page py-12">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6">
              <span data-lang="uz">O&apos;xshashlar — {category.namePlural}</span>
              <span data-lang="ru">Похожие — {category.namePlural}</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={[
          localBusinessJsonLd(listing, category, city),
          breadcrumbJsonLd([
            { name: "Bosh sahifa", url: "/" },
            { name: category.namePlural, url: `/${catSlug}` },
            { name: city.name, url: `/${catSlug}/${citySlug}` },
            { name: listing.name, url: `/${catSlug}/${citySlug}/${slug}` },
          ]),
          ...(listing.faqs.length > 0 ? [faqJsonLd(listing.faqs)] : []),
        ]}
      />
    </>
  );
}
