import type { Brand, Category } from "@/generated/prisma/client";
import { cities } from "@/data/cities";
import { AdminForm } from "../../_components/admin-form";
import { Field, inputCls, textareaCls } from "../../_components/ui";
import { saveBrand } from "../../actions/brand";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const faqLines = (v: unknown): string =>
  (Array.isArray(v) ? (v as { q: string; a: string }[]) : []).map((f) => `${f.q} | ${f.a}`).join("\n");

export function BrandForm({
  brand,
  categories,
  selectedCategoryIds = [],
}: {
  brand?: Brand;
  categories: Pick<Category, "id" | "name">[];
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
        <Field label="Brend nomi" hint="Aynan shunday yoziladi: sarlavha, title va JSON-LD'da. Masalan: Najot Ta'lim">
          <input name="name" required defaultValue={b?.name} className={inputCls} />
        </Field>
        <Field label="Slug (URL)" hint="topreyting.uz/{kategoriya}/{slug}">
          <input name="slug" required defaultValue={b?.slug} placeholder="najot-talim" className={inputCls} />
        </Field>
        <Field label="Boshqa yozilishlar" hint="Odamlar boshqacha yozadigan variantlar, har qatorda bittadan (Najot Talim, Наджот Таълим ...)">
          <textarea name="alternateNames" rows={3} defaultValue={arr(b?.alternateNames).join("\n")} className={textareaCls} />
        </Field>
        <Field group label="Kategoriyalar" hint="Kamida bittasini tanlang. To'lov aynan kategoriya bo'yicha hisoblanadi.">
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
                <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={selectedCategoryIds.includes(c.id)} />
                {c.name}
              </label>
            ))}
          </div>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Tavsif</h2>
        <Field label="Qisqa tavsif" hint="Ro'yxatda va Google'da ko'rinadi. Nashr uchun kamida 50 belgi.">
          <textarea name="shortDescription" required rows={3} maxLength={300} defaultValue={b?.shortDescription} className={textareaCls} />
        </Field>
        <Field label="To'liq tavsif" hint="Brendga xos, foydali, unikal matn (nashr uchun kamida 200 belgi). Xizmatlar, narx, joylashuv, farqlari haqida yozing. Abzatslarni bo'sh qator bilan ajrating.">
          <textarea name="fullDescription" required rows={10} defaultValue={b?.fullDescription} className={textareaCls} />
        </Field>
        <Field label="Xizmatlar" hint="Har qatorda bittadan">
          <textarea name="services" rows={4} defaultValue={arr(b?.services).join("\n")} className={textareaCls} />
        </Field>
        <Field label="Afzalliklari" hint="Har qatorda bittadan">
          <textarea name="features" rows={4} defaultValue={arr(b?.features).join("\n")} className={textareaCls} />
        </Field>
        <Field label="Savol-javoblar" hint="Har qatorda bittadan: Savol | Javob">
          <textarea name="faqs" rows={5} defaultValue={faqLines(b?.faqs)} className={textareaCls} />
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
          <Field label="Logo havolasi" hint="Hozircha tayyor rasm havolasi (fayl yuklash keyinroq)">
            <input name="logoUrl" type="url" defaultValue={b?.logoUrl ?? ""} placeholder="https://" className={inputCls} />
          </Field>
        </div>
      </section>

      <section>
        <Field label="Holat">
          <select name="status" defaultValue={b?.status === "ACTIVE" ? "ACTIVE" : "UNPUBLISHED"} className={inputCls}>
            <option value="UNPUBLISHED">Yashirin (qoralama)</option>
            <option value="ACTIVE">Nashr qilingan</option>
          </select>
        </Field>
      </section>
    </AdminForm>
  );
}
