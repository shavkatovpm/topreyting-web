import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminNav, type NavItem } from "../_components/nav";
import { logout } from "../actions/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const pending = await db.submission.count({ where: { status: "PENDING" } });

  const items: NavItem[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/submissions", label: pending > 0 ? `Arizalar (${pending})` : "Arizalar" },
    { href: "/admin/categories", label: "Kategoriyalar" },
    { href: "/admin/brands", label: "Brendlar" },
    { href: "/admin/payments", label: "To'lovlar" },
  ];
  if (admin.role === "SUPER_ADMIN") {
    items.push(
      { href: "/admin/logs", label: "Faoliyat jurnali" },
      { href: "/admin/settings", label: "Sozlamalar" }
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
      <aside className="border-b border-border bg-card p-4 md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <div className="mb-4 flex items-center justify-between md:block">
          <div>
            <div className="text-base font-bold">Topreyting</div>
            <div className="text-xs text-muted-foreground">
              {admin.name} · {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </div>
          </div>
          <form action={logout} className="md:mt-3">
            <button className="text-xs text-muted-foreground underline hover:text-foreground">
              Chiqish
            </button>
          </form>
        </div>
        <AdminNav items={items} />
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
