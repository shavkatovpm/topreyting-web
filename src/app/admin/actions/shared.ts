import type { z } from "zod";

/** useActionState uchun umumiy holat. Muvaffaqiyatda action redirect qiladi. */
export type FormState = { error?: string } | undefined;

/** FormData -> oddiy obyekt (bo'sh satrlar undefined bo'ladi, ko'p qiymatlar massiv) */
export function formToObject(fd: FormData, arrayKeys: string[] = []) {
  const out: Record<string, unknown> = {};
  for (const key of new Set(fd.keys())) {
    if (key.startsWith("$ACTION")) continue;
    if (arrayKeys.includes(key)) {
      out[key] = fd.getAll(key).map(String);
      continue;
    }
    const v = fd.get(key);
    if (typeof v === "string") out[key] = v.trim() === "" ? undefined : v.trim();
  }
  return out;
}

export function firstError(err: z.ZodError): string {
  const issue = err.issues[0];
  const field = issue.path.join(".");
  return field ? `${field}: ${issue.message}` : issue.message;
}

/** Matnli maydon: har qator = bitta element */
export function lines(v: string | undefined): string[] {
  return (v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
