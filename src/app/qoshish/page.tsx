import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "E'lon qo'shish — bizneslaringizni Top Reyting'ga joylash",
  description:
    "O'zingizning klinika, agentlik, biznes yoki mutaxassis xizmatingizni Top Reyting platformasida bepul ro'yxatga oling.",
  alternates: { canonical: "/qoshish" },
};

const benefits = [
  { uz: "Bepul ro'yxat", ru: "Бесплатное включение" },
  { uz: "Mijozlar sharhlari", ru: "Отзывы клиентов" },
  { uz: "SEO trafik", ru: "SEO-трафик" },
  { uz: "Telefon va manzil", ru: "Телефон и адрес" },
  { uz: "Brending", ru: "Брендинг" },
  { uz: "Hisobotlar", ru: "Отчёты" },
];

export default function AddListingPage() {
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
            <span data-lang="uz">E&apos;lon qo&apos;shish</span>
            <span data-lang="ru">Добавить объявление</span>
          </li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span data-lang="uz">
              Bizneslaringizni Top Reyting&apos;ga qo&apos;shing
            </span>
            <span data-lang="ru">
              Добавьте свой бизнес в Top Reyting
            </span>
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            <span data-lang="uz">
              Yangi mijozlar topish va onlayn obro&apos;yingizni mustahkamlash
              uchun ro&apos;yxatdan o&apos;ting.{" "}
              <strong className="text-foreground">Hozircha bepul.</strong>
            </span>
            <span data-lang="ru">
              Зарегистрируйтесь, чтобы найти новых клиентов и укрепить
              онлайн-репутацию.{" "}
              <strong className="text-foreground">Пока бесплатно.</strong>
            </span>
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {benefits.map((b) => (
              <div
                key={b.uz}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span data-lang="uz">{b.uz}</span>
                <span data-lang="ru">{b.ru}</span>
              </div>
            ))}
          </div>

          <form className="mt-10 grid gap-5 rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field uz="Tashkilot nomi" ru="Название организации" required>
                <input
                  type="text"
                  required
                  placeholder="Tashkilotingiz nomi"
                  className="input"
                />
              </Field>
              <Field uz="Kategoriya" ru="Категория" required>
                <select required className="input">
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.namePlural}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field uz="Shahar" ru="Город" required>
                <select required className="input">
                  <option value="">—</option>
                  {cities.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field uz="Telefon" ru="Телефон" required>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  className="input"
                />
              </Field>
            </div>

            <Field uz="Manzil" ru="Адрес">
              <input
                type="text"
                placeholder="Toshkent, ko'cha, uy"
                className="input"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field uz="Veb-sayt" ru="Веб-сайт">
                <input type="url" placeholder="https://example.uz" className="input" />
              </Field>
              <Field uz="Email" ru="Email">
                <input type="email" placeholder="info@example.uz" className="input" />
              </Field>
            </div>

            <Field
              uz="Qisqa tavsif (300 belgi)"
              ru="Краткое описание (300 символов)"
              required
            >
              <textarea
                required
                rows={4}
                maxLength={300}
                placeholder="..."
                className="input resize-y"
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span data-lang="uz">
                  Yuborilgandan so&apos;ng admin 24 soat ichida tasdiqlaydi.
                </span>
                <span data-lang="ru">
                  После отправки администратор подтверждает в течение 24 часов.
                </span>
              </p>
              <button
                type="submit"
                className={buttonVariants({ size: "lg" })}
                disabled
              >
                <span data-lang="uz">Yuborish (tez orada)</span>
                <span data-lang="ru">Отправить (скоро)</span>
              </button>
            </div>
          </form>

          <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
            <h2 className="font-semibold mb-2">
              <span data-lang="uz">Hozircha qanday qo&apos;shish mumkin?</span>
              <span data-lang="ru">Как сейчас добавиться?</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              <span data-lang="uz">
                MVP bosqichida ro&apos;yxatlar admin tomonidan qo&apos;lda
                kiritiladi. Iltimos, tashkilotingiz ma&apos;lumotlarini
                quyidagi kanallardan birortasi orqali yuboring:
              </span>
              <span data-lang="ru">
                На стадии MVP включения добавляются администратором вручную.
                Пожалуйста, отправьте данные вашей организации одним из каналов
                ниже:
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://t.me/topreyting"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Telegram
              </a>
              <a
                href="mailto:info@topreyting.uz"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", url: "/" },
          { name: "E'lon qo'shish", url: "/qoshish" },
        ])}
      />
    </>
  );
}

function Field({
  uz,
  ru,
  required,
  children,
}: {
  uz: string;
  ru: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        <span data-lang="uz">{uz}</span>
        <span data-lang="ru">{ru}</span>
        {required && <span className="text-destructive ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
