import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { Reveal, SplitHeading } from "./reveal";
import { TiltCard } from "./tilt-card";

export interface BentoItem {
  label: string;
  caption: string;
  href: string;
  art: string;
  count?: number;
  from?: number;
  size: "lg" | "tall" | "wide" | "sm";
  /** Color del resplandor de la tarjeta */
  glow?: string;
}

const SIZE: Record<BentoItem["size"], string> = {
  lg: "md:col-span-2 md:row-span-2",
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  sm: "",
};

export function BentoCategories({ items }: { items: BentoItem[] }) {
  return (
    <section aria-labelledby="bento-title" className="container-page">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Categorías</p>
          <SplitHeading
            className="mt-5 text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl"
            lines={[{ text: "¿Qué estás" }, { text: "buscando?", className: "text-white/40" }]}
          />
          <span id="bento-title" className="sr-only">
            ¿Qué estás buscando?
          </span>
        </div>
        <Reveal>
          <Link href="/componentes" className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white">
            Ver todas las categorías
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </Reveal>
      </div>
      <ul className="grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-4 md:gap-4">
        {items.map((c, i) => (
          <li key={c.href} className={cn(SIZE[c.size], c.size === "lg" && "col-span-2 row-span-2")}>
            <Reveal delay={i * 0.05} className="h-full">
              <TiltCard className="rounded-[28px]" intensity={c.size === "lg" ? 6 : 10}>
                <Link
                  href={c.href}
                  className="relative flex h-full flex-col justify-end overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(160deg,#12151c_0%,#0a0b0f_60%)] p-5 transition-colors duration-300 hover:border-white/20 sm:p-6"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span
                    className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
                    style={{ background: c.glow ?? "#4d7cff" }}
                    aria-hidden
                  />
                  <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center",
                      c.size === "lg" ? "bottom-20" : c.size === "tall" ? "bottom-20" : "bottom-14",
                    )}
                    style={{ transform: "translateZ(60px)" }}
                  >
                    <Image
                      src={`/art/${c.art}.svg`}
                      alt=""
                      width={480}
                      height={360}
                      unoptimized
                      className={cn(
                        "h-full w-auto max-w-[92%] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.06]",
                        c.size === "lg" && "max-w-[85%]",
                      )}
                    />
                  </span>
                  <span className="relative flex items-end justify-between gap-3" style={{ transform: "translateZ(30px)" }}>
                    <span className="min-w-0">
                      <span className={cn("block font-semibold tracking-[-0.03em] text-white", c.size === "lg" ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl")}>{c.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-white/50 sm:text-sm">
                        {c.caption}
                        {c.from ? ` · desde ${formatPrice(c.from)}` : ""}
                      </span>
                    </span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
