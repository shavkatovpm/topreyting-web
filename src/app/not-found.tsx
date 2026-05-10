import Link from "next/link";
import { Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page py-24 text-center">
      <p className="text-7xl md:text-9xl font-bold tracking-tighter bg-gradient-to-br from-primary to-gold bg-clip-text text-transparent">
        404
      </p>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-4">
        <span data-lang="uz">Sahifa topilmadi</span>
        <span data-lang="ru">Страница не найдена</span>
      </h1>
      <p className="mt-3 text-muted-foreground max-w-md mx-auto">
        <span data-lang="uz">
          Bu sahifa o&apos;chirilgan, ko&apos;chirilgan yoki hech qachon mavjud
          bo&apos;lmagan bo&apos;lishi mumkin.
        </span>
        <span data-lang="ru">
          Эта страница могла быть удалена, перемещена или никогда не существовала.
        </span>
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          <Home size={16} />
          <span data-lang="uz">Bosh sahifa</span>
          <span data-lang="ru">Главная</span>
        </Link>
        <Link href="/qidiruv" className={buttonVariants({ size: "lg", variant: "outline" })}>
          <Search size={16} />
          <span data-lang="uz">Qidiruv</span>
          <span data-lang="ru">Поиск</span>
        </Link>
      </div>
    </section>
  );
}
