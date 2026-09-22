"use client";

import { startTransition, useActionState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormState } from "../actions/shared";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  children: React.ReactNode;
  className?: string;
  /** Xavfli amal uchun tasdiq so'rovi */
  confirmText?: string;
  buttonClassName?: string;
};

/**
 * Server action'ni chaqiradi va xatoni ko'rsatadi.
 * `action` prop'i o'rniga onSubmit ishlatiladi — shunda xato bo'lganda
 * kiritilgan matnlar (uzun tavsiflar) formadan o'chib ketmaydi.
 */
export function AdminForm({
  action,
  submitLabel,
  children,
  className,
  confirmText,
  buttonClassName,
}: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (confirmText && !window.confirm(confirmText)) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      {children}
      {state?.error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          <span aria-hidden>⚠</span>
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={buttonClassName ?? cn(buttonVariants({ size: "lg" }), "mt-5")}
      >
        {pending ? "Saqlanmoqda…" : submitLabel}
      </button>
    </form>
  );
}
