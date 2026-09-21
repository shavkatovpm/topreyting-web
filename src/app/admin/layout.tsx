import type { Metadata } from "next";

// Admin hech qachon indekslanmasin
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-secondary/30">{children}</div>;
}
