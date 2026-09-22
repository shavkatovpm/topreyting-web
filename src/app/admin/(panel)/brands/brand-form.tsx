import { ChevronRight } from "lucide-react";
import type { Brand, Category } from "@/generated/prisma/client";
import { cities } from "@/data/cities";
import { AdminForm } from "../../_components/admin-form";
import { Field, inputCls, textareaCls } from "../../_components/ui";
import { saveBrand } from "../../actions/brand";
import { CategoryPicker } from "./category-picker";
import { FaqEditor } from "./faq-editor";
import { LogoField } from "./logo-field";
import { NameSlugFields } from "./name-slug-fields";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const faqArr = (v: unknown): { q: string; a: string }[] =>
  Array.isArray(v) ? (v as { q: string; a: string }[]) : [];

export function BrandForm({
  brand,
  categories,
  selectedCategoryIds = [],
}: {
  brand?: Brand;
  categories: Pick<Category, "id" | "name" | "status">[];
  selectedCategoryIds?: string[];
}) {
  const b = brand;
  return (
    <AdminForm
      action={saveBrand.bind(null, b?.id ?? null)}
      submitLabel={b ? "Saqlash" : "Brend qo'shish"}
      className="max-w-3xl space-y-6"
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Asosiy</h2>
        <NameSlugFields name={b?.name} slug={b?.slug} />
        <Field label="Logo" hint="Nashr qilish uchun majburiy (qoralama sifatida logotipsiz ham saqlash mumkin)">
          <LogoField current={b?.logoUrl ?? null} />
        </Field>
        <CategoryPicker initial={categories} selected={selectedCategoryIds} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Tavsif</h2>
        <Field label="Qisqa tavsif" hint="Ro'yxatda va Google'da ko'rinadi (ixtiyoriy)">
          <textarea name="shortDescription" rows={3} maxLength={300} defaultValue={b?.shortDescription} className={textareaCls} />
        </Field>
        <Field label="To'liq tavsif" hint="Xizmatlar, narx, joylashuv, farqlari haqida (ixtiyoriy)">
          <textarea name="fullDescription" rows={10} defaultValue={b?.fullDescription} className={textareaCls} />
        </Field>
        <Field label="Xizmatlar" hint="Har qatorda bittadan">
          <textarea name="services" rows={4} defaultValue={arr(b?.services).join("\n")} className={textareaCls} />
        </Field>
        <Field label="Afzalliklari" hint="Har qatorda bittadan">
          <textarea name="features" rows={4} defaultValue={arr(b?.features).join("\n")} className={textareaCls} />
        </Field>
        <Field label="Savol-javoblar" hint="Sahifada 'Savol-javoblar' bo'limi va Google'da FAQ sifatida chiqadi">
          <FaqEditor initial={faqArr(b?.faqs)} />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Aloqa va havolalar</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Rasmiy sayt">
            <input name="websiteUrl" type="url" defaultValue={b?.websiteUrl ?? ""} placeholder="https://" className={inputCls} />
          </Field>
          <Field label="Instagram">
            <input name="instagramUrl" type="url" defaultValue={b?.instagramUrl ?? ""} placeholder="https://instagram.com/..." className={inputCls} />
          </Field>
          <Field label="Telegram">
            <input name="telegramUrl" type="url" defaultValue={b?.telegramUrl ?? ""} placeholder="https://t.me/..." className={inputCls} />
          </Field>
          <Field label="Telefon">
            <input name="phone" defaultValue={b?.phone ?? ""} placeholder="+998 ..." className={inputCls} />
          </Field>
        </div>
      </section>

      <details className="group rounded-lg border border-border">
        <summary className="flex cursor-pointer select-none items-center gap-1.5 px-4 py-3 text-sm font-medium text-muted-foreground marker:content-none hover:text-foreground">
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
          Qo&apos;shimcha ma&apos;lumotlar (ixtiyoriy)
        </summary>
        <div className="space-y-4 border-t border-border p-4">
          <Field label="Boshqa yozilishlar" hint="Odamlar boshqacha yozadigan variantlar, har qatorda bittadan (Najot Talim, Наджот Таълим ...)">
            <textarea name="alternateNames" rows={3} defaultValue={arr(b?.alternateNames).join("\n")} className={textareaCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Manzil">
              <input name="address" defaultValue={b?.address ?? ""} className={inputCls} />
            </Field>
            <Field label="Shahar">
              <select name="city" defaultValue={b?.city ?? ""} className={inputCls}>
                <option value="">—</option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Narxlar">
              <input name="priceRange" defaultValue={b?.priceRange ?? ""} placeholder="100 000 – 300 000 so'm" className={inputCls} />
            </Field>
            <Field label="Ish vaqti">
              <input name="workingHours" defaultValue={b?.workingHours ?? ""} placeholder="Har kuni 10:00 – 23:00" className={inputCls} />
            </Field>
            <Field label="Tashkil etilgan yil">
              <input name="yearFounded" type="number" defaultValue={b?.yearFounded ?? ""} className={inputCls} />
            </Field>
          </div>
        </div>
      </details>

      <section>
        <Field
          label="Holat"
          hint={
            b
              ? "Nashr qilish uchun: logo yuklangan va kamida bitta to'lov kiritilgan bo'lishi shart"
              : "Yangi brend avval «Yashirin» sifatida saqlanadi — to'lov kiritilgandan keyin shu sahifada nashr qilasiz"
          }
        >
          <select name="status" defaultValue={b?.status === "ACTIVE" ? "ACTIVE" : "UNPUBLISHED"} className={inputCls}>
            <option value="UNPUBLISHED">Yashirin (qoralama)</option>
            {b && <option value="ACTIVE">Nashr qilingan</option>}
          </select>
        </Field>
      </section>
    </AdminForm>
  );
}
