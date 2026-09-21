import { cities } from "@/data/cities";
import { getPublicCategories } from "@/lib/public-data";
import { getSettings } from "@/lib/settings";
import { getDictionary, type Locale } from "@/i18n";
import { JoinModal } from "./join-modal";

/** Modal oyna sahifada bir marta render qilinadi (layout'da); tugmalar unga voqea yuboradi. */
export async function JoinModalHost({ lang }: { lang: Locale }) {
  const [categories, settings] = await Promise.all([getPublicCategories(), getSettings()]);
  return (
    <JoinModal
      lang={lang}
      t={getDictionary(lang).join}
      categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
      minAmount={Number(settings.minPaymentAmount)}
      activeMonths={settings.activeMonths}
      paymentDetails={settings.paymentDetails}
    />
  );
}
