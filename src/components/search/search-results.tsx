"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Cpu, Layers, Monitor, Search, TrendingUp, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { POPULAR_SEARCHES, type SearchResult } from "@/lib/search";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/ui/product-image";

export interface SearchOption {
  id: string;
  href: string;
  label: string;
}

/** Construye la lista plana de opciones navegables con teclado */
export function buildOptions(query: string, result: SearchResult | null, recent: string[]): SearchOption[] {
  const q = query.trim();
  if (!q) {
    return [
      ...recent.map((r, i) => ({ id: `r${i}`, href: `/buscar?q=${encodeURIComponent(r)}`, label: r })),
      ...POPULAR_SEARCHES.map((r, i) => ({ id: `p${i}`, href: `/buscar?q=${encodeURIComponent(r)}`, label: r })),
    ];
  }
  if (!result) return [];
  return [
    ...result.suggestions.map((s, i) => ({ id: `s${i}`, href: s.href, label: s.label })),
    ...result.products.map((p) => ({ id: `x${p.id}`, href: `/producto/${p.slug}`, label: p.name })),
    { id: "all", href: `/buscar?q=${encodeURIComponent(q)}`, label: `Ver todos los resultados de "${q}"` },
  ];
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent font-semibold text-fg">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function GroupLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 pb-1.5 pt-3">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">{children}</p>
      {action}
    </div>
  );
}

export function SearchResults({
  query,
  result,
  ready,
  recent,
  activeId,
  listId,
  onPick,
  onClearRecent,
  onHover,
}: {
  query: string;
  result: SearchResult | null;
  ready: boolean;
  recent: string[];
  activeId: string | null;
  listId: string;
  onPick: () => void;
  onClearRecent: () => void;
  onHover: (id: string) => void;
}) {
  const q = query.trim();
  const optionCls = (id: string) =>
    cn(
      "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors duration-100",
      activeId === id ? "bg-surface-3 text-fg" : "text-fg-muted hover:bg-surface-2",
    );

  if (!q) {
    return (
      <div role="listbox" id={listId} aria-label="Sugerencias de búsqueda" className="py-1">
        {recent.length > 0 && (
          <>
            <GroupLabel
              action={
                <button type="button" onClick={onClearRecent} className="text-2xs font-medium text-fg-subtle hover:text-fg">
                  Borrar
                </button>
              }
            >
              Búsquedas recientes
            </GroupLabel>
            {recent.map((r, i) => (
              <Link key={r} id={`r${i}`} role="option" aria-selected={activeId === `r${i}`} href={`/buscar?q=${encodeURIComponent(r)}`} onClick={onPick} onMouseEnter={() => onHover(`r${i}`)} className={optionCls(`r${i}`)}>
                <Clock className="size-4 shrink-0 text-fg-subtle" aria-hidden />
                {r}
              </Link>
            ))}
          </>
        )}
        <GroupLabel>Lo más buscado</GroupLabel>
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {POPULAR_SEARCHES.map((r, i) => (
            <Link
              key={r}
              id={`p${i}`}
              role="option"
              aria-selected={activeId === `p${i}`}
              href={`/buscar?q=${encodeURIComponent(r)}`}
              onClick={onPick}
              onMouseEnter={() => onHover(`p${i}`)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                activeId === `p${i}` ? "border-brand-line bg-brand-soft text-fg" : "border-line-strong text-fg-muted hover:border-fg-subtle hover:text-fg",
              )}
            >
              <TrendingUp className="size-3.5" aria-hidden />
              {r}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
          {[
            { href: "/componentes/gpu", label: "Tarjetas gráficas", icon: Layers },
            { href: "/componentes/cpu", label: "Procesadores", icon: Cpu },
            { href: "/componentes/monitores", label: "Monitores", icon: Monitor },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onPick} className="flex items-center gap-2 bg-surface px-4 py-3 text-xs font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
              <Icon className="size-4 text-brand-text" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (!ready || !result) {
    return (
      <div className="space-y-2 p-4" aria-busy="true" aria-label="Cargando resultados">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (result.total === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm font-medium text-fg">Sin resultados para &ldquo;{q}&rdquo;</p>
        <p className="mt-1 text-xs text-fg-muted">Prueba con el modelo (ej. &ldquo;5070&rdquo;), la marca o la categoría.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {POPULAR_SEARCHES.slice(0, 4).map((r) => (
            <Link key={r} href={`/buscar?q=${encodeURIComponent(r)}`} onClick={onPick} className="rounded-full border border-line-strong px-3 py-1 text-xs text-fg-muted hover:text-fg">
              {r}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div role="listbox" id={listId} aria-label="Resultados de búsqueda" className="py-1">
      {result.suggestions.length > 0 && (
        <>
          <GroupLabel>Sugerencias</GroupLabel>
          {result.suggestions.map((s, i) => (
            <Link key={s.label} id={`s${i}`} role="option" aria-selected={activeId === `s${i}`} href={s.href} onClick={onPick} onMouseEnter={() => onHover(`s${i}`)} className={optionCls(`s${i}`)}>
              {s.kind === "query" ? (
                <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden />
              ) : (
                <ArrowUpRight className="size-4 shrink-0 text-brand-text" aria-hidden />
              )}
              <span className="truncate">
                <Highlight text={s.label} query={q} />
              </span>
              {s.kind !== "query" && <span className="ml-auto text-2xs text-fg-subtle">{s.kind === "category" ? "Categoría" : "Colección"}</span>}
            </Link>
          ))}
        </>
      )}
      <GroupLabel>Productos</GroupLabel>
      {result.products.map((p) => {
        const id = `x${p.id}`;
        return (
          <Link key={p.id} id={id} role="option" aria-selected={activeId === id} href={`/producto/${p.slug}`} onClick={onPick} onMouseEnter={() => onHover(id)} className={optionCls(id)}>
            <span className="stage size-12 shrink-0 overflow-hidden rounded-md border border-line p-1">
              <ProductImage src={p.image} alt="" sizes="48px" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.8125rem] text-fg">
                <Highlight text={p.name} query={q} />
              </span>
              <span className="block truncate text-2xs text-fg-subtle">
                {p.brand} · {p.categoryName}
                {p.stock <= 0 && " · Agotado"}
              </span>
            </span>
            <span className="text-right">
              <span className="tabular block text-sm font-semibold text-fg">{formatPrice(p.price)}</span>
              <span className="block text-[10px] text-fg-subtle">demo</span>
            </span>
          </Link>
        );
      })}
      <Link id="all" role="option" aria-selected={activeId === "all"} href={`/buscar?q=${encodeURIComponent(q)}`} onClick={onPick} onMouseEnter={() => onHover("all")} className={cn(optionCls("all"), "mt-1 border-t border-line py-3 font-medium text-brand-text")}>
        <Search className="size-4" aria-hidden />
        Ver los {result.total} resultados de &ldquo;{q}&rdquo;
      </Link>
    </div>
  );
}

export function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Borrar búsqueda" className="inline-flex size-7 items-center justify-center rounded-full text-fg-subtle hover:bg-surface-3 hover:text-fg">
      <X className="size-4" />
    </button>
  );
}
