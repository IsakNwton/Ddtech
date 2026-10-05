"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { ProductSummary } from "@/lib/types";
import { ProductGrid } from "@/components/product/product-grid";

/** Pestañas de descubrimiento: Más vendidos / Novedades / Mejor valorados */
export function DiscoveryTabs({ tabs }: { tabs: { id: string; label: string; products: ProductSummary[] }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <section aria-labelledby="discover-title" className="container-page">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
        <div>
          <p className="eyebrow">Descubre</p>
          <h2 id="discover-title" className="mt-5 text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl">
            Lo que está armando
            <br />
            <span className="text-white/40">la comunidad.</span>
          </h2>
        </div>
        <div role="tablist" aria-label="Colecciones" className="flex gap-1 overflow-x-auto rounded-full border border-white/[0.08] bg-white/[0.03] p-1 backdrop-blur scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "h-10 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-200",
                active === t.id ? "bg-white text-[#07080a]" : "text-fg-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} key={current.id} className="animate-fade-in">
        <ProductGrid products={current.products} />
      </div>
    </section>
  );
}
