import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatSom } from "@/lib/ranking";
import { BackLink, Card, Notice, PageHeader, StatusBadge, btnDanger, btnOutline, fmtDate } from "../../../_components/ui";
import { setBrandStatus } from "../../../actions/brand";
import { setCategoryStatus } from "../../../actions/category";
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
      select: { id: true, name: true, status: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!brand || brand.status === "DELETED") notFound();

  const now = new Date();

  return (
    <>
      <BackLink href="/admin/brands" label="Barcha brendlar" />
      <PageHeader title={brand.name} />
      {saved && <Notice>Saqlandi</Notice>}
      {error && <Notice kind="error">{error}</Notice>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={brand.status} />
        {brand.status === "ACTIVE" ? (
          <form action={setBrandStatus.bind(null, id, "UNPUBLISHED")}>
            <button className={btnOutline}>Yashirish</button>
          </form>
        ) : (
          <form action={setBrandStatus.bind(null, id, "ACTIVE")}>
            <button className={btnOutline}>Nashr qilish</button>
          </form>
        )}
        <form action={setBrandStatus.bind(null, id, "DELETED")}>
          <button className={btnDanger}>O&apos;chirish</button>
        </form>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {brand.categories.map((bc) => {
          const live = bc.activeUntil && bc.activeUntil > now;
          const categoryHidden = bc.category.status !== "ACTIVE";
          return (
            <Card key={bc.id} className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">{bc.category.name}</div>
                <span className={`h-2 w-2 shrink-0 rounded-full ${live ? "bg-emerald-500" : "bg-red-500"}`} aria-hidden />
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums">{formatSom(bc.totalPaid)}</div>
              <div className={`mt-0.5 text-xs ${live ? "text-emerald-700" : "text-red-700"}`}>
                {bc.activeUntil
                  ? live
                    ? `${fmtDate(bc.activeUntil)} gacha faol`
                    : `Muddati tugagan (${fmtDate(bc.activeUntil)})`
                  : "Hali to'lov yo'q — reytingda ko'rinmaydi"}
              </div>
              {categoryHidden && (
                <div className="mt-1.5 space-y-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-700">
                  <p>Kategoriya yashirin — to&apos;lov bo&apos;lsa ham brend saytda ko&apos;rinmaydi.</p>
                  <div className="flex items-center gap-3">
                    <form action={setCategoryStatus.bind(null, bc.categoryId, "ACTIVE", `/admin/brands/${id}`)}>
                      <button className="rounded-md bg-amber-600 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-700">
                        Kategoriyani nashr qilish
                      </button>
                    </form>
                    <Link href={`/admin/categories/${bc.categoryId}`} className="underline">
                      SEO matnini tahrirlash
                    </Link>
                  </div>
                </div>
              )}
              <Link
                href={`/admin/payments/new?bc=${bc.id}`}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                To&apos;lov kiritish →
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
