import { requireSuperAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminForm } from "../../_components/admin-form";
import { Field, Notice, PageHeader, inputCls, textareaCls } from "../../_components/ui";
import { saveSettings } from "../../actions/settings";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireSuperAdmin();
  const { saved } = await searchParams;
  const s = await getSettings();

  return (
    <>
      <PageHeader title="Sozlamalar" />
      {saved && <Notice>Saqlandi</Notice>}
      <AdminForm action={saveSettings} submitLabel="Saqlash" className="max-w-md space-y-4">
        <Field label="Minimal to'lov summasi (so'm)" hint="Har bir to'lov shundan kam bo'lmasligi kerak">
          <input
            name="minPaymentAmount"
            required
            inputMode="numeric"
            defaultValue={s.minPaymentAmount.toString()}
            className={inputCls}
          />
        </Field>
        <Field
          label="To'lov amal qilish muddati (oy)"
          hint="Shu muddat ichida to'lamagan brend reytingdan chiqadi. O'zgartirsangiz, barcha brendlar muddati qayta hisoblanadi."
        >
          <input name="activeMonths" type="number" min={1} max={24} required defaultValue={s.activeMonths} className={inputCls} />
        </Field>
        <Field
          label="To'lov rekvizitlari"
          hint="Saytdagi «Reytingga qo'shilish» oynasining to'lov bosqichida ko'rsatiladi. Masalan: karta raqami va qabul qiluvchi ismi."
        >
          <textarea name="paymentDetails" rows={4} maxLength={600} defaultValue={s.paymentDetails} className={textareaCls} />
        </Field>
      </AdminForm>
    </>
  );
}
