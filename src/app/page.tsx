import Link from "next/link";
import { ArrowRight, Search, CheckCircle2, BookOpen } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/cards/article-card";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { Hero } from "@/components/hero/hero";

export default function HomePage() {
  const articles = getAllArticles();
  const latestArticles = articles.slice(0, 6);

  return (
    <>
      <Hero />

      {/* ARTICLES — primary content */}
      {articles.length > 0 ? (
        <section className="container-page py-16">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                <span data-lang="uz">So&apos;nggi maqolalar</span>
                <span data-lang="ru">Последние статьи</span>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                <span data-lang="uz">Tanlash bo&apos;yicha qo&apos;llanmalar va tahlillar</span>
                <span data-lang="ru">Руководства по выбору и анализы</span>
              </p>
            </div>
            {articles.length > 6 && (
              <Link
                href="/maqolalar"
                className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all font-medium"
              >
                <span data-lang="uz">Barchasi</span>
                <span data-lang="ru">Все</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      ) : (
        <section className="container-page py-20">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-muted-foreground">
              <span data-lang="uz">
                Birinchi maqolalar tez orada chiqadi. Yangiliklar uchun bizni
                Telegram kanalida kuzatib boring.
              </span>
              <span data-lang="ru">
                Первые статьи появятся скоро. Следите за нами в Telegram, чтобы
                узнавать новости.
              </span>
            </p>
            <a
              href={site.social.telegram}
              className={
                buttonVariants({ size: "default", variant: "outline" }) + " mt-4"
              }
            >
              <span data-lang="uz">Telegram kanalga obuna</span>
              <span data-lang="ru">Подписаться на Telegram-канал</span>
            </a>
          </div>
        </section>
      )}

      {/* ABOUT — bento-style feature grid */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl mb-10 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-primary font-bold mb-3">
              <span data-lang="uz">Biz nima qilamiz</span>
              <span data-lang="ru">Что мы делаем</span>
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              <span data-lang="uz">
                Top Reyting — O&apos;zbekiston bozori bo&apos;yicha mustaqil
                tahlillar.
              </span>
              <span data-lang="ru">
                Top Reyting — независимые анализы рынка Узбекистана.
              </span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
              <span data-lang="uz">
                Klinikalar, agentliklar, IT, bizneslar va boshqa sohalar haqida
                tekshirilgan ma&apos;lumotlarga asoslangan qo&apos;llanmalar.
              </span>
              <span data-lang="ru">
                Руководства, основанные на проверенных данных о клиниках,
                агентствах, IT, бизнесе и других сферах.
              </span>
            </p>
          </div>

          <div className="grid gap-3 md:gap-4 md:grid-cols-3">
            {/* Feature 1 */}
            <article className="rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl md:text-6xl font-bold tracking-tighter text-primary tabular-nums leading-none">
                  01
                </span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Search size={18} />
                </div>
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-2 tracking-tight">
                <span data-lang="uz">Mustaqil tahlil</span>
                <span data-lang="ru">Независимый анализ</span>
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                <span data-lang="uz">
                  Bozorni o&apos;rganamiz va sohaning eng muhim mezonlarini
                  ajratamiz. Reklama emas — fakt va tahlil.
                </span>
                <span data-lang="ru">
                  Изучаем рынок и выделяем главные критерии. Не реклама — факты
                  и анализ.
                </span>
              </p>
            </article>

            {/* Feature 2 */}
            <article className="rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl md:text-6xl font-bold tracking-tighter text-primary tabular-nums leading-none">
                  02
                </span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-2 tracking-tight">
                <span data-lang="uz">Tekshirilgan ma&apos;lumot</span>
                <span data-lang="ru">Проверенная информация</span>
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                <span data-lang="uz">
                  Har raqam, narx va da&apos;vo tashqi manbadan tekshiriladi.
                  Yolg&apos;on yo&apos;q.
                </span>
                <span data-lang="ru">
                  Каждое число, цена и заявление проверяются по внешним
                  источникам. Без лжи.
                </span>
              </p>
            </article>

            {/* Feature 3 */}
            <article className="rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl md:text-6xl font-bold tracking-tighter text-primary tabular-nums leading-none">
                  03
                </span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen size={18} />
                </div>
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-2 tracking-tight">
                <span data-lang="uz">Foydali qo&apos;llanmalar</span>
                <span data-lang="ru">Полезные руководства</span>
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                <span data-lang="uz">
                  Tanlash mezonlari, qiyoslash jadvallari, savol-javoblar va
                  manba linklari.
                </span>
                <span data-lang="ru">
                  Критерии выбора, таблицы сравнений, вопросы-ответы и ссылки на
                  источники.
                </span>
              </p>
            </article>
          </div>

          <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-3">
            <Link href="/maqolalar" className={buttonVariants({ size: "lg" })}>
              <span data-lang="uz">Maqolalarni ko&apos;rish</span>
              <span data-lang="ru">Смотреть статьи</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/biz-haqimizda"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <span data-lang="uz">Biz haqimizda</span>
              <span data-lang="ru">О нас</span>
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd([{ name: "Bosh sahifa", url: "/" }])} />
    </>
  );
}
