import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronRight, Trophy } from "lucide-react";
import { getCategoryVisual } from "@/data/categories";
import { BrandRow } from "@/components/ranking/brand-row";
import { PaidNotice } from "@/components/ranking/paid-notice";
import { JoinButton } from "@/components/join/join-button";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { getCategoryRanking, resolveSlugRedirect } from "@/lib/public-data";
import { site } from "@/lib/site";
import { getDictionary, isLocale, localeHref, type Locale } from "@/i18n";

// Admin o'zgartirsa darhol yangilanadi (revalidatePublic); muddat tugashi uchun har 10 daqiqada
export const revalidate = 600;

type Params = { lang: string; category: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category: slug } = await params;
  const data = await getCategoryRanking(slug);
  if (!data) return {};
  const { category, items } = data;
  // Kontent faqat o'zbek tilida: RU sahifa ham UZ manzilga canonical bo'ladi (dublikat yo'q)
  const canonical = `/${slug}`;
  const thin = items.length === 0 && !category.longContent.trim();
  return {
    title: category.seoTitle,
    description: category.metaDescription,
    alternates: { canonical },
    robots: thin ? { index: false, follow: true } : undefined,
    openGraph: {
      title: category.seoTitle,
      description: category.metaDescription,
      url: `${site.url}${canonical}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { lang, category: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const data = await getCategoryRanking(slug);
  if (!data) {
    const renamed = await resolveSlugRedirect("category", slug);
    if (renamed) permanentRedirect(localeHref(locale, `/${renamed}`));
    notFound();
  }
  const { category, items } = data;
  const t = getDictionary(locale);
  const { icon: Icon, color } = getCategoryVisual(category.slug);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href={localeHref(locale)} className="hover:text-foreground">
              {t.common.home}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="font-medium text-foreground">{category.name}</li>
        </ol>
      </nav>

      <header className="container-page border-b border-border py-10">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${color} text-white`}
          >
            <Icon size={26} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{category.h1}</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">{category.shortDescription}</p>
            <div className="mt-5">
              <JoinButton categorySlug={category.slug}>{t.join.cta}</JoinButton>
            </div>
          </div>
        </div>
      </header>

      <section className="container-page py-10">
        <div className="mb-6">
          <PaidNotice lang={locale} />
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Trophy size={40} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="mb-4 text-muted-foreground">{t.rank.empty}</p>
            <JoinButton categorySlug={category.slug}>{t.rank.beFirst}</JoinButton>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <BrandRow key={item.brand.id} item={item} lang={locale} categorySlug={category.slug} />
            ))}
          </div>
        )}

        {category.longContent.trim() && (
          <div className="prose-article mt-14 max-w-3xl">
            {category.longContent.split(/\n\s*\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t.common.home, url: "/" },
            { name: category.name, url: `/${category.slug}` },
          ]),
          ...(items.length
            ? [itemListJsonLd(items.map((i) => ({ name: i.brand.name, slug: i.brand.slug })), category.slug)]
            : []),
        ]}
      />
    </>
  );
}
