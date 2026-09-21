import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { AdminForm } from "../_components/admin-form";
import { Field, inputCls } from "../_components/ui";
import { login } from "../actions/auth";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">Topreyting admin</h1>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">Hisobingizga kiring</p>
        <AdminForm action={login} submitLabel="Kirish" className="space-y-4" buttonClassName="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50">
          <Field label="Email">
            <input name="email" type="email" required autoComplete="username" className={inputCls} />
          </Field>
          <Field label="Parol">
            <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
          </Field>
        </AdminForm>
      </div>
    </div>
  );
}
