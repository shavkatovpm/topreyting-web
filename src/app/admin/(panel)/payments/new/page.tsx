import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatSom } from "@/lib/ranking";
import { getSettings } from "@/lib/settings";
import { AdminForm } from "../../../_components/admin-form";
import { BackLink, Card, Field, PageHeader, inputCls, textareaCls } from "../../../_components/ui";
import { addPayment } from "../../../actions/payment";

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ bc?: string }>;
}) {
  await requireAdmin();
  const { bc } = await searchParams;
  const [options, settings] = await Promise.all([
    db.brandCategory.findMany({
      where: { brand: { status: { not: "DELETED" } }, category: { status: { not: "DELETED" } } },
      include: { brand: true, category: true },
      orderBy: [{ brand: { name: "asc" } }],
    }),
    getSettings(),
  ]);
  const today = new Date().toISOString().slice(0, 10);

  if (options.length === 0) {
    return (
      <>
        <BackLink href="/admin/payments" label="To'lovlar" />
        <PageHeader title="To'lov qo'shish" />
        <Card className="text-sm">Avval brend va kategoriya qo&apos;shing.</Card>
      </>
    );
  }

  return (
    <>
      <BackLink href="/admin/payments" label="To'lovlar" />
      <PageHeader
        title="To'lov qo'shish"
        description={`Minimal summa: ${formatSom(settings.minPaymentAmount)}. Har bir to'lov brendni ${settings.activeMonths} oyga faollashtiradi.`}
      />
      <AdminForm action={addPayment} submitLabel="To'lovni saqlash" className="max-w-xl space-y-4">
        <Field label="Brend va kategoriya">
          <select name="brandCategoryId" required defaultValue={bc ?? ""} className={inputCls}>
            <option value="" disabled>Tanlang…</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.brand.name} — {o.category.name} (hozir: {formatSom(o.totalPaid)})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Summa (so'm)" hint="Masalan: 50 000">
          <input name="amount" required inputMode="numeric" placeholder="50 000" className={inputCls} />
        </Field>
        <Field label="To'lov sanasi">
          <input name="paymentDate" type="date" required defaultValue={today} max={today} className={inputCls} />
        </Field>
        <Field label="Tranzaksiya / chek raqami" hint="Bank, Payme yoki Click raqami — keyin tekshirish uchun">
          <input name="reference" className={inputCls} />
        </Field>
        <Field label="Izoh">
          <textarea name="note" rows={2} className={textareaCls} />
        </Field>
      </AdminForm>
    </>
  );
}
