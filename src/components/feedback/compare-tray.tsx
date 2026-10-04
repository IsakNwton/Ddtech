"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompareArrows, X } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { MAX_COMPARE, useCompare } from "@/store/compare";
import { ProductImage } from "@/components/ui/product-image";
import { buttonStyles } from "@/components/ui/button";

/** Bandeja flotante del comparador: visible mientras hay productos seleccionados */
export function CompareTray() {
  const hydrated = useHydrated();
  const items = useCompare((s) => s.items);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const pathname = usePathname();
  if (!hydrated || items.length === 0 || pathname.startsWith("/comparar") || pathname.startsWith("/checkout") || pathname.startsWith("/arma-tu-pc")) return null;

  return (
    <div className="fixed inset-x-0 bottom-[4.5rem] z-30 flex justify-center px-3 lg:bottom-5">
      <div className="flex w-full max-w-xl animate-fade-up items-center gap-3 rounded-xl border border-line-strong bg-surface-3/95 p-2.5 pl-3.5 shadow-pop backdrop-blur-xl">
        <GitCompareArrows className="hidden size-5 shrink-0 text-brand-text sm:block" aria-hidden />
        <ul className="flex min-w-0 flex-1 gap-1.5" aria-label="Productos en el comparador">
          {Array.from({ length: MAX_COMPARE }).map((_, i) => {
            const p = items[i];
            return (
              <li key={p?.id ?? `empty-${i}`} className="relative">
                {p ? (
                  <>
                    <span className="stage block size-11 overflow-hidden rounded-md border border-line p-1">
                      <ProductImage src={p.image} alt={p.name} sizes="44px" />
                    </span>
                    <button type="button" onClick={() => remove(p.id)} aria-label={`Quitar ${p.name}`} className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-surface-4 text-fg-muted ring-2 ring-surface-3 hover:text-fg">
                      <X className="size-3" />
                    </button>
                  </>
                ) : (
                  <span className="block size-11 rounded-md border border-dashed border-line-strong" aria-hidden />
                )}
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={clear} className="hidden text-xs font-medium text-fg-subtle hover:text-fg sm:block">
          Limpiar
        </button>
        <Link href="/comparar" className={buttonStyles({ size: "sm", className: items.length < 2 ? "opacity-60" : undefined })} aria-disabled={false}>
          Comparar ({items.length})
        </Link>
      </div>
    </div>
  );
}
