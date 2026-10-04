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
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="mb-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-brand-text">Descubre</p>
          <h2 id="discover-title" className="text-2xl font-semibold tracking-[-0.025em] md:text-[1.75rem]">
            Lo que está armando la comunidad
          </h2>
        </div>
        <div role="tablist" aria-label="Colecciones" className="flex gap-1 overflow-x-auto rounded-lg border border-line bg-surface p-1 scrollbar-none">
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
                "h-9 whitespace-nowrap rounded-md px-3.5 text-sm font-medium transition-colors duration-150",
                active === t.id ? "bg-surface-4 text-fg" : "text-fg-muted hover:text-fg",
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
