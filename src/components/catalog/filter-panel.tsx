"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { facetCounts, type FacetMeta, type FilterState, type ListingItem, type MultiFacet } from "@/lib/filters";
import { RangeFilter } from "./range-filter";

function MultiOptions({
  facet,
  items,
  state,
  onToggle,
}: {
  facet: MultiFacet;
  items: ListingItem[];
  state: FilterState;
  onToggle: (key: string, value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const counts = facetCounts(items, state, facet);
  const selected = state.multi[facet.key] ?? [];
  const shown = facet.collapsed && !expanded ? facet.options.slice(0, 6) : facet.options;
  return (
    <>
      <ul className="space-y-0.5">
        {shown.map((o) => {
          const checked = selected.includes(o);
          const disabled = !checked && counts[o] === 0;
          return (
            <li key={o}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-sm px-1.5 py-1.5 text-sm transition-colors hover:bg-surface-2",
                  disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
                )}
              >
                <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={() => onToggle(facet.key, o)} />
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-xs border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-text",
                    checked ? "border-brand bg-brand text-white" : "border-line-strong bg-surface-2",
                  )}
                  aria-hidden
                >
                  {checked && <Check className="size-3 animate-check" strokeWidth={3.5} />}
                </span>
                <span className={cn("flex-1", checked ? "text-fg" : "text-fg-muted")}>{o}</span>
                <span className="tabular text-2xs text-fg-subtle">{counts[o]}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {facet.collapsed && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-1 px-1.5 text-xs font-semibold text-brand-text hover:underline">
          {expanded ? "Ver menos" : `Ver ${facet.options.length - 6} más`}
        </button>
      )}
    </>
  );
}

export function FilterPanel({
  facets,
  items,
  state,
  onToggle,
  onRange,
  onStock,
}: {
  facets: FacetMeta[];
  items: ListingItem[];
  state: FilterState;
  onToggle: (key: string, value: string) => void;
  onRange: (key: string, v: [number, number] | null) => void;
  onStock: (v: boolean) => void;
}) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  return (
    <div className="divide-y divide-line">
      <div className="pb-4">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium text-fg">
          Solo disponibles
          <button
            type="button"
            role="switch"
            aria-checked={state.inStock}
            onClick={() => onStock(!state.inStock)}
            className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200", state.inStock ? "bg-success" : "bg-surface-4")}
          >
            <span className={cn("absolute left-0 top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200", state.inStock ? "translate-x-4.5" : "translate-x-0.5")} />
          </button>
        </label>
      </div>
      {facets.map((f) => {
        const isClosed = closed[f.key];
        const activeCount = f.type === "multi" ? (state.multi[f.key]?.length ?? 0) : state.range[f.key] ? 1 : 0;
        return (
          <section key={f.key} className="py-3.5">
            <h3>
              <button
                type="button"
                aria-expanded={!isClosed}
                onClick={() => setClosed((c) => ({ ...c, [f.key]: !c[f.key] }))}
                className="flex w-full items-center justify-between gap-2 py-1 text-left text-sm font-semibold text-fg"
              >
                <span className="flex items-center gap-2">
                  {f.label}
                  {activeCount > 0 && <span className="tabular grid size-4.5 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">{activeCount}</span>}
                </span>
                <ChevronDown className={cn("size-4 text-fg-subtle transition-transform duration-200", isClosed && "-rotate-90")} aria-hidden />
              </button>
            </h3>
            {!isClosed && (
              <div className="mt-2 animate-fade-in">
                {f.type === "multi" ? (
                  <MultiOptions facet={f} items={items} state={state} onToggle={onToggle} />
                ) : (
                  <RangeFilter facet={f} value={state.range[f.key]} onCommit={(v) => onRange(f.key, v)} />
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
