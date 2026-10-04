"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import {
  activeFilterCount,
  applyFilters,
  formatRangeValue,
  parseFilters,
  serializeFilters,
  SORT_OPTIONS,
  type FacetMeta,
  type FilterState,
  type ListingItem,
  type SortKey,
} from "@/lib/filters";
import { formatNumber } from "@/lib/format";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { FilterPanel } from "./filter-panel";

/**
 * Vista de catálogo con filtros facetados.
 * El estado vive en la URL: compartible, indexable y compatible con "atrás".
 */
export function CatalogView({
  items,
  facets,
  emptyTitle = "No encontramos productos con esos filtros",
  sortOptions = SORT_OPTIONS,
}: {
  items: ListingItem[];
  facets: FacetMeta[];
  emptyTitle?: string;
  sortOptions?: { value: SortKey; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [sheet, setSheet] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const state = useMemo(() => parseFilters(new URLSearchParams(params.toString()), facets), [params, facets]);
  const results = useMemo(() => applyFilters(items, state), [items, state]);
  const active = activeFilterCount(state);

  const update = (next: FilterState) => {
    const qs = serializeFilters(next, new URLSearchParams(params.toString()));
    startTransition(() => router.replace(`${pathname}${qs}`, { scroll: false }));
  };

  const toggle = (key: string, value: string) => {
    const cur = state.multi[key] ?? [];
    const vals = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    update({ ...state, multi: { ...state.multi, [key]: vals } });
  };
  const setRange = (key: string, v: [number, number] | null) => {
    const range = { ...state.range };
    if (v) range[key] = v;
    else delete range[key];
    update({ ...state, range });
  };
  const setStock = (v: boolean) => update({ ...state, inStock: v });
  const setSort = (sort: SortKey) => update({ ...state, sort });
  const clearAll = () => update({ multi: {}, range: {}, inStock: false, sort: state.sort });

  const chips: { label: string; onRemove: () => void }[] = [];
  for (const f of facets) {
    if (f.type === "multi") for (const v of state.multi[f.key] ?? []) chips.push({ label: v, onRemove: () => toggle(f.key, v) });
    else if (state.range[f.key]) {
      const [a, b] = state.range[f.key];
      chips.push({ label: `${f.label}: ${formatRangeValue(a, f.unit)} – ${formatRangeValue(b, f.unit)}`, onRemove: () => setRange(f.key, null) });
    }
  }
  if (state.inStock) chips.push({ label: "Solo disponibles", onRemove: () => setStock(false) });

  const panel = <FilterPanel facets={facets} items={items} state={state} onToggle={toggle} onRange={setRange} onStock={setStock} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
      {/* Filtros desktop */}
      <aside aria-label="Filtros" className="hidden lg:block">
        <div className="sticky top-[88px] max-h-[calc(100dvh-104px)] overflow-y-auto pr-2 scrollbar-none">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Filtros</h2>
            {active > 0 && (
              <button type="button" onClick={clearAll} className="text-xs font-medium text-fg-subtle hover:text-fg">
                Limpiar ({active})
              </button>
            )}
          </div>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Barra de resultados */}
        <div className="sticky top-16 z-20 -mx-4 flex items-center gap-2 border-b border-line bg-bg/90 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setSheet(true)}>
            <SlidersHorizontal className="size-4" aria-hidden /> Filtros{active > 0 && ` (${active})`}
          </Button>
          <p className="hidden text-sm text-fg-muted lg:block" aria-live="polite">
            <span className="tabular font-semibold text-fg">{formatNumber(results.length)}</span> {results.length === 1 ? "producto" : "productos"}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-fg-muted">
              <span className="hidden sm:inline">Ordenar por</span>
              <select
                value={state.sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 rounded-md border border-line-strong bg-surface-2 px-2.5 text-sm text-fg focus:border-brand-line focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden rounded-md border border-line-strong bg-surface-2 p-0.5 sm:flex" role="group" aria-label="Vista">
              {(["grid", "list"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLayout(l)}
                  aria-pressed={layout === l}
                  aria-label={l === "grid" ? "Vista de cuadrícula" : "Vista de lista"}
                  className={cn("grid size-8 place-items-center rounded-sm transition-colors", layout === l ? "bg-surface-4 text-fg" : "text-fg-subtle hover:text-fg")}
                >
                  {l === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-fg-muted lg:hidden" aria-live="polite">
          {formatNumber(results.length)} {results.length === 1 ? "producto" : "productos"}
        </p>

        {chips.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-1.5 lg:mt-4" aria-label="Filtros activos">
            {chips.map((c) => (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={c.onRemove}
                  className="inline-flex h-7 animate-scale-in items-center gap-1.5 rounded-full border border-brand-line bg-brand-soft pl-2.5 pr-1.5 text-xs font-medium text-fg transition-colors hover:bg-brand/25"
                  aria-label={`Quitar filtro ${c.label}`}
                >
                  {c.label}
                  <X className="size-3.5 text-fg-muted" aria-hidden />
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={clearAll} className="px-2 text-xs font-medium text-fg-subtle hover:text-fg">
                Limpiar todo
              </button>
            </li>
          </ul>
        )}

        <div className={cn("mt-4 transition-opacity duration-150", pending && "opacity-60")} aria-busy={pending}>
          {results.length === 0 ? (
            <div className="rounded-lg border border-line bg-surface px-6 py-16 text-center">
              <p className="font-semibold text-fg">{emptyTitle}</p>
              <p className="mt-1 text-sm text-fg-muted">Prueba quitando algún filtro.</p>
              {active > 0 && (
                <Button variant="secondary" size="sm" className="mt-5" onClick={clearAll}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <ul className={cn("grid gap-2.5 sm:gap-4", layout === "grid" ? "grid-cols-2 md:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1")}>
              {results.map((p, i) => (
                <li key={p.id} className="flex animate-fade-in">
                  <ProductCard product={p} layout={layout} priority={i < 4} className="w-full" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Filtros móvil */}
      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        side="bottom"
        title="Filtros"
        description={active > 0 ? `${active} activos` : undefined}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={clearAll} disabled={active === 0}>
              Limpiar
            </Button>
            <Button className="flex-[2]" onClick={() => setSheet(false)}>
              Ver {formatNumber(results.length)} resultados
            </Button>
          </div>
        }
      >
        <div className="px-5 py-4">{panel}</div>
      </Sheet>
    </div>
  );
}
