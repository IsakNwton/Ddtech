"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { ProductSummary } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { Countdown } from "@/components/home/countdown";

/** Ofertas en desplazamiento horizontal ligado al scroll vertical (desktop) */
export function DealsHorizontal({ products }: { products: ProductSummary[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);

  useLayoutEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t) return;
      setDistance(Math.max(0, t.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const header = (
    <div className="flex w-[min(420px,80vw)] shrink-0 flex-col justify-center pr-6">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff8a72]">Contenido conceptual</p>
      <h2 id="deals-title" className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl">
        Ofertas
        <br />
        <span className="inline-flex items-center gap-3 text-white/40">
          de la semana <Flame className="size-10 text-[#ff6b57]" aria-hidden />
        </span>
      </h2>
      <div className="mt-8">
        <Countdown />
      </div>
      <Link href="/ofertas" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
        Ver todas las ofertas <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop: pista horizontal fija */}
      <section ref={section} aria-labelledby="deals-title" className="relative hidden lg:block" style={{ height: `calc(100svh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex items-stretch gap-5 pl-[max(2rem,calc((100vw-1440px)/2+2rem))] will-change-transform">
            {header}
            {products.map((p, i) => (
              <div key={p.id} className="w-[300px] shrink-0 xl:w-[320px]" style={{ transform: `translateY(${i % 2 ? 40 : -10}px)` }}>
                <ProductCard product={p} className="h-full w-full" />
              </div>
            ))}
            <div className="w-24 shrink-0" />
          </motion.div>
        </div>
      </section>
      {/* Móvil: carrusel nativo */}
      <section aria-label="Ofertas de la semana" className="lg:hidden">
        <div className="container-page">{header}</div>
        <ul className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 scrollbar-none sm:px-6">
          {products.map((p) => (
            <li key={p.id} className="flex w-[72%] shrink-0 snap-start sm:w-[44%]">
              <ProductCard product={p} className="w-full" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
