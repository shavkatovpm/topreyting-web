import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth";
import { PageHeader, Table, td, th, trHover } from "../../_components/ui";

export default async function LogsPage() {
  await requireSuperAdmin();
  const logs = await db.auditLog.findMany({
    include: { admin: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const stamp = (d: Date) =>
    d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const summary = (v: unknown) => (v ? JSON.stringify(v) : "");

  return (
    <>
      <PageHeader title="Faoliyat jurnali" description="Oxirgi 200 ta amal. Jurnalni hech kim o'chira olmaydi." />
      <Table>
        <thead>
          <tr>
            <th className={th}>Vaqt</th>
            <th className={th}>Admin</th>
            <th className={th}>Amal</th>
            <th className={th}>Tafsilot</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className={trHover}>
              <td className={`${td} whitespace-nowrap text-muted-foreground`}>{stamp(l.createdAt)}</td>
              <td className={td}>{l.admin?.name ?? "—"}</td>
              <td className={td}>{l.action}</td>
              <td className={`${td} max-w-md break-words text-xs text-muted-foreground`}>
                {summary(l.newValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
