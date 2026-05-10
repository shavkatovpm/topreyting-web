import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Trophy, Users, Sparkles, Shield } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { getDictionary, isLocale, locales, localeHref, type Locale } from "@/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: `${t.about.title} — ${site.name}`,
    description: t.about.intro,
    alternates: {
      canonical: localeHref(lang, "/biz-haqimizda"),
      languages: {
        uz: localeHref("uz", "/biz-haqimizda"),
        ru: localeHref("ru", "/biz-haqimizda"),
        "x-default": localeHref("uz", "/biz-haqimizda"),
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = getDictionary(locale);

  const values = [
    { icon: Shield, title: t.about.val1Title, text: t.about.val1Text },
    { icon: Sparkles, title: t.about.val2Title, text: t.about.val2Text },
    { icon: Users, title: t.about.val3Title, text: t.about.val3Text },
    { icon: Trophy, title: t.about.val4Title, text: t.about.val4Text },
  ];

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href={`/${locale}`} className="hover:text-foreground">
              {t.common.home}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">{t.about.title}</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.about.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t.about.intro}</p>

          <div className="prose-article mt-10">
            <h2>{t.about.missionH}</h2>
            <p>{t.about.missionP}</p>
            <h2>{t.about.whatH}</h2>
            <p>{t.about.whatP}</p>
            <h2>{t.about.valuesH}</h2>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <v.icon size={22} className="text-primary mb-3" />
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.common.home, url: `/${locale}` },
          { name: t.about.title, url: `/${locale}/biz-haqimizda` },
        ])}
      />
    </>
  );
}
