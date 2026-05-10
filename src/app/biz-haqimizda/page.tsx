import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Trophy, Users, Sparkles, Shield } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Biz haqimizda — Top Reyting jamoasi va missiyasi",
  description:
    "Top Reyting — O'zbekistondagi mustaqil reyting platformasi. Biz haqimizda, missiya va jamoa.",
  alternates: { canonical: "/biz-haqimizda" },
};

const values = [
  {
    icon: Shield,
    uzTitle: "Mustaqillik",
    ruTitle: "Независимость",
    uzText: "Pul evaziga reyting o'zgartirilmaydi. Faqat haqiqiy sharhlar.",
    ruText: "Рейтинг не меняется за деньги. Только настоящие отзывы.",
  },
  {
    icon: Sparkles,
    uzTitle: "Sifat",
    ruTitle: "Качество",
    uzText: "Har bir ro'yxat va sharh qo'lda tekshirilib tasdiqlanadi.",
    ruText: "Каждое включение и отзыв проверяются вручную.",
  },
  {
    icon: Users,
    uzTitle: "Hamjamiyat",
    ruTitle: "Сообщество",
    uzText: "Foydalanuvchilarga keltiriladigan foyda — birinchi o'rinda.",
    ruText: "Польза для пользователей — на первом месте.",
  },
  {
    icon: Trophy,
    uzTitle: "Yetakchilik",
    ruTitle: "Лидерство",
    uzText: "Eng yaxshilarni topib, ularga loyiqlik darajasini berish.",
    ruText: "Находим лучших и присваиваем им заслуженный уровень.",
  },
];

export default function AboutPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              <span data-lang="uz">Bosh sahifa</span>
              <span data-lang="ru">Главная</span>
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">
            <span data-lang="uz">Biz haqimizda</span>
            <span data-lang="ru">О нас</span>
          </li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span data-lang="uz">Biz haqimizda</span>
            <span data-lang="ru">О нас</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            <span data-lang="uz">
              {site.name} — O&apos;zbekistondagi tashkilotlar, kompaniyalar va
              mutaxassislarning mustaqil reyting platformasi.
            </span>
            <span data-lang="ru">
              {site.name} — независимая платформа рейтингов организаций,
              компаний и специалистов в Узбекистане.
            </span>
          </p>

          <div className="prose-article mt-10">
            <h2>
              <span data-lang="uz">Bizning missiyamiz</span>
              <span data-lang="ru">Наша миссия</span>
            </h2>
            <p>
              <span data-lang="uz">
                Bizning maqsadimiz — O&apos;zbekiston bozorida shaffof va
                ishonchli tanlov muhitini yaratish. Har bir bemor, mijoz va
                biznes egasi haqiqiy ma&apos;lumotlar asosida qaror qabul qila
                olishi kerak.
              </span>
              <span data-lang="ru">
                Наша цель — создать прозрачную и надёжную среду выбора на рынке
                Узбекистана. Каждый пациент, клиент и владелец бизнеса должен
                иметь возможность принимать решения на основе достоверных
                данных.
              </span>
            </p>

            <h2>
              <span data-lang="uz">Nima qilamiz</span>
              <span data-lang="ru">Что мы делаем</span>
            </h2>
            <p>
              <span data-lang="uz">
                Klinikalar, agentliklar, mutaxassislar, bizneslar va
                startaplarni bir joyga to&apos;playmiz va ularni real
                bemor/mijoz sharhlari asosida baholaymiz. Har bir
                ro&apos;yxat tasdiqlanadi va manipulyatsiyaga qarshi
                tekshiriladi.
              </span>
              <span data-lang="ru">
                Собираем клиники, агентства, специалистов, бизнесы и стартапы в
                одном месте и оцениваем их на основе реальных отзывов
                пациентов и клиентов. Каждое включение проверяется и защищено
                от манипуляций.
              </span>
            </p>

            <h2>
              <span data-lang="uz">Bizning qadriyatlarimiz</span>
              <span data-lang="ru">Наши ценности</span>
            </h2>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.uzTitle}
                className="rounded-xl border border-border bg-card p-5"
              >
                <v.icon size={22} className="text-primary mb-3" />
                <h3 className="font-semibold mb-1">
                  <span data-lang="uz">{v.uzTitle}</span>
                  <span data-lang="ru">{v.ruTitle}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span data-lang="uz">{v.uzText}</span>
                  <span data-lang="ru">{v.ruText}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", url: "/" },
          { name: "Biz haqimizda", url: "/biz-haqimizda" },
        ])}
      />
    </>
  );
}
