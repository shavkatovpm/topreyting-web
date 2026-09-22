import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemePreview } from "./theme-preview";

export const metadata: Metadata = {
  title: "UI rang sinovi",
  robots: { index: false, follow: false },
};

export default function TestPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ThemePreview />;
}
