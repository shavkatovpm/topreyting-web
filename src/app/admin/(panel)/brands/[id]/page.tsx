import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatSom } from "@/lib/ranking";
import { Card, Notice, PageHeader, StatusBadge, fmtDate } from "../../../_components/ui";
import { setBrandStatus } from "../../../actions/brand";
import { BrandForm } from "../brand-form";

export default async function EditBrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const [brand, categories] = await Promise.all([
    db.brand.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } },
    }),
    db.category.findMany({
      where: { status: { not: "DELETED" } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!brand || brand.status === "DELETED") notFound();

  const btn = "h-9 rounded-md border border-border bg-background px-3 text-sm hover:bg-secondary";
  const now = new Date();

  return (
    <>
      <PageHeader title={brand.name} />
      {saved && <Notice>Saqlandi</Notice>}
      {error && <Notice kind="error">{error}</Notice>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={brand.status} />
        {brand.status === "ACTIVE" ? (
          <form action={setBrandStatus.bind(null, id, "UNPUBLISHED")}>
            <button className={btn}>Yashirish</button>
          </form>
        ) : (
          <form action={setBrandStatus.bind(null, id, "ACTIVE")}>
            <button className={btn}>Nashr qilish</button>
          </form>
        )}
        <form action={setBrandStatus.bind(null, id, "DELETED")}>
          <button className={`${btn} text-red-700`}>O&apos;chirish</button>
        </form>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {brand.categories.map((bc) => {
          const live = bc.activeUntil && bc.activeUntil > now;
          return (
            <Card key={bc.id}>
              <div className="text-sm font-semibold">{bc.category.name}</div>
              <div className="mt-1 text-lg font-bold">{formatSom(bc.totalPaid)}</div>
              <div className={`text-xs ${live ? "text-emerald-700" : "text-red-700"}`}>
                {bc.activeUntil
                  ? live
                    ? `${fmtDate(bc.activeUntil)} gacha faol`
                    : `Muddati tugagan (${fmtDate(bc.activeUntil)})`
                  : "Hali to'lov yo'q — reytingda ko'rinmaydi"}
              </div>
              <Link
                href={`/admin/payments/new?bc=${bc.id}`}
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                To&apos;lov kiritish
              </Link>
            </Card>
          );
        })}
      </div>

      <BrandForm
        brand={brand}
        categories={categories}
        selectedCategoryIds={brand.categories.map((c) => c.categoryId)}
      />
    </>
  );
}
