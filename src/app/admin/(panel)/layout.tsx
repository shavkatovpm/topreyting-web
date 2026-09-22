import { Building2, FolderTree, Inbox, LayoutDashboard, LogOut, ScrollText, Settings, Wallet } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminNav, type NavItem } from "../_components/nav";
import { logout } from "../actions/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const pending = await db.submission.count({ where: { status: "PENDING" } });

  const ic = "h-4 w-4 shrink-0";
  const items: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className={ic} /> },
    { href: "/admin/submissions", label: "Arizalar", icon: <Inbox className={ic} />, badge: pending },
    { href: "/admin/categories", label: "Kategoriyalar", icon: <FolderTree className={ic} /> },
    { href: "/admin/brands", label: "Brendlar", icon: <Building2 className={ic} /> },
    { href: "/admin/payments", label: "To'lovlar", icon: <Wallet className={ic} /> },
  ];
  if (admin.role === "SUPER_ADMIN") {
    items.push(
      { href: "/admin/logs", label: "Faoliyat jurnali", icon: <ScrollText className={ic} /> },
      { href: "/admin/settings", label: "Sozlamalar", icon: <Settings className={ic} /> }
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
      <aside className="border-b border-border bg-card p-4 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="mb-5 flex items-center justify-between gap-2 md:mb-6 md:block">
          <div>
            <div className="text-base font-bold tracking-tight">Topreyting</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate">{admin.name}</span>
              <span
                className={
                  admin.role === "SUPER_ADMIN"
                    ? "rounded-full bg-gold/15 px-1.5 py-0.5 font-medium text-foreground"
                    : "rounded-full bg-secondary px-1.5 py-0.5 font-medium"
                }
              >
                {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </span>
            </div>
          </div>
          <form action={logout} className="md:mt-4">
            <button className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" />
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
