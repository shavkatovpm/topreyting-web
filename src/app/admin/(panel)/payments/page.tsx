import { Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatSom } from "@/lib/ranking";
import { AdminForm } from "../../_components/admin-form";
import { EmptyState, Notice, PageHeader, StatusBadge, Table, fmtDate, td, textareaCls, th, trHover } from "../../_components/ui";
import { voidPayment } from "../../actions/payment";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; voided?: string }>;
}) {
  const admin = await requireAdmin();
  const isSuper = admin.role === "SUPER_ADMIN";
  const { added, voided } = await searchParams;

  const payments = await db.payment.findMany({
    // ADMIN faqat o'zi kiritgan to'lovlarni ko'radi
    where: isSuper ? {} : { createdById: admin.id },
    include: { brandCategory: { include: { brand: true, category: true } }, createdBy: true },
    orderBy: [{ paymentDate: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <>
      <PageHeader
        title="To'lovlar"
        description={
          isSuper
            ? "To'lovlar o'chirilmaydi: xato bo'lsa bekor qilinadi (sabab bilan) va reyting avtomatik qayta hisoblanadi"
            : "Siz kiritgan to'lovlar"
        }
        action={{ href: "/admin/payments/new", label: "To'lov qo'shish" }}
      />
      {added && <Notice>To&apos;lov saqlandi, reyting yangilandi</Notice>}
      {voided && <Notice>To&apos;lov bekor qilindi, reyting qayta hisoblandi</Notice>}

      {payments.length === 0 ? (
        <EmptyState icon={Wallet} title="To'lov yo'q" description="«To'lov qo'shish» tugmasi orqali birinchi to'lovni kiriting." />
      ) : (
        <Table>
          <thead>
            <tr>
              <th className={th}>Sana</th>
              <th className={th}>Brend</th>
              <th className={th}>Kategoriya</th>
              <th className={th}>Summa</th>
              <th className={th}>Kiritdi</th>
              <th className={th}>Holat</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className={`${trHover} ${p.status === "VOIDED" ? "opacity-60" : ""}`}>
                <td className={td}>{fmtDate(p.paymentDate)}</td>
                <td className={td}>
                  {p.brandCategory.brand.name}
                  {p.reference && <div className="text-xs text-muted-foreground">#{p.reference}</div>}
                </td>
                <td className={td}>{p.brandCategory.category.name}</td>
                <td className={`${td} font-medium`}>{formatSom(p.amount)}</td>
                <td className={`${td} text-muted-foreground`}>{p.createdBy.name}</td>
                <td className={td}>
                  <StatusBadge status={p.status} />
                  {p.status === "VOIDED" && p.voidReason && (
                    <div className="mt-1 text-xs text-muted-foreground">{p.voidReason}</div>
                  )}
                  {isSuper && p.status === "CONFIRMED" && (
                    <details className="mt-1.5">
                      <summary className="cursor-pointer text-xs font-medium text-red-700 hover:underline">Bekor qilish</summary>
                      <AdminForm
                        action={voidPayment.bind(null, p.id)}
                        submitLabel="Bekor qilish"
                        confirmText="To'lovni bekor qilasizmi? Reyting qayta hisoblanadi."
                        className="mt-2 w-56"
                        buttonClassName="mt-2 h-8 rounded-md bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <textarea name="reason" required rows={2} placeholder="Sabab (majburiy)" className={textareaCls} />
                      </AdminForm>
                    </details>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
