import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { JoinButton } from "@/components/join/join-button";
import { PaidNotice } from "@/components/ranking/paid-notice";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { formatSom } from "@/lib/ranking";
import { getSettings } from "@/lib/settings";
import { getDictionary, isLocale, localeHref, type Locale } from "@/i18n";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Reytingga qo'shilish — brendingizni Topreyting'ga joylang",
  description:
    "Brendingizni kategoriya reytingiga qo'shing: 4 bosqichli ariza, to'lov cheki bilan. Tasdiqlangach e'lon avtomatik joylanadi.",
  alternates: { canonical: "/qoshish" },
};

const copy = {
  uz: {
    title: "Brendingizni Topreyting reytingiga qo'shing",
    lead: "Reytingdagi o'rin brend platformaga kiritgan jami hissasiga qarab avtomatik belgilanadi. Summa ochiq ko'rsatiladi.",
    howTitle: "Qanday ishlaydi",
    steps: [
      "Ariza to'ldiriladi: brend, aloqa ma'lumotlari va tasdiq (3 bosqich)",
      "To'lov qilinadi va chek yuklanadi (4-bosqich)",
      "Adminlar chekni tekshirib tasdiqlaydi",
      "Brend reytingda avtomatik paydo bo'ladi",
    ],
    rules: (min: string, months: number) => [
      `Minimal to'lov: ${min}`,
      `Har bir to'lov brendni ${months} oyga faollashtiradi`,
      `${months} oy davomida to'lanmasa, brend reytingdan chiqadi; qayta to'lasa, avvalgi summa bilan qaytadi`,
      "Qo'shimcha to'lov summani oshiradi va o'rinni yuqoriga ko'taradi",
    ],
  },
  ru: {
    title: "Добавьте бренд в рейтинг Topreyting",
    lead: "Место в рейтинге определяется автоматически суммарным взносом бренда на платформу. Сумма указана открыто.",
    howTitle: "Как это работает",
    steps: [
      "Заполняется заявка: бренд, контакты и подтверждение (3 шага)",
      "Выполняется оплата и загружается чек (4-й шаг)",
      "Администраторы проверяют чек и подтверждают",
      "Бренд автоматически появляется в рейтинге",
    ],
    rules: (min: string, months: number) => [
      `Минимальный платёж: ${min}`,
      `Каждый платёж активирует бренд на ${months} мес.`,
      `Если за ${months} мес. оплаты нет, бренд исчезает из рейтинга; после оплаты возвращается с прежней суммой`,
      "Дополнительный платёж увеличивает сумму и поднимает место",
    ],
  },
} as const;

export default async function AddListingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = getDictionary(locale);
  const c = copy[locale];
  const settings = await getSettings();
  const min = formatSom(settings.minPaymentAmount);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href={localeHref(locale)} className="hover:text-foreground">{t.common.home}</Link>
          </li>
          <ChevronRight size={14} />
          <li className="font-medium text-foreground">{t.join.cta}</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{c.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{c.lead}</p>

          <div className="mt-6">
            <PaidNotice lang={locale} />
          </div>

          <h2 className="mb-4 mt-10 text-xl font-semibold">{c.howTitle}</h2>
          <ol className="space-y-3">
            {c.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {c.rules(min, settings.activeMonths).map((r) => (
              <li key={r} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                {r}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <JoinButton className="h-12 px-6 text-base">{t.join.cta}</JoinButton>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.common.home, url: "/" },
          { name: t.join.cta, url: "/qoshish" },
        ])}
      />
    </>
  );
}
