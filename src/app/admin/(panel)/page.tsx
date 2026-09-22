import Link from "next/link";
import { Building2, CalendarClock, FolderTree, Inbox, Plus, TrendingUp, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { EXPIRING_SOON_DAYS, formatSom } from "@/lib/ranking";
import { cn } from "@/lib/utils";
import { Card, EmptyState, PageHeader, Table, fmtDate, td, th, trHover } from "../_components/ui";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const isSuper = admin.role === "SUPER_ADMIN";
  const now = new Date();
  const soon = new Date(now.getTime() + EXPIRING_SOON_DAYS * 86_400_000);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [activeBrands, activeCategories, pending, expiring, expired, latest, allTime, thisMonth] =
    await Promise.all([
      db.brand.count({ where: { status: "ACTIVE" } }),
      db.category.count({ where: { status: "ACTIVE" } }),
      db.submission.count({ where: { status: "PENDING" } }),
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

      <div className="mb-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        <Link href="/admin/brands/new" className={cn(buttonVariants({ size: "lg" }), "justify-center")}>
          <Plus className="h-4 w-4" /> Brend qo&apos;shish
        </Link>
        <Link href="/admin/payments/new" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "justify-center bg-card")}>
          <Plus className="h-4 w-4" /> To&apos;lov qo&apos;shish
        </Link>
        <Link href="/admin/categories/new" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "justify-center bg-card")}>
          <Plus className="h-4 w-4" /> Kategoriya qo&apos;shish
        </Link>
        <Link
          href="/admin/submissions"
          className={cn(
            buttonVariants({ variant: pending > 0 ? "gold" : "outline", size: "lg" }),
            "justify-center",
            pending === 0 && "bg-card"
          )}
        >
          <Inbox className="h-4 w-4" /> Arizalar{pending > 0 ? ` (${pending})` : ""}
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Building2} label="Nashr qilingan brendlar" value={String(activeBrands)} />
        <Stat icon={FolderTree} label="Faol kategoriyalar" value={String(activeCategories)} />
        {isSuper && (
          <>
            <Stat icon={TrendingUp} label="Shu oy daromad" value={formatSom(thisMonth?._sum.amount ?? 0n)} accent />
            <Stat icon={Wallet} label="Jami daromad" value={formatSom(allTime?._sum.amount ?? 0n)} accent />
          </>
        )}
      </div>

      <section className="mb-8">
        <h2 className="mb-1 text-lg font-semibold">Muddati tugayapti</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {`${EXPIRING_SOON_DAYS} kun ichida reytingdan chiqib ketadigan brendlar. Ular bilan bog'laning.`}
        </p>
        {expiring.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Hozircha yo'q" description="Muddati yaqinlashgan brendlar shu yerda ko'rinadi." />
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
                <tr key={bc.id} className={trHover}>
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
                <tr key={bc.id} className={trHover}>
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
          <EmptyState icon={Wallet} title="To'lovlar hali yo'q" description="Birinchi to'lovni kiritganingizdan so'ng shu yerda ko'rinadi." />
        ) : (
          <Table>
            <tbody>
              {latest.map((p) => (
                <tr key={p.id} className={trHover}>
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

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  /** Moliyaviy ko'rsatkichlar uchun brend rangida urg'u */
  accent?: boolean;
}) {
  return (
    <Card className="flex items-start gap-3">
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
          accent ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-0.5 truncate text-xl font-bold tabular-nums">{value}</div>
      </div>
    </Card>
  );
}
