import { notFound, permanentRedirect } from "next/navigation";
import { getBrandPage, resolveSlugRedirect } from "@/lib/public-data";
import { localeHref, isLocale } from "@/i18n";

// Eski URL: /{kategoriya}/{shahar}/{brend}. Yangi URL: /{kategoriya}/{brend}.
// Google'da indekslangan eski havolalar 301 bilan yangisiga o'tadi.
export default async function LegacyListingRedirect({
  params,
}: {
  params: Promise<{ lang: string; category: string; brand: string; slug: string }>;
}) {
  const { lang, category, slug } = await params;
  if (!isLocale(lang)) notFound();

  const target = (await resolveSlugRedirect("brand", slug)) ?? slug;
  const page = await getBrandPage(category, target);
  if (page) permanentRedirect(localeHref(lang, `/${category}/${target}`));
  // Brend endi ko'rinmaydi (muddati tugagan/yashirin) — kategoriya sahifasiga
  permanentRedirect(localeHref(lang, `/${category}`));
}
