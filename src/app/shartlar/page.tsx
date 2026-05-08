import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Foydalanish shartlari",
  description: "Top Reyting platformasidan foydalanish bo'yicha qoidalar va shartlar.",
  alternates: { canonical: "/shartlar" },
};

export default function TermsPage() {
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
          <li className="text-foreground font-medium">Foydalanish shartlari</li>
        </ol>
      </nav>

      <article className="container-page py-12">
        <div className="max-w-3xl mx-auto prose-article">
          <h1 className="text-4xl font-bold tracking-tight">Foydalanish shartlari</h1>
          <p className="text-muted-foreground">Oxirgi yangilanish: 2026-yil 1-may</p>

          <h2>1. Shartlar qabul qilish</h2>
          <p>
            Top Reyting (topreyting.uz) saytidan foydalanish orqali siz quyidagi
            shartlarni qabul qilasiz. Shartlarga rozi bo&apos;lmasangiz, saytdan
            foydalanmang.
          </p>

          <h2>2. Foydalanuvchi majburiyatlari</h2>
          <ul>
            <li>Faqat haqiqiy ma&apos;lumotlar va sharhlarni qoldirish</li>
            <li>Boshqa foydalanuvchilarga hurmat bilan munosabatda bo&apos;lish</li>
            <li>Saxta sharhlar va manipulyatsiyadan saqlanish</li>
            <li>Mualliflik huquqlarini hurmat qilish</li>
          </ul>

          <h2>3. Sharhlar va kontent</h2>
          <p>
            Foydalanuvchi tomonidan qoldirilgan har qanday sharh yoki kontent administrator
            tomonidan tekshirilib tasdiqlanadi. Saxta, haqoratomuz yoki noqonuniy
            kontentlar o&apos;chirib tashlanadi.
          </p>

          <h2>4. Tashkilotlar uchun shartlar</h2>
          <p>
            Tashkilotlar saytda ro&apos;yxatdan o&apos;tishda haqiqiy ma&apos;lumotlarni
            taqdim etishlari shart. Sharhlarga manipulyatsiya, soxta sharhlar yoki
            ma&apos;lumotlarni o&apos;zgartirish urinishlari aniqlanganda ro&apos;yxat
            o&apos;chirilishi mumkin.
          </p>

          <h2>5. Mas&apos;uliyatdan ozod qilish</h2>
          <p>
            Top Reyting saytda joylashtirilgan ma&apos;lumotlarning aniqligi uchun barcha
            mumkin bo&apos;lgan choralarni ko&apos;radi. Lekin so&apos;nggi qarorni
            foydalanuvchi mustaqil ravishda qabul qilishi kerak.
          </p>

          <h2>6. O&apos;zgartirishlar</h2>
          <p>
            Top Reyting har qanday vaqtda ushbu shartlarga o&apos;zgartirishlar kiritish
            huquqini saqlab qoladi. O&apos;zgarishlar ushbu sahifada e&apos;lon qilinadi.
          </p>

          <h2>7. Aloqa</h2>
          <p>
            Savollar bo&apos;yicha:{" "}
            <a href="mailto:info@topreyting.uz">info@topreyting.uz</a>
          </p>
        </div>
      </article>
    </>
  );
}
