import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { isLocale, locales, localeHref, type Locale } from "@/i18n/config";

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

  const isRu = lang === "ru";
  return {
    alternates: {
      canonical: localeHref(lang),
      languages: {
        uz: localeHref("uz"),
        ru: localeHref("ru"),
        "x-default": localeHref("uz"),
      },
    },
    openGraph: {
      type: "website",
      locale: isRu ? "ru_RU" : "uz_UZ",
      url: `${site.url}${localeHref(lang)}`,
      siteName: site.name,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <>
      <Header lang={locale} />
      <main className="flex-1">{children}</main>
      <Footer lang={locale} />
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
    </>
  );
}
