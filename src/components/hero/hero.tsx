import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Animated mesh background */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold/20 blur-[120px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--background)_85%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container-page py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.95]">
            <span className="block">Topdagilarni</span>
            <span className="block bg-gradient-to-br from-primary to-gold bg-clip-text text-transparent">
              biz topamiz.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            O&apos;zbekistondagi har sohaning eng yaxshilarini tanlash bo&apos;yicha
            mustaqil qo&apos;llanmalar va tahlillar.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/maqolalar" className={buttonVariants({ size: "lg" })}>
              Maqolalarni o&apos;qish
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/qidiruv"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <Search size={16} />
              Qidirish
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
