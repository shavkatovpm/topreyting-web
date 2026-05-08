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

export default function AboutPage() {
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
          <li className="text-foreground font-medium">Biz haqimizda</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Biz haqimizda
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {site.name} — O&apos;zbekistondagi tashkilotlar, kompaniyalar va
            mutaxassislarning mustaqil reyting platformasi.
          </p>

          <div className="prose-article mt-10">
            <h2>Bizning missiyamiz</h2>
            <p>
              Bizning maqsadimiz — O&apos;zbekiston bozorida shaffof va ishonchli
              tanlov muhitini yaratish. Har bir bemor, mijoz va biznes egasi haqiqiy
              ma&apos;lumotlar asosida qaror qabul qila olishi kerak.
            </p>

            <h2>Nima qilamiz</h2>
            <p>
              Klinikalar, agentliklar, mutaxassislar, bizneslar va startaplarni bir
              joyga to&apos;playmiz va ularni real bemor/mijoz sharhlari asosida
              baholaymiz. Har bir ro&apos;yxat tasdiqlanadi va manipulyatsiyaga qarshi
              tekshiriladi.
            </p>

            <h2>Bizning qadriyatlarimiz</h2>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: Shield,
                title: "Mustaqillik",
                text: "Pul evaziga reyting o'zgartirilmaydi. Faqat haqiqiy sharhlar.",
              },
              {
                icon: Sparkles,
                title: "Sifat",
                text: "Har bir ro'yxat va sharh qo'lda tekshirilib tasdiqlanadi.",
              },
              {
                icon: Users,
                title: "Hamjamiyat",
                text: "Foydalanuvchilarga keltiriladigan foyda — birinchi o'rinda.",
              },
              {
                icon: Trophy,
                title: "Yetakchilik",
                text: "Eng yaxshilarni topib, ularga loyiqlik darajasini berish.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <v.icon size={22} className="text-primary mb-3" />
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>

          <div className="prose-article mt-10">
            <h2>Bog&apos;lanish</h2>
            <p>
              Hamkorlik, savollar yoki taklifingiz bo&apos;lsa,{" "}
              <Link href="/aloqa">aloqa sahifasidan</Link> yoki{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> orqali murojaat qiling.
            </p>
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
