import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Maxfiylik siyosati",
  description: "Top Reyting'da foydalanuvchilarning shaxsiy ma'lumotlarini himoya qilish bo'yicha siyosat.",
  alternates: { canonical: "/maxfiylik" },
};

export default function PrivacyPage() {
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
            <span data-lang="uz">Maxfiylik siyosati</span>
            <span data-lang="ru">Политика конфиденциальности</span>
          </li>
        </ol>
      </nav>

      <article className="container-page py-12">
        <div className="max-w-3xl mx-auto prose-article">
          <h1 className="text-4xl font-bold tracking-tight">
            <span data-lang="uz">Maxfiylik siyosati</span>
            <span data-lang="ru">Политика конфиденциальности</span>
          </h1>
          <p className="text-muted-foreground">
            <span data-lang="uz">Oxirgi yangilanish: 2026-yil 1-may</span>
            <span data-lang="ru">Последнее обновление: 1 мая 2026 г.</span>
          </p>

          <h2>
            <span data-lang="uz">1. Umumiy qoidalar</span>
            <span data-lang="ru">1. Общие положения</span>
          </h2>
          <p>
            <span data-lang="uz">
              Top Reyting (topreyting.uz) foydalanuvchilarning shaxsiy
              ma&apos;lumotlarini yig&apos;ish, saqlash va qayta ishlash
              bo&apos;yicha quyidagi qoidalarga amal qiladi.
            </span>
            <span data-lang="ru">
              Top Reyting (topreyting.uz) соблюдает следующие правила сбора,
              хранения и обработки персональных данных пользователей.
            </span>
          </p>

          <h2>
            <span data-lang="uz">2. Qanday ma&apos;lumotlar yig&apos;iladi</span>
            <span data-lang="ru">2. Какие данные собираются</span>
          </h2>
          <ul>
            <li>
              <span data-lang="uz">
                Ro&apos;yxatdan o&apos;tishda: ism, email yoki telefon raqami
              </span>
              <span data-lang="ru">
                При регистрации: имя, email или номер телефона
              </span>
            </li>
            <li>
              <span data-lang="uz">
                Sharh qoldirishda: ism, baho va sharh matni
              </span>
              <span data-lang="ru">
                При оставлении отзыва: имя, оценка и текст отзыва
              </span>
            </li>
            <li>
              <span data-lang="uz">
                Sayt foydalanishida: IP-manzil, brauzer turi, tashrif statistikasi
              </span>
              <span data-lang="ru">
                При использовании сайта: IP-адрес, тип браузера, статистика
                посещений
              </span>
            </li>
          </ul>

          <h2>
            <span data-lang="uz">3. Ma&apos;lumotlardan qanday foydalaniladi</span>
            <span data-lang="ru">3. Как используются данные</span>
          </h2>
          <ul>
            <li>
              <span data-lang="uz">
                Xizmat ko&apos;rsatish va foydalanuvchi tajribasini yaxshilash
              </span>
              <span data-lang="ru">
                Предоставление услуг и улучшение пользовательского опыта
              </span>
            </li>
            <li>
              <span data-lang="uz">
                Reyting va sharhlarning haqiqiyligini ta&apos;minlash
              </span>
              <span data-lang="ru">
                Обеспечение подлинности рейтингов и отзывов
              </span>
            </li>
            <li>
              <span data-lang="uz">Foydalanuvchi bilan aloqa</span>
              <span data-lang="ru">Связь с пользователем</span>
            </li>
            <li>
              <span data-lang="uz">
                Saytni rivojlantirish va xatoliklarni aniqlash
              </span>
              <span data-lang="ru">
                Развитие сайта и выявление ошибок
              </span>
            </li>
          </ul>

          <h2>
            <span data-lang="uz">4. Uchinchi shaxslarga ma&apos;lumot uzatish</span>
            <span data-lang="ru">4. Передача данных третьим лицам</span>
          </h2>
          <p>
            <span data-lang="uz">
              Biz foydalanuvchi ma&apos;lumotlarini uchinchi shaxslarga sotmaymiz.
              Faqat qonun talab qilgan hollarda yoki mijozning yozma roziligi
              bilan ma&apos;lumotlar uzatilishi mumkin.
            </span>
            <span data-lang="ru">
              Мы не продаём данные пользователей третьим лицам. Передача данных
              возможна только в случаях, требуемых законом, или с письменного
              согласия пользователя.
            </span>
          </p>

          <h2>
            <span data-lang="uz">5. Cookie va analitika</span>
            <span data-lang="ru">5. Cookie и аналитика</span>
          </h2>
          <p>
            <span data-lang="uz">
              Sayt cookie&apos;lardan foydalanadi. Brauzer sozlamalaridan ularni
              o&apos;chirish mumkin. Google Analytics va boshqa analitika
              xizmatlari faqat anonim statistika to&apos;playdi.
            </span>
            <span data-lang="ru">
              Сайт использует cookie. Их можно отключить в настройках браузера.
              Google Analytics и другие аналитические сервисы собирают только
              анонимную статистику.
            </span>
          </p>

          <h2>
            <span data-lang="uz">6. Aloqa</span>
            <span data-lang="ru">6. Связь</span>
          </h2>
          <p>
            <span data-lang="uz">
              Maxfiylik bo&apos;yicha savollarni{" "}
              <a href="mailto:info@topreyting.uz">info@topreyting.uz</a>{" "}
              manziliga yuboring.
            </span>
            <span data-lang="ru">
              Вопросы по конфиденциальности направляйте на{" "}
              <a href="mailto:info@topreyting.uz">info@topreyting.uz</a>.
            </span>
          </p>
        </div>
      </article>
    </>
  );
}
