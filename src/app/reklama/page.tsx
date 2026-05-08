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

export default function AdvertisingPage() {
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
          <li className="text-foreground font-medium">Reklama</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Top Reyting&apos;da reklama
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Top Reyting hozircha kontentni qurish bosqichida. Reklama imkoniyatlari
            yetarli auditoriya yig&apos;ilgandan keyin ochiladi — siz birinchilardan
            bo&apos;lib xabardor bo&apos;lasiz.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                title: "Targetlangan",
                text: "Aniq qaror qabul qilayotgan auditoriya",
              },
              {
                icon: Award,
                title: "Ishonchli",
                text: "Mustaqil tahlil platformasi",
              },
              {
                icon: TrendingUp,
                title: "O'sayotgan",
                text: "Yangi platforma — birinchilardan bo'ling",
              },
            ].map((m) => (
              <div key={m.title} className="rounded-xl border border-border bg-card p-5">
                <m.icon size={20} className="text-primary mb-3" />
                <p className="text-lg font-bold tracking-tight">{m.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{m.text}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-3">
            Reklama formatlari (rejada)
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Quyidagi formatlar rejada — narxlar va shartlar yetarli auditoriya yig&apos;ilgandan
            keyin tasdiqlanadi.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Plan
              name="Standart ro'yxat"
              price="—"
              features={[
                "Tashkilot ma'lumotlari",
                "Kontakt va manzil",
                "Mustaqil sharhlar",
              ]}
            />
            <Plan
              name="Pro ro'yxat"
              price="—"
              highlight
              features={[
                "Featured belgisi",
                "Yuqoriroq pozitsiya",
                "Logotip va galereya",
                "Statistika va hisobot",
              ]}
            />
            <Plan
              name="Tavsiya"
              price="—"
              features={[
                "Maqolada tavsiya qilish",
                "Bosh sahifa joylashuvi",
                "Premium qo'llab-quvvatlash",
              ]}
            />
          </div>

          <div className="mt-10 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-gold/5 p-6 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Hamkorlikka tayyormisiz?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hozircha tariflar tasdiqlanmoqda. Iltimos, qiziqishingizni bildiring —
              ishga tushganda birinchilardan bo&apos;lib xabardor bo&apos;lasiz.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/aloqa" className={buttonVariants({ size: "lg" })}>
                Bog&apos;lanish
              </Link>
              <a
                href="https://t.me/topreyting"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Telegram
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
  name,
  price,
  features,
  highlight,
}: {
  name: string;
  price: string;
  features: string[];
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
          Mashhur
        </div>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="mt-2 text-2xl font-bold tracking-tight">{price}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
