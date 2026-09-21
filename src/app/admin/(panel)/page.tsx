import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { EXPIRING_SOON_DAYS, formatSom } from "@/lib/ranking";
import { Card, PageHeader, Table, fmtDate, td, th } from "../_components/ui";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const isSuper = admin.role === "SUPER_ADMIN";
  const now = new Date();
  const soon = new Date(now.getTime() + EXPIRING_SOON_DAYS * 86_400_000);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [activeBrands, activeCategories, expiring, expired, latest, allTime, thisMonth] =
    await Promise.all([
      db.brand.count({ where: { status: "ACTIVE" } }),
      db.category.count({ where: { status: "ACTIVE" } }),
      db.brandCategory.findMany({
        where: { activeUntil: { gt: now, lte: soon }, brand: { status: "ACTIVE" } },
        include: { brand: true, category: true },
        orderBy: { activeUntil: "asc" },
      }),
      db.brandCategory.findMany({
        where: { activeUntil: { lte: now }, totalPaid: { gt: 0 }, brand: { status: "ACTIVE" } },
        include: { brand: true, category: true },
        orderBy: { activeUntil: "desc" },
        take: 10,
      }),
      db.payment.findMany({
        // ADMIN faqat o'zi kiritgan to'lovlarni ko'radi
        where: isSuper ? {} : { createdById: admin.id },
        include: { brandCategory: { include: { brand: true, category: true } }, createdBy: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      isSuper
        ? db.payment.aggregate({ where: { status: "CONFIRMED" }, _sum: { amount: true } })
        : null,
      isSuper
        ? db.payment.aggregate({
            where: { status: "CONFIRMED", paymentDate: { gte: monthStart } },
            _sum: { amount: true },
          })
        : null,
    ]);

  return (
    <>
      <PageHeader title="Dashboard" description={`Salom, ${admin.name}`} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Nashr qilingan brendlar" value={String(activeBrands)} />
        <Stat label="Faol kategoriyalar" value={String(activeCategories)} />
        {isSuper && (
          <>
            <Stat label="Shu oy daromad" value={formatSom(thisMonth?._sum.amount ?? 0n)} />
            <Stat label="Jami daromad" value={formatSom(allTime?._sum.amount ?? 0n)} />
          </>
        )}
      </div>

      <section className="mb-8">
        <h2 className="mb-1 text-lg font-semibold">Muddati tugayapti</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {`${EXPIRING_SOON_DAYS} kun ichida reytingdan chiqib ketadigan brendlar. Ular bilan bog'laning.`}
        </p>
        {expiring.length === 0 ? (
          <Card className="text-sm text-muted-foreground">Hozircha yo&apos;q</Card>
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>Brend</th>
                <th className={th}>Kategoriya</th>
                <th className={th}>Jami</th>
                <th className={th}>Tugaydi</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody>
              {expiring.map((bc) => (
                <tr key={bc.id}>
                  <td className={td}>{bc.brand.name}</td>
                  <td className={td}>{bc.category.name}</td>
                  <td className={td}>{formatSom(bc.totalPaid)}</td>
                  <td className={td}>{fmtDate(bc.activeUntil)}</td>
                  <td className={td}>
                    <Link className="text-primary hover:underline" href={`/admin/payments/new?bc=${bc.id}`}>
                      To&apos;lov kiritish
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      {expired.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold">Muddati tugagan (ko&apos;rinmaydi)</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Yana to&apos;lasa, shu paytdagi jami summa bilan qaytadi.
          </p>
          <Table>
            <tbody>
              {expired.map((bc) => (
                <tr key={bc.id}>
                  <td className={td}>{bc.brand.name}</td>
                  <td className={td}>{bc.category.name}</td>
                  <td className={td}>{formatSom(bc.totalPaid)}</td>
                  <td className={td}>{fmtDate(bc.activeUntil)}</td>
                  <td className={td}>
                    <Link className="text-primary hover:underline" href={`/admin/payments/new?bc=${bc.id}`}>
                      To&apos;lov kiritish
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">So&apos;nggi to&apos;lovlar</h2>
        {latest.length === 0 ? (
          <Card className="text-sm text-muted-foreground">To&apos;lovlar hali yo&apos;q</Card>
        ) : (
          <Table>
            <tbody>
              {latest.map((p) => (
                <tr key={p.id}>
                  <td className={td}>{fmtDate(p.paymentDate)}</td>
                  <td className={td}>{p.brandCategory.brand.name}</td>
                  <td className={td}>{p.brandCategory.category.name}</td>
                  <td className={td}>{formatSom(p.amount)}</td>
                  <td className={`${td} text-muted-foreground`}>{p.createdBy.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </Card>
  );
}
