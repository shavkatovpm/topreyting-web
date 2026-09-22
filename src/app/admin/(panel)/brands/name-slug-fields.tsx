"use client";

import { useState } from "react";
import { slugify } from "@/lib/slug";
import { Field, inputCls } from "../../_components/ui";

/** Slug nomdan avtomatik hosil bo'ladi (kerak bo'lsa qo'lda o'zgartiriladi). */
export function NameSlugFields({
  name: initialName,
  slug: initialSlug,
}: {
  name?: string;
  slug?: string;
}) {
  const [name, setName] = useState(initialName ?? "");
  const [slug, setSlug] = useState(initialSlug ?? "");
  // Tahrirlashda (mavjud slug bilan) avtomatik yangilanish darhol o'chadi — nashr qilingan
  // brendning URL'i nom o'zgarganda kutilmagan holda almashib qolmasin.
  const [slugTouched, setSlugTouched] = useState(Boolean(initialSlug));

  return (
    <>
      <Field label="Brend nomi" hint="Aynan shunday yoziladi: sarlavha, title va JSON-LD'da. Masalan: Najot Ta'lim">
        <input
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputCls}
        />
      </Field>
      <Field label="Slug (URL)" hint="topreyting.uz/{kategoriya}/{slug} — nomdan avtomatik to'ldiriladi, kerak bo'lsa o'zgartiring">
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          placeholder="najot-talim"
          className={inputCls}
        />
      </Field>
    </>
  );
}
