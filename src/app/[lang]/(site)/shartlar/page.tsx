import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Foydalanish shartlari",
  description: "Top Reyting platformasidan foydalanish bo'yicha qoidalar va shartlar.",
  alternates: { canonical: "/shartlar" },
};

export default async function TermsPage({
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
            <span data-lang="uz">Foydalanish shartlari</span>
            <span data-lang="ru">Условия использования</span>
          </li>
        </ol>
      </nav>

      <article className="container-page py-12">
        <div className="max-w-3xl mx-auto prose-article">
          <h1 className="text-4xl font-bold tracking-tight">
            <span data-lang="uz">Foydalanish shartlari</span>
            <span data-lang="ru">Условия использования</span>
          </h1>
          <p className="text-muted-foreground">
            <span data-lang="uz">Oxirgi yangilanish: 2026-yil 1-may</span>
            <span data-lang="ru">Последнее обновление: 1 мая 2026 г.</span>
          </p>

          <h2>
            <span data-lang="uz">1. Shartlar qabul qilish</span>
            <span data-lang="ru">1. Принятие условий</span>
          </h2>
          <p>
            <span data-lang="uz">
              Top Reyting (topreyting.uz) saytidan foydalanish orqali siz
              quyidagi shartlarni qabul qilasiz. Shartlarga rozi bo&apos;lmasangiz,
              saytdan foydalanmang.
            </span>
            <span data-lang="ru">
              Используя сайт Top Reyting (topreyting.uz), вы принимаете условия
              ниже. Если вы не согласны — пожалуйста, не пользуйтесь сайтом.
            </span>
          </p>

          <h2>
            <span data-lang="uz">2. Foydalanuvchi majburiyatlari</span>
            <span data-lang="ru">2. Обязанности пользователя</span>
          </h2>
          <ul>
            <li>
              <span data-lang="uz">
                Faqat haqiqiy ma&apos;lumotlar va sharhlarni qoldirish
              </span>
              <span data-lang="ru">
                Оставлять только достоверные данные и отзывы
              </span>
            </li>
            <li>
              <span data-lang="uz">
                Boshqa foydalanuvchilarga hurmat bilan munosabatda bo&apos;lish
              </span>
              <span data-lang="ru">
                Уважительно относиться к другим пользователям
              </span>
            </li>
            <li>
              <span data-lang="uz">
                Saxta sharhlar va manipulyatsiyadan saqlanish
              </span>
              <span data-lang="ru">
                Воздерживаться от поддельных отзывов и манипуляций
              </span>
            </li>
            <li>
              <span data-lang="uz">Mualliflik huquqlarini hurmat qilish</span>
              <span data-lang="ru">Соблюдать авторские права</span>
            </li>
          </ul>

          <h2>
            <span data-lang="uz">3. Sharhlar va kontent</span>
            <span data-lang="ru">3. Отзывы и контент</span>
          </h2>
          <p>
            <span data-lang="uz">
              Foydalanuvchi tomonidan qoldirilgan har qanday sharh yoki kontent
              administrator tomonidan tekshirilib tasdiqlanadi. Saxta,
              haqoratomuz yoki noqonuniy kontentlar o&apos;chirib tashlanadi.
            </span>
            <span data-lang="ru">
              Любой отзыв или контент, оставленный пользователем, проверяется и
              утверждается администратором. Поддельный, оскорбительный или
              незаконный контент удаляется.
            </span>
          </p>

          <h2>
            <span data-lang="uz">4. Tashkilotlar uchun shartlar</span>
            <span data-lang="ru">4. Условия для организаций</span>
          </h2>
          <p>
            <span data-lang="uz">
              Tashkilotlar saytda ro&apos;yxatdan o&apos;tishda haqiqiy
              ma&apos;lumotlarni taqdim etishlari shart. Sharhlarga
              manipulyatsiya, soxta sharhlar yoki ma&apos;lumotlarni
              o&apos;zgartirish urinishlari aniqlanganda ro&apos;yxat
              o&apos;chirilishi mumkin.
            </span>
            <span data-lang="ru">
              При регистрации организации обязаны предоставлять достоверные
              данные. При обнаружении манипуляций отзывами, поддельных отзывов
              или попыток искажения данных запись может быть удалена.
            </span>
          </p>

          <h2>
            <span data-lang="uz">5. Mas&apos;uliyatdan ozod qilish</span>
            <span data-lang="ru">5. Освобождение от ответственности</span>
          </h2>
          <p>
            <span data-lang="uz">
              Top Reyting saytda joylashtirilgan ma&apos;lumotlarning aniqligi
              uchun barcha mumkin bo&apos;lgan choralarni ko&apos;radi. Lekin
              so&apos;nggi qarorni foydalanuvchi mustaqil ravishda qabul
              qilishi kerak.
            </span>
            <span data-lang="ru">
              Top Reyting принимает все возможные меры для обеспечения точности
              размещённой информации. Тем не менее, окончательное решение
              пользователь принимает самостоятельно.
            </span>
          </p>

          <h2>
            <span data-lang="uz">6. O&apos;zgartirishlar</span>
            <span data-lang="ru">6. Изменения</span>
          </h2>
          <p>
            <span data-lang="uz">
              Top Reyting har qanday vaqtda ushbu shartlarga o&apos;zgartirishlar
              kiritish huquqini saqlab qoladi. O&apos;zgarishlar ushbu sahifada
              e&apos;lon qilinadi.
            </span>
            <span data-lang="ru">
              Top Reyting оставляет за собой право в любое время вносить
              изменения в данные условия. Изменения публикуются на этой
              странице.
            </span>
          </p>

          <h2>
            <span data-lang="uz">7. Aloqa</span>
            <span data-lang="ru">7. Связь</span>
          </h2>
          <p>
            <span data-lang="uz">
              Savollar bo&apos;yicha:{" "}
              <a href="mailto:info@topreyting.uz">info@topreyting.uz</a>
            </span>
            <span data-lang="ru">
              По вопросам:{" "}
              <a href="mailto:info@topreyting.uz">info@topreyting.uz</a>
            </span>
          </p>
        </div>
      </article>
    </>
  );
}
