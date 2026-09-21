import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2, TrendingUp, Target, Award } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Reklama — Top Reyting platformasida brendingizni reklama qiling",
  description:
    "Top Reyting'da reklama imkoniyatlari: TOP joylashuv, banner reklama, sponsorlik. Mijozlar topish uchun.",
  alternates: { canonical: "/reklama" },
};

const features = [
  {
    icon: Target,
    uzTitle: "Targetlangan",
    ruTitle: "Целевая",
    uzText: "Aniq qaror qabul qilayotgan auditoriya",
    ruText: "Аудитория, готовая принимать решения",
  },
  {
    icon: Award,
    uzTitle: "Ishonchli",
    ruTitle: "Надёжная",
    uzText: "Mustaqil tahlil platformasi",
    ruText: "Независимая аналитическая платформа",
  },
  {
    icon: TrendingUp,
    uzTitle: "O'sayotgan",
    ruTitle: "Растущая",
    uzText: "Yangi platforma — birinchilardan bo'ling",
    ruText: "Новая платформа — будьте среди первых",
  },
];

const plans = [
  {
    uzName: "Standart ro'yxat",
    ruName: "Стандартный",
    items: [
      { uz: "Tashkilot ma'lumotlari", ru: "Информация об организации" },
      { uz: "Kontakt va manzil", ru: "Контакты и адрес" },
      { uz: "Mustaqil sharhlar", ru: "Независимые отзывы" },
    ],
  },
  {
    uzName: "Pro ro'yxat",
    ruName: "Pro",
    highlight: true,
    items: [
      { uz: "Featured belgisi", ru: "Метка Featured" },
      { uz: "Yuqoriroq pozitsiya", ru: "Более высокая позиция" },
      { uz: "Logotip va galereya", ru: "Логотип и галерея" },
      { uz: "Statistika va hisobot", ru: "Статистика и отчёты" },
    ],
  },
  {
    uzName: "Tavsiya",
    ruName: "Рекомендация",
    items: [
      { uz: "Maqolada tavsiya qilish", ru: "Упоминание в статье" },
      { uz: "Bosh sahifa joylashuvi", ru: "Размещение на главной" },
      { uz: "Premium qo'llab-quvvatlash", ru: "Премиум-поддержка" },
    ],
  },
];

export default async function AdvertisingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href={`/${lang}`} className="hover:text-foreground">
              <span data-lang="uz">Bosh sahifa</span>
              <span data-lang="ru">Главная</span>
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">
            <span data-lang="uz">Reklama</span>
            <span data-lang="ru">Реклама</span>
          </li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span data-lang="uz">Top Reyting&apos;da reklama</span>
            <span data-lang="ru">Реклама на Top Reyting</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            <span data-lang="uz">
              Top Reyting hozircha kontentni qurish bosqichida. Reklama
              imkoniyatlari yetarli auditoriya yig&apos;ilgandan keyin ochiladi —
              siz birinchilardan bo&apos;lib xabardor bo&apos;lasiz.
            </span>
            <span data-lang="ru">
              Top Reyting сейчас на этапе формирования контента. Рекламные
              возможности откроются после набора достаточной аудитории — вы
              узнаете об этом одним из первых.
            </span>
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {features.map((m) => (
              <div
                key={m.uzTitle}
                className="rounded-xl border border-border bg-card p-5"
              >
                <m.icon size={20} className="text-primary mb-3" />
                <p className="text-lg font-bold tracking-tight">
                  <span data-lang="uz">{m.uzTitle}</span>
                  <span data-lang="ru">{m.ruTitle}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span data-lang="uz">{m.uzText}</span>
                  <span data-lang="ru">{m.ruText}</span>
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-3">
            <span data-lang="uz">Reklama formatlari (rejada)</span>
            <span data-lang="ru">Форматы рекламы (в плане)</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            <span data-lang="uz">
              Quyidagi formatlar rejada — narxlar va shartlar yetarli
              auditoriya yig&apos;ilgandan keyin tasdiqlanadi.
            </span>
            <span data-lang="ru">
              Форматы ниже находятся в плане — цены и условия будут
              утверждены после набора достаточной аудитории.
            </span>
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((p) => (
              <Plan key={p.uzName} {...p} />
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-gold/5 p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              <span data-lang="uz">Hamkorlikka tayyormisiz?</span>
              <span data-lang="ru">Готовы к сотрудничеству?</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              <span data-lang="uz">
                Hozircha tariflar tasdiqlanmoqda. Iltimos, qiziqishingizni
                bildiring — ishga tushganda birinchilardan bo&apos;lib xabardor
                bo&apos;lasiz.
              </span>
              <span data-lang="ru">
                Тарифы пока утверждаются. Сообщите о своём интересе — узнаете
                о запуске одним из первых.
              </span>
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href="https://t.me/topreyting"
                className={buttonVariants({ size: "lg" })}
              >
                <span data-lang="uz">Telegram orqali yozish</span>
                <span data-lang="ru">Написать в Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", url: "/" },
          { name: "Reklama", url: "/reklama" },
        ])}
      />
    </>
  );
}

function Plan({
  uzName,
  ruName,
  items,
  highlight,
}: {
  uzName: string;
  ruName: string;
  items: { uz: string; ru: string }[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        highlight
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card"
      }`}
    >
      {highlight && (
        <div className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
          <span data-lang="uz">Mashhur</span>
          <span data-lang="ru">Популярный</span>
        </div>
      )}
      <h3 className="text-xl font-bold">
        <span data-lang="uz">{uzName}</span>
        <span data-lang="ru">{ruName}</span>
      </h3>
      <p className="mt-2 text-2xl font-bold tracking-tight">—</p>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.uz} className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
            <span>
              <span data-lang="uz">{it.uz}</span>
              <span data-lang="ru">{it.ru}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
