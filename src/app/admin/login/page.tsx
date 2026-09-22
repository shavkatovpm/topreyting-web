import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AdminForm } from "../_components/admin-form";
import { Field, inputCls } from "../_components/ui";
import { login } from "../actions/auth";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-lg">
        <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <h1 className="mt-3 text-xl font-bold tracking-tight">Topreyting admin</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">Hisobingizga kiring</p>
        <AdminForm
          action={login}
          submitLabel="Kirish"
          className="space-y-4"
          buttonClassName={cn(buttonVariants({ size: "lg" }), "mt-2 w-full")}
        >
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
