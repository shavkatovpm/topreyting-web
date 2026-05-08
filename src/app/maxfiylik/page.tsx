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
              Bosh sahifa
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">Maxfiylik siyosati</li>
        </ol>
      </nav>

      <article className="container-page py-12">
        <div className="max-w-3xl mx-auto prose-article">
          <h1 className="text-4xl font-bold tracking-tight">Maxfiylik siyosati</h1>
          <p className="text-muted-foreground">Oxirgi yangilanish: 2026-yil 1-may</p>

          <h2>1. Umumiy qoidalar</h2>
          <p>
            Top Reyting (topreyting.uz) foydalanuvchilarning shaxsiy ma&apos;lumotlarini
            yig&apos;ish, saqlash va qayta ishlash bo&apos;yicha quyidagi qoidalarga amal qiladi.
          </p>

          <h2>2. Qanday ma&apos;lumotlar yig&apos;iladi</h2>
          <ul>
            <li>Ro&apos;yxatdan o&apos;tishda: ism, email yoki telefon raqami</li>
            <li>Sharh qoldirishda: ism, baho va sharh matni</li>
            <li>Sayt foydalanishida: IP-manzil, brauzer turi, tashrif statistikasi</li>
          </ul>

          <h2>3. Ma&apos;lumotlardan qanday foydalaniladi</h2>
          <ul>
            <li>Xizmat ko&apos;rsatish va foydalanuvchi tajribasini yaxshilash</li>
            <li>Reyting va sharhlarning haqiqiyligini ta&apos;minlash</li>
            <li>Foydalanuvchi bilan aloqa</li>
            <li>Saytni rivojlantirish va xatoliklarni aniqlash</li>
          </ul>

          <h2>4. Uchinchi shaxslarga ma&apos;lumot uzatish</h2>
          <p>
            Biz foydalanuvchi ma&apos;lumotlarini uchinchi shaxslarga sotmaymiz. Faqat qonun
            talab qilgan hollarda yoki mijozning yozma roziligi bilan ma&apos;lumotlar
            uzatilishi mumkin.
          </p>

          <h2>5. Cookie va analitika</h2>
          <p>
            Sayt cookie&apos;lardan foydalanadi. Brauzer sozlamalaridan ularni
            o&apos;chirish mumkin. Google Analytics va boshqa analitika xizmatlari faqat
            anonim statistika to&apos;playdi.
          </p>

          <h2>6. Aloqa</h2>
          <p>
            Maxfiylik bo&apos;yicha savollarni{" "}
            <a href="mailto:info@topreyting.uz">info@topreyting.uz</a> manziliga yuboring.
          </p>
        </div>
      </article>
    </>
  );
}
