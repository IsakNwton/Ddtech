"use client";

import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CandidateCheck } from "@/lib/compatibility";
import { discountPercent, formatPrice } from "@/lib/format";
import type { BuilderPart } from "@/lib/types";
import { CompatBadge } from "@/components/ui/compat";
import { ProductImage } from "@/components/ui/product-image";
import { Rating } from "@/components/ui/rating";
import { StockStatus } from "@/components/ui/stock";

export function OptionCard({
  part,
  check,
  selected,
  onSelect,
  priceDelta,
  delay = 0,
}: {
  part: BuilderPart;
  check: CandidateCheck;
  selected: boolean;
  onSelect: () => void;
  priceDelta?: number;
  delay?: number;
}) {
  const out = part.stock <= 0;
  const blocked = check.level === "error" || out;
  const pct = discountPercent(part.price, part.compareAt);
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div
        className={cn(
          "group relative flex gap-3 rounded-lg border bg-surface p-3 transition-[border-color,background-color,box-shadow] duration-150 sm:gap-4 sm:p-4",
          selected
            ? "border-brand bg-brand-soft/40 shadow-[0_0_0_1px_var(--color-brand)]"
            : blocked
              ? "border-line opacity-70"
              : "border-line hover:border-line-strong hover:bg-surface-2",
        )}
      >
        <div className="stage relative size-20 shrink-0 overflow-hidden rounded-md border border-line sm:h-[84px] sm:w-28">
          <ProductImage src={part.image} alt="" sizes="112px" className={cn("p-1.5", out && "grayscale")} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-fg-subtle">{part.brand}</p>
              <Rating value={part.rating} compact className="text-2xs" />
            </div>
            <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-5 text-fg">{part.name}</p>
            <ul className="mt-1.5 flex flex-wrap gap-1">
              {part.highlights.map((h) => (
                <li key={h} className="rounded-xs bg-surface-3 px-1.5 py-0.5 font-mono text-[10.5px] text-fg-muted">
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <CompatBadge level={check.level} />
              {out && <StockStatus stock={0} />}
              {check.reasons[0] && (
                <span className={cn("text-xs", check.level === "error" ? "text-danger" : "text-warning")}>{check.reasons[0]}</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
            <div className="sm:text-right">
              {pct > 0 && <p className="tabular text-2xs text-fg-subtle line-through">{formatPrice(part.compareAt!)}</p>}
              <p className="tabular text-base font-bold text-fg">{formatPrice(part.price)}</p>
              {priceDelta !== undefined && priceDelta !== 0 && !selected && (
                <p className={cn("tabular text-2xs", priceDelta > 0 ? "text-fg-subtle" : "text-success")}>
                  {priceDelta > 0 ? "+" : "−"}
                  {formatPrice(Math.abs(priceDelta))} vs. actual
                </p>
              )}
            </div>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={blocked && !selected}
              onClick={onSelect}
              aria-label={`${selected ? "Seleccionado" : "Elegir"}: ${part.brand} ${part.name}`}
              className={cn(
                "inline-flex h-9 min-w-24 items-center justify-center gap-1.5 rounded-md px-3.5 text-sm font-semibold transition-[background-color,color,transform] duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                selected ? "bg-brand text-white" : "border border-line-strong bg-surface-3 text-fg hover:border-brand hover:bg-brand hover:text-white",
              )}
            >
              {selected ? (
                <>
                  <Check className="size-4 animate-check" strokeWidth={3} aria-hidden /> Elegido
                </>
              ) : (
                "Elegir"
              )}
            </button>
          </div>
        </div>
        <Link
          href={`/producto/${part.slug}`}
          target="_blank"
          className="absolute right-2 top-2 hidden size-7 place-items-center rounded-md text-fg-subtle opacity-0 transition-opacity hover:bg-surface-3 hover:text-fg focus-visible:opacity-100 group-hover:opacity-100 sm:grid"
          aria-label={`Ver ficha de ${part.name} (nueva pestaña)`}
        >
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
