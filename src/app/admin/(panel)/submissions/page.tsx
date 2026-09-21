import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatSom } from "@/lib/ranking";
import type { SubmissionBrandData } from "@/lib/submission-validation";
import { Card, Notice, PageHeader, Table, td, th } from "../../_components/ui";

const stamp = (d: Date) => d.toISOString().replace("T", " ").slice(0, 16) + " UTC";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string }>;
}) {
  await requireAdmin();
  const { approved, rejected } = await searchParams;
  const [pending, recent] = await Promise.all([
    db.submission.findMany({
      where: { status: "PENDING" },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    }),
    db.submission.findMany({
      where: { status: { not: "PENDING" } },
      include: { category: true, reviewedBy: true },
      orderBy: { reviewedAt: "desc" },
      take: 20,
    }),
  ]);
  const brandName = (d: unknown) => (d as SubmissionBrandData).name;

  return (
    <>
      <PageHeader
        title="Arizalar"
        description="Saytdan «Reytingga qo'shilish» orqali kelgan arizalar. Chekni tekshirib tasdiqlang: to'lov tushadi va e'lon avtomatik joylanadi."
      />
      {approved && <Notice>Ariza tasdiqlandi: brend reytingga joylandi</Notice>}
      {rejected && <Notice>Ariza rad etildi</Notice>}

      <h2 className="mb-3 text-lg font-semibold">Kutilmoqda ({pending.length})</h2>
      {pending.length === 0 ? (
        <Card className="mb-8 text-sm text-muted-foreground">Kutilayotgan arizalar yo&apos;q</Card>
      ) : (
        <div className="mb-8">
          <Table>
            <thead>
              <tr>
                <th className={th}>Kelgan vaqt</th>
                <th className={th}>Brend</th>
                <th className={th}>Kategoriya</th>
                <th className={th}>Summa</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody>
              {pending.map((s) => (
                <tr key={s.id}>
                  <td className={`${td} whitespace-nowrap text-muted-foreground`}>{stamp(s.createdAt)}</td>
                  <td className={`${td} font-medium`}>{brandName(s.data)}</td>
                  <td className={td}>{s.category.name}</td>
                  <td className={td}>{formatSom(s.amount)}</td>
                  <td className={td}>
                    <Link href={`/admin/submissions/${s.id}`} className="text-primary hover:underline">
                      Ko&apos;rish
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {recent.length > 0 && (
        <>
          <h2 className="mb-3 text-lg font-semibold">So&apos;nggi ko&apos;rib chiqilganlar</h2>
          <Table>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id}>
                  <td className={`${td} whitespace-nowrap text-muted-foreground`}>
                    {s.reviewedAt ? stamp(s.reviewedAt) : "—"}
                  </td>
                  <td className={td}>{brandName(s.data)}</td>
                  <td className={td}>{s.category.name}</td>
                  <td className={td}>{formatSom(s.amount)}</td>
                  <td className={td}>
                    <span className={s.status === "APPROVED" ? "text-emerald-700" : "text-red-700"}>
                      {s.status === "APPROVED" ? "Tasdiqlangan" : "Rad etilgan"}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">{s.reviewedBy?.name}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}
