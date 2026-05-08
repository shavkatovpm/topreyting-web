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

export default function AddListingPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Bosh sahifa
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">E&apos;lon qo&apos;shish</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Bizneslaringizni Top Reyting&apos;ga qo&apos;shing
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Yangi mijozlar topish va onlayn obro&apos;yingizni mustahkamlash uchun
            ro&apos;yxatdan o&apos;ting. <strong className="text-foreground">Hozircha bepul.</strong>
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              "Bepul ro'yxat",
              "Mijozlar sharhlari",
              "SEO trafik",
              "Telefon va manzil",
              "Brending",
              "Hisobotlar",
            ].map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                {b}
              </div>
            ))}
          </div>

          <form className="mt-10 grid gap-5 rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tashkilot nomi" required>
                <input
                  type="text"
                  required
                  placeholder="Tashkilotingiz nomi"
                  className="input"
                />
              </Field>
              <Field label="Kategoriya" required>
                <select required className="input">
                  <option value="">Tanlang...</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.namePlural}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Shahar" required>
                <select required className="input">
                  <option value="">Tanlang...</option>
                  {cities.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Telefon" required>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  className="input"
                />
              </Field>
            </div>

            <Field label="Manzil">
              <input
                type="text"
                placeholder="Toshkent, ko'cha, uy"
                className="input"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Veb-sayt">
                <input type="url" placeholder="https://example.uz" className="input" />
              </Field>
              <Field label="Email">
                <input type="email" placeholder="info@example.uz" className="input" />
              </Field>
            </div>

            <Field label="Qisqa tavsif (300 belgi)" required>
              <textarea
                required
                rows={4}
                maxLength={300}
                placeholder="Tashkilot/biznesingiz haqida qisqa..."
                className="input resize-y"
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Yuborilgandan so&apos;ng admin 24 soat ichida tasdiqlaydi.
              </p>
              <button
                type="submit"
                className={buttonVariants({ size: "lg" })}
                disabled
                title="Tez orada — hozircha forma faqat ko'rsatish uchun"
              >
                Yuborish (tez orada)
              </button>
            </div>
          </form>

          <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6">
            <h2 className="font-semibold mb-2">Hozircha qanday qo&apos;shish mumkin?</h2>
            <p className="text-sm text-muted-foreground mb-3">
              MVP bosqichida ro&apos;yxatlar admin tomonidan qo&apos;lda kiritiladi. Iltimos,
              tashkilotingiz ma&apos;lumotlarini quyidagi kanallardan birortasi orqali
              yuboring:
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
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
