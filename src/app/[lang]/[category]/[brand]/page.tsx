import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronRight, MapPin, Phone, Globe, Clock, CheckCircle2, Calendar, Crown } from "lucide-react";
import { cities } from "@/data/cities";
import { BrandRow } from "@/components/ranking/brand-row";
import { PaidNotice } from "@/components/ranking/paid-notice";
import { JoinButton } from "@/components/join/join-button";
import { JsonLd } from "@/components/json-ld";
import { brandJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { getBrandPage, resolveSlugRedirect } from "@/lib/public-data";
import { formatSom } from "@/lib/ranking";
import { site } from "@/lib/site";
import { getDictionary, isLocale, localeHref, type Locale } from "@/i18n";

export const revalidate = 600;

type Params = { lang: string; category: string; brand: string };

const OUT_REL = "sponsored nofollow noopener noreferrer";
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category: catSlug, brand: brandSlug } = await params;
  const page = await getBrandPage(catSlug, brandSlug);
  if (!page) return {};
  const { brand } = page.current;
  const title = `${brand.name} — ${page.category.name}: manzil, narxlar, aloqa`;
  const description = brand.shortDescription.slice(0, 160);
  // Kontent faqat o'zbek tilida: RU sahifa ham UZ manzilga canonical
  const canonical = `/${catSlug}/${brand.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${site.url}${canonical}`,
      type: "website",
      images: brand.logoUrl ? [{ url: brand.logoUrl }] : undefined,
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function BrandPage({ params }: { params: Promise<Params> }) {
  const { lang, category: catSlug, brand: brandSlug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const page = await getBrandPage(catSlug, brandSlug);
  if (!page) {
    // Eski shahar sahifasi (/kategoriya/shahar) -> kategoriya
    if (cities.some((c) => c.slug === brandSlug)) permanentRedirect(localeHref(locale, `/${catSlug}`));
    // Slug o'zgargan bo'lsa -> yangi slug
    const renamed = await resolveSlugRedirect("brand", brandSlug);
    if (renamed) permanentRedirect(localeHref(locale, `/${catSlug}/${renamed}`));
    notFound();
  }

  const t = getDictionary(locale);
  const { category, current, others, totalInCategory, otherCategories } = page;
  const { brand, rank, total, tier, expiresInDays } = current;
  const city = cities.find((c) => c.slug === brand.city);
  const services = arr(brand.services);
  const features = arr(brand.features);
  const faqs = (Array.isArray(brand.faqs) ? brand.faqs : []) as { q: string; a: string }[];

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href={localeHref(locale)} className="hover:text-foreground">
              {t.common.home}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link href={localeHref(locale, `/${category.slug}`)} className="hover:text-foreground">
              {category.name}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="line-clamp-1 font-medium text-foreground">{brand.name}</li>
        </ol>
      </nav>

      <article className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <header>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{brand.name}</h1>
              <p className="mt-1 text-muted-foreground">
                {category.name}
                {city && ` · ${city.name}`}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-md bg-secondary px-3 py-1.5 font-semibold">
                  {t.rank.rankLabel}: #{rank} <span className="font-normal text-muted-foreground">/ {totalInCategory} {t.rank.totalInCategory}</span>
                </span>
                <span className="rounded-md bg-secondary px-3 py-1.5 font-semibold tabular-nums">
                  {t.rank.total}: {formatSom(total)}
                </span>
                {tier === "premium" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/25 px-2.5 py-1 text-xs font-semibold">
                    <Crown size={12} aria-hidden /> {t.rank.premium}
                  </span>
                )}
                {expiresInDays !== null && (
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                    {expiresInDays} {t.rank.daysLeft}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <PaidNotice lang={locale} />
              </div>
            </header>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">{t.rank.description}</h2>
              <div className="prose-article max-w-none">
                {brand.fullDescription.split(/\n\s*\n/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {services.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">{t.rank.services}</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {services.map((s) => (
                    <div key={s} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                      <CheckCircle2 size={16} className="shrink-0 text-primary" />
                      <span className="text-sm">{s}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {features.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">{t.rank.features}</h2>
                <ul className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <li key={f} className="rounded-full border border-border px-3 py-1.5 text-sm">
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {faqs.length > 0 && (
              <section className="mt-12 border-t border-border pt-10">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">{t.rank.faq}</h2>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group rounded-lg border border-border bg-card p-5 open:bg-secondary/30">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold">
                        <span>{faq.q}</span>
                        <span className="shrink-0 text-primary transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 leading-relaxed text-muted-foreground">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-semibold">{t.rank.contacts}</h3>
              <div className="space-y-3 text-sm">
                {brand.address && (
                  <div className="flex gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{brand.address}</span>
                  </div>
                )}
                {brand.phone && (
                  <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:text-primary">
                    <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{brand.phone}</span>
                  </a>
                )}
                {brand.websiteUrl && (
                  <a href={brand.websiteUrl} target="_blank" rel={OUT_REL} className="flex gap-2 hover:text-primary">
                    <Globe size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span className="break-all">{brand.websiteUrl.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
                {brand.workingHours && (
                  <div className="flex gap-2">
                    <Clock size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{brand.workingHours}</span>
                  </div>
                )}
                {brand.yearFounded && (
                  <div className="flex gap-2">
                    <Calendar size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">
                      {brand.yearFounded} {t.rank.foundedSince}
                    </span>
                  </div>
                )}
                {(brand.telegramUrl || brand.instagramUrl) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {brand.telegramUrl && (
                      <a href={brand.telegramUrl} target="_blank" rel={OUT_REL} className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-secondary">
                        Telegram
                      </a>
                    )}
                    {brand.instagramUrl && (
                      <a href={brand.instagramUrl} target="_blank" rel={OUT_REL} className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-secondary">
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {brand.priceRange && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 text-sm font-semibold">{t.rank.price}</h3>
                <p className="text-lg font-semibold text-primary">{brand.priceRange}</p>
              </div>
            )}

            {otherCategories.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 text-sm font-semibold">{t.rank.alsoIn}</h3>
                <ul className="space-y-1 text-sm">
                  {otherCategories.map((c) => (
                    <li key={c.slug}>
                      <Link href={localeHref(locale, `/${c.slug}/${brand.slug}`)} className="text-primary hover:underline">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-gold/5 p-5">
              <JoinButton categorySlug={category.slug} className="w-full">
                {t.join.cta}
              </JoinButton>
            </div>
          </aside>
        </div>
      </article>

      {others.length > 0 && (
        <section className="mt-12 border-t border-border bg-secondary/30">
          <div className="container-page py-12">
            <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">{t.rank.others}</h2>
            <div className="space-y-3">
              {others.map((item) => (
                <BrandRow key={item.brand.id} item={item} lang={locale} categorySlug={category.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={[
          brandJsonLd(brand, category.slug),
          breadcrumbJsonLd([
            { name: t.common.home, url: "/" },
            { name: category.name, url: `/${category.slug}` },
            { name: brand.name, url: `/${category.slug}/${brand.slug}` },
          ]),
          ...(faqs.length > 0 ? [faqJsonLd(faqs)] : []),
        ]}
      />
    </>
  );
}
