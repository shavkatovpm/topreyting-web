"use client";

import { startTransition, useActionState } from "react";
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
          className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={
          buttonClassName ??
          "mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
        }
      >
        {pending ? "Saqlanmoqda…" : submitLabel}
      </button>
    </form>
  );
}
