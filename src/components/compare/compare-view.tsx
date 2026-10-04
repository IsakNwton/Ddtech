"use client";

import Link from "next/link";
import { GitCompareArrows, Plus, ShoppingCart, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { ComparePayload, CompareRow } from "@/lib/compare";
import type { ProductSummary } from "@/lib/types";
import type { SearchDoc } from "@/lib/search";
import { useHydrated } from "@/hooks/use-hydrated";
import { useProductActions } from "@/hooks/use-product-actions";
import { MAX_COMPARE, useCompare } from "@/store/compare";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { ProductImage } from "@/components/ui/product-image";
import { Skeleton } from "@/components/ui/skeleton";

const cache = new Map<string, ComparePayload>();

function useComparePayloads(slugs: string[]) {
  const [data, setData] = useState<Record<string, ComparePayload>>({});
  const key = slugs.join(",");
  useEffect(() => {
    let alive = true;
    const missing = slugs.filter((s) => !cache.has(s));
    Promise.all(missing.map((s) => fetch(`/api/producto/${s}`).then((r) => r.json() as Promise<ComparePayload>).then((d) => cache.set(s, d)))).then(() => {
      if (alive) setData(Object.fromEntries(slugs.filter((s) => cache.has(s)).map((s) => [s, cache.get(s)!])));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return data;
}

type Example = { label: string; items: ProductSummary[] };

export function CompareView({ examples }: { examples: Example[] }) {
  const hydrated = useHydrated();
  const items = useCompare((s) => s.items);
  const remove = useCompare((s) => s.remove);
  const setItems = useCompare((s) => s.set);
  const clear = useCompare((s) => s.clear);
  const { addToCart } = useProductActions();
  const [diffOnly, setDiffOnly] = useState(false);
  const [highlight, setHighlight] = useState(true);
  const [picker, setPicker] = useState<SearchDoc[] | null>(null);

  const payloads = useComparePayloads(items.map((i) => i.slug));
  const ready = items.every((i) => payloads[i.slug]);

  // Opciones para "Agregar producto" (índice ligero, misma categoría)
  useEffect(() => {
    if (!items.length) return;
    fetch("/api/search-index")
      .then((r) => r.json())
      .then((docs: SearchDoc[]) => setPicker(docs));
  }, [items.length]);

  const rows = useMemo(() => {
    if (!ready || !items.length) return [];
    const keys: CompareRow[] = [];
    const seen = new Set<string>();
    for (const it of items) {
      for (const r of payloads[it.slug].rows) {
        if (!seen.has(r.key)) {
          seen.add(r.key);
          keys.push(r);
        }
      }
    }
    return keys.map((k) => {
      const cells = items.map((it) => payloads[it.slug].rows.find((r) => r.key === k.key));
      const displays = cells.map((c) => c?.display ?? "—");
      const differs = new Set(displays).size > 1;
      let best: number | null = null;
      if (k.better && differs) {
        const nums = cells.map((c) => c?.num).filter((n): n is number => n !== undefined);
        if (nums.length > 1) best = k.better === "higher" ? Math.max(...nums) : Math.min(...nums);
      }
      const max = Math.max(...cells.map((c) => c?.num ?? 0), 1);
      return { row: k, cells, displays, differs, best, max };
    });
  }, [ready, items, payloads]);

  const groups = useMemo(() => {
    const out: { group: string; rows: typeof rows }[] = [];
    for (const r of rows) {
      if (diffOnly && !r.differs) continue;
      let g = out.find((x) => x.group === r.row.group);
      if (!g) out.push((g = { group: r.row.group, rows: [] }));
      g.rows.push(r);
    }
    return out;
  }, [rows, diffOnly]);

  if (!hydrated) {
    return <Skeleton className="h-[480px] w-full rounded-xl" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-surface-3 text-brand-text">
          <GitCompareArrows className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Compara hasta {MAX_COMPARE} productos lado a lado</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          Usa el botón de comparar en cualquier producto o prueba con un ejemplo:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {examples.map((e) => (
            <Button key={e.label} variant="secondary" onClick={() => setItems(e.items)}>
              {e.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const category = items[0].category;
  const candidates = (picker ?? []).filter((d) => d.category === category && !items.some((i) => i.id === d.id));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleChip active={highlight} onClick={() => setHighlight((v) => !v)}>
            Resaltar diferencias
          </ToggleChip>
          <ToggleChip active={diffOnly} onClick={() => setDiffOnly((v) => !v)}>
            Solo diferencias
          </ToggleChip>
        </div>
        <button type="button" onClick={clear} className="text-sm text-fg-subtle hover:text-fg">
          Limpiar comparación
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">Comparación de productos</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-40 bg-surface p-4 text-left align-bottom sm:w-52">
                <span className="text-xs font-medium text-fg-subtle">
                  {items.length} de {MAX_COMPARE} productos
                </span>
              </th>
              {items.map((it) => (
                <th key={it.id} scope="col" className="min-w-[180px] border-l border-line p-4 text-left align-top font-normal">
                  <div className="relative">
                    <button type="button" onClick={() => remove(it.id)} aria-label={`Quitar ${it.name}`} className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full text-fg-subtle hover:bg-surface-3 hover:text-fg">
                      <X className="size-4" />
                    </button>
                    <Link href={`/producto/${it.slug}`} className="stage block aspect-[4/3] overflow-hidden rounded-md border border-line p-2">
                      <ProductImage src={it.image} alt={it.name} sizes="200px" />
                    </Link>
                    <p className="mt-3 text-2xs font-semibold uppercase tracking-[0.1em] text-fg-subtle">{it.brand}</p>
                    <Link href={`/producto/${it.slug}`} className="mt-0.5 line-clamp-2 text-sm font-medium leading-5 text-fg hover:underline">
                      {it.name}
                    </Link>
                    <Price price={it.price} compareAt={it.compareAt} size="sm" className="mt-2" />
                    <Button size="xs" block className="mt-3" disabled={it.stock <= 0} onClick={() => addToCart(it)}>
                      <ShoppingCart className="size-3.5" aria-hidden /> {it.stock <= 0 ? "Agotado" : "Agregar"}
                    </Button>
                  </div>
                </th>
              ))}
              {items.length < MAX_COMPARE && (
                <th scope="col" className="min-w-[180px] border-l border-line p-4 align-top font-normal">
                  <label className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line-strong p-3 text-center text-xs text-fg-subtle">
                    <Plus className="size-5" aria-hidden />
                    Agregar producto
                    <select
                      className="mt-1 h-8 w-full rounded-sm border border-line-strong bg-surface-2 px-2 text-xs text-fg"
                      value=""
                      onChange={(e) => {
                        const d = candidates.find((c) => c.id === e.target.value);
                        if (d) {
                          useCompare.getState().toggle({
                            id: d.id,
                            slug: d.slug,
                            category: d.category,
                            brand: d.brand,
                            name: d.name,
                            price: d.price,
                            compareAt: d.compareAt,
                            rating: 0,
                            reviews: 0,
                            stock: d.stock,
                            sold: d.sold,
                            tags: [],
                            highlights: [],
                            image: d.image,
                          });
                        }
                      }}
                      aria-label="Elegir producto para comparar"
                    >
                      <option value="">{picker ? "Elegir…" : "Cargando…"}</option>
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.brand} {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </th>
              )}
            </tr>
          </thead>
          {!ready ? (
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="p-4" colSpan={items.length + 2}>
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            groups.map((g) => (
              <tbody key={g.group}>
                <tr className="border-t border-line bg-surface-2">
                  <th scope="rowgroup" colSpan={items.length + 2} className="sticky left-0 px-4 py-2 text-left font-mono text-2xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                    {g.group}
                  </th>
                </tr>
                {g.rows.map(({ row, cells, displays, differs, best, max }) => (
                  <tr key={row.key} className={cn("border-t border-line", highlight && differs && "bg-brand-soft/30")}>
                    <th scope="row" className="sticky left-0 z-10 bg-surface p-4 text-left text-sm font-normal text-fg-muted">
                      <span className="flex items-center gap-2">
                        {row.label}
                        {highlight && differs && <span className="size-1.5 rounded-full bg-brand-text" aria-label="Diferente" />}
                      </span>
                    </th>
                    {cells.map((c, i) => {
                      const isBest = best !== null && c?.num === best;
                      return (
                        <td key={items[i].id} className="border-l border-line p-4 align-top">
                          <span className={cn("font-medium", isBest && highlight ? "text-success" : "text-fg")}>{displays[i]}</span>
                          {isBest && highlight && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-xs bg-success-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-success">
                              <Trophy className="size-3" aria-hidden /> Mejor
                            </span>
                          )}
                          {row.bar && c?.num !== undefined && (
                            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-4" aria-hidden>
                              <span className={cn("block h-full rounded-full", isBest ? "bg-success" : "bg-brand-text")} style={{ width: `${(c.num / max) * 100}%` }} />
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {items.length < MAX_COMPARE && <td className="border-l border-line" />}
                  </tr>
                ))}
              </tbody>
            ))
          )}
          {ready && !diffOnly && (
            <tbody>
              <tr className="border-t border-line bg-surface-2">
                <th scope="rowgroup" colSpan={items.length + 2} className="px-4 py-2 text-left font-mono text-2xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                  Características
                </th>
              </tr>
              <tr className="border-t border-line">
                <th scope="row" className="sticky left-0 z-10 bg-surface p-4 text-left text-sm font-normal text-fg-muted">
                  Destacado
                </th>
                {items.map((it) => (
                  <td key={it.id} className="border-l border-line p-4 align-top">
                    <ul className="space-y-1.5 text-xs text-fg-muted">
                      {payloads[it.slug].features.slice(0, 4).map((f) => (
                        <li key={f}>· {f}</li>
                      ))}
                    </ul>
                  </td>
                ))}
                {items.length < MAX_COMPARE && <td className="border-l border-line" />}
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <p className="mt-3 text-xs text-fg-subtle">
        Datos de referencia y rendimiento relativo con fines demostrativos. Verifica especificaciones con el fabricante.
      </p>
    </div>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
        active ? "border-brand-line bg-brand-soft text-fg" : "border-line-strong text-fg-muted hover:text-fg",
      )}
    >
      <span className={cn("size-2 rounded-full", active ? "bg-brand-text" : "bg-surface-4")} aria-hidden />
      {children}
    </button>
  );
}
