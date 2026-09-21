import type { Category } from "@/generated/prisma/client";
import { AdminForm } from "../../_components/admin-form";
import { Field, inputCls, textareaCls } from "../../_components/ui";
import { saveCategory } from "../../actions/category";

export function CategoryForm({ category }: { category?: Category }) {
  const c = category;
  return (
    <AdminForm
      action={saveCategory.bind(null, c?.id ?? null)}
      submitLabel={c ? "Saqlash" : "Kategoriya yaratish"}
      className="max-w-2xl space-y-4"
    >
      <Field label="Nomi" hint="Masalan: O'quv markazlari">
        <input name="name" required defaultValue={c?.name} className={inputCls} />
      </Field>
      <Field label="Slug (URL)" hint="topreyting.uz/{slug}. Lotin harflari va tire. Nashrdan keyin o'zgartirilsa, eski havola avtomatik yo'naltiriladi.">
        <input name="slug" required defaultValue={c?.slug} placeholder="oquv-markazlar" className={inputCls} />
      </Field>
      <Field label="H1 sarlavha" hint="Sahifadagi asosiy sarlavha. Masalan: O'zbekistondagi TOP o'quv markazlar">
        <input name="h1" required defaultValue={c?.h1} className={inputCls} />
      </Field>
      <Field label="SEO title" hint="Google'da ko'rinadigan sarlavha, 70 belgigacha">
        <input name="seoTitle" required defaultValue={c?.seoTitle} maxLength={70} className={inputCls} />
      </Field>
      <Field label="Meta description" hint="Google'da ko'rinadigan tavsif, 50–170 belgi">
        <textarea name="metaDescription" required rows={3} defaultValue={c?.metaDescription} maxLength={170} className={textareaCls} />
      </Field>
      <Field label="Qisqa tavsif" hint="Kategoriya sahifasi tepasida ko'rinadi">
        <textarea name="shortDescription" required rows={3} defaultValue={c?.shortDescription} className={textareaCls} />
      </Field>
      <Field label="Uzun SEO matn" hint="Sahifa ostida chiqadi. Unikal, foydali matn yozing (nusxa ko'chirmang).">
        <textarea name="longContent" rows={10} defaultValue={c?.longContent} className={textareaCls} />
      </Field>
    </AdminForm>
  );
}
