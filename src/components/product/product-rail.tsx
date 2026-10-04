"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type ComponentProps, type ReactNode } from "react";
import type { ProductSummary } from "@/lib/types";
import { IconButton } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "./product-card";

/** Carrusel horizontal con scroll-snap nativo: táctil en móvil, con flechas en desktop */
export function ProductRail({
  products,
  label,
  header,
  aside,
}: {
  products: ProductSummary[];
  label: string;
  header?: Omit<ComponentProps<typeof SectionHeader>, "aside">;
  aside?: ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  const arrows = (
    <div className="hidden gap-1.5 md:flex">
      <IconButton label="Anterior" variant="surface" onClick={() => scroll(-1)}>
        <ChevronLeft className="size-4" />
      </IconButton>
      <IconButton label="Siguiente" variant="surface" onClick={() => scroll(1)}>
        <ChevronRight className="size-4" />
      </IconButton>
    </div>
  );
  return (
    <div>
      {header && (
        <SectionHeader
          {...header}
          aside={
            <div className="flex items-center gap-3">
              {aside}
              {arrows}
            </div>
          }
        />
      )}
      <ul
        ref={ref}
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 pb-2 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 xl:mx-0 xl:scroll-px-0 xl:px-0"
      >
        {products.map((p) => (
          <li key={p.id} className="flex w-[70%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[23.5%] xl:w-[calc((100%-4rem)/5)]">
            <ProductCard product={p} className="w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
