import Link from "next/link";
import { ArrowUpRight, Sparkles, Search, BookOpen, Trophy } from "lucide-react";

export function Hero() {
  return (
    <section>
      <div className="container-page py-6 md:py-10">
        <div className="grid grid-cols-4 grid-rows-2 gap-3 md:gap-4 w-full min-h-[520px] md:min-h-[640px]">
          {/* Headline tile — emerald (primary) */}
          <div className="anim-card col-span-4 row-span-2 md:col-span-2 md:row-span-2 rounded-3xl bg-[oklch(0.55_0.16_155)] text-white p-6 md:p-9 flex flex-col justify-between relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/15 blur-3xl"
              aria-hidden
            />
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                <span data-lang="uz">
                  O&apos;zbekistondagi eng yaxshilarni topadigan platforma.
                </span>
                <span data-lang="ru">
                  Платформа, находящая лучших в Узбекистане.
                </span>
              </h1>
              <p className="mt-3 md:mt-4 text-sm md:text-base opacity-90 max-w-md">
                <span data-lang="uz">
                  Mustaqil tahlillar, qo&apos;llanmalar va reytinglar.
                </span>
                <span data-lang="ru">
                  Независимые анализы, руководства и рейтинги.
                </span>
              </p>
            </div>
            <Sparkles className="self-end text-white size-9 md:size-14" />
          </div>

          {/* Articles — coral */}
          <Link
            href="/maqolalar"
            className="anim-card col-span-2 md:col-span-1 row-span-1 rounded-3xl bg-[oklch(0.72_0.18_30)] text-white p-4 md:p-5 flex flex-col justify-between hover:opacity-90 transition-opacity group"
          >
            <div>
              <p className="text-base md:text-2xl opacity-80 mb-1.5 md:mb-2">
                <span data-lang="uz">Maqolalar</span>
                <span data-lang="ru">Статьи</span>
              </p>
              <p className="font-bold text-2xl md:text-4xl leading-tight inline-flex items-center gap-1.5 md:gap-2">
                <span data-lang="uz">Hammasi</span>
                <span data-lang="ru">Все</span>
                <ArrowUpRight className="size-5 md:size-8 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
            <BookOpen className="self-end text-white size-7 md:size-10" />
          </Link>

          {/* Search — deep blue */}
          <Link
            href="/qidiruv"
            className="anim-card col-span-2 md:col-span-1 row-span-1 rounded-3xl bg-[oklch(0.45_0.2_255)] text-white p-4 md:p-5 flex flex-col justify-between hover:opacity-90 transition-opacity group"
          >
            <div>
              <p className="text-base md:text-2xl opacity-80 mb-1.5 md:mb-2">
                <span data-lang="uz">Qidiruv</span>
                <span data-lang="ru">Поиск</span>
              </p>
              <p className="font-bold text-2xl md:text-4xl leading-tight inline-flex items-center gap-1.5 md:gap-2">
                <span data-lang="uz">Boshlash</span>
                <span data-lang="ru">Начать</span>
                <ArrowUpRight className="size-5 md:size-8 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
            <Search className="self-end text-white size-7 md:size-10" />
          </Link>

          {/* Mission — gold */}
          <div className="anim-card col-span-4 md:col-span-2 row-span-1 rounded-3xl bg-[oklch(0.85_0.16_85)] text-white p-5 md:p-6 flex flex-col justify-between">
            <p className="font-bold leading-[1.05] max-w-3xl">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                <span data-lang="uz">Mustaqil reyting</span>
                <span data-lang="ru">Независимый рейтинг</span>
              </span>
              <span className="block text-base md:text-2xl font-medium opacity-90 mt-1.5 md:mt-2">
                <span data-lang="uz">
                  yolg&apos;onsiz, manbalardan tekshirilgan
                </span>
                <span data-lang="ru">
                  без лжи, проверено по источникам
                </span>
              </span>
            </p>
            <Trophy className="self-end text-white size-9 md:size-14" />
          </div>
        </div>
      </div>
    </section>
  );
}
