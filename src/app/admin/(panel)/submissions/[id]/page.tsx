import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatSom } from "@/lib/ranking";
import { getSettings } from "@/lib/settings";
import type { SubmissionBrandData } from "@/lib/submission-validation";
import { AdminForm } from "../../../_components/admin-form";
import { Card, Field, PageHeader, inputCls, textareaCls } from "../../../_components/ui";
import { approveSubmissionAction, rejectSubmissionAction } from "../../../actions/submission";

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [sub, settings] = await Promise.all([
    db.submission.findUnique({ where: { id }, include: { category: true, reviewedBy: true } }),
    getSettings(),
  ]);
  if (!sub) notFound();
  const d = sub.data as unknown as SubmissionBrandData;
  const isPdf = sub.receiptMime === "application/pdf";
  const receiptUrl = `/admin/receipts/${sub.id}`;

  const rows: [string, string | undefined][] = [
    ["Kategoriya", sub.category.name],
    ["Aloqa (saytda ko'rinmaydi)", `${sub.contactName}, ${sub.contactPhone}`],
    ["Telefon", d.phone],
    ["Manzil", d.address],
    ["Shahar", d.city],
    ["Sayt", d.websiteUrl],
    ["Instagram", d.instagramUrl],
    ["Telegram", d.telegramUrl],
    ["Narxlar", d.priceRange],
    ["Ish vaqti", d.workingHours],
    ["Xizmatlar", d.services?.join(", ")],
  ];

  return (
    <>
      <PageHeader title={d.name} description={`Ariza · ${sub.status === "PENDING" ? "kutilmoqda" : sub.status === "APPROVED" ? "tasdiqlangan" : "rad etilgan"}`} />
      <p className="mb-4 text-sm">
        <Link href="/admin/submissions" className="text-primary hover:underline">
          ← Barcha arizalar
        </Link>
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 font-semibold">Brend ma&apos;lumotlari</h2>
            <dl className="space-y-2 text-sm">
              {rows
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[150px_1fr] gap-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold">Tavsif</h2>
            <p className="mb-3 text-sm font-medium">{d.shortDescription}</p>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{d.fullDescription}</p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-1 font-semibold">Chek</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Ariza beruvchi ko&apos;rsatgan summa: <b className="text-foreground">{formatSom(sub.amount)}</b>
            </p>
            {isPdf ? (
              <a href={receiptUrl} target="_blank" rel="noopener" className="text-primary underline">
                PDF chekni ochish
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={receiptUrl} alt="To'lov cheki" className="max-h-[520px] w-full rounded-lg border border-border object-contain" />
            )}
          </Card>

          {sub.status === "PENDING" ? (
            <>
              <Card>
                <h2 className="mb-3 font-semibold">Tasdiqlash</h2>
                <AdminForm
                  action={approveSubmissionAction.bind(null, sub.id)}
                  submitLabel="Tasdiqlash va e'lonni joylash"
                  confirmText="Chek to'g'ri ekaniga ishonch hosil qildingizmi? Brend darhol saytda paydo bo'ladi."
                >
                  <Field
                    label="Tasdiqlanadigan summa (so'm)"
                    hint={`Chekdagi haqiqiy summaga mos ekanini tekshiring. Minimal: ${formatSom(settings.minPaymentAmount)}`}
                  >
                    <input name="amount" inputMode="numeric" defaultValue={sub.amount.toString()} className={inputCls} />
                  </Field>
                </AdminForm>
              </Card>
              <Card>
                <h2 className="mb-3 font-semibold">Rad etish</h2>
                <AdminForm
                  action={rejectSubmissionAction.bind(null, sub.id)}
                  submitLabel="Rad etish"
                  buttonClassName="mt-4 h-10 rounded-md bg-red-600 px-5 text-sm font-medium text-white disabled:opacity-50"
                >
                  <textarea name="reason" required rows={2} placeholder="Sabab (majburiy)" className={textareaCls} />
                </AdminForm>
              </Card>
            </>
          ) : (
            <Card className="text-sm">
              {sub.status === "APPROVED" ? "Tasdiqlangan" : "Rad etilgan"} — {sub.reviewedBy?.name}
              {sub.rejectReason && <p className="mt-1 text-muted-foreground">Sabab: {sub.rejectReason}</p>}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
