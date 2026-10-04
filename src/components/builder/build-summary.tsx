"use client";

import { AlertTriangle, Check, Info, Plus, ShoppingCart, X, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUILD_STEPS } from "@/lib/compatibility";
import { formatPrice } from "@/lib/format";
import type { BuildSlot } from "@/lib/types";
import { CategoryIcon } from "@/components/layout/category-icon";
import { Button } from "@/components/ui/button";
import { CompatIcon } from "@/components/ui/compat";
import { ProductImage } from "@/components/ui/product-image";
import { PerfResolutions, PerfUsage } from "./perf-display";
import type { ResolvedState } from "./use-build";

export function BuildSummary({
  state,
  onGoTo,
  onRemove,
  onAddToCart,
  onClose,
  className,
}: {
  state: ResolvedState;
  onGoTo: (slot: BuildSlot) => void;
  onRemove: (slot: BuildSlot) => void;
  onAddToCart: () => void;
  onClose?: () => void;
  className?: string;
}) {
  const { build, issues, level, missing, total, watts, psu, perf, count } = state;
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  const psuWatts = build.psu?.tech.kind === "psu" ? build.psu.tech.watts : 0;
  const meterMax = Math.max(psuWatts, psu, watts, 1);
  const canBuy = count > 0 && errors.length === 0 && missing.length === 0;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold tracking-[-0.01em]">Tu PC</h2>
        <span className="flex items-center gap-2">
          <span className="tabular text-xs text-fg-subtle">{count} de 8 piezas</span>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Cerrar resumen" className="-mr-2 grid size-9 place-items-center rounded-md text-fg-muted hover:bg-surface-3 hover:text-fg">
              <X className="size-4" />
            </button>
          )}
        </span>
      </div>

      {/* Piezas */}
      <ul className="divide-y divide-line px-5">
        {BUILD_STEPS.map((s) => {
          const part = build[s.slot];
          const slotIssues = state.issuesFor(s.slot);
          const slotLevel = slotIssues.some((i) => i.level === "error") ? "error" : slotIssues.some((i) => i.level === "warn") ? "warn" : "ok";
          return (
            <li key={s.slot} className="flex items-center gap-3 py-2.5">
              {part ? (
                <button type="button" onClick={() => onGoTo(s.slot)} className="stage size-10 shrink-0 overflow-hidden rounded-sm border border-line" aria-label={`Cambiar ${s.label}`}>
                  <ProductImage src={part.image} alt="" sizes="40px" className="p-0.5" />
                </button>
              ) : (
                <span className="grid size-10 shrink-0 place-items-center rounded-sm border border-dashed border-line-strong text-fg-subtle">
                  <CategoryIcon id={s.slot} className="size-4" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-2xs font-semibold uppercase tracking-[0.08em] text-fg-subtle">{s.short}</p>
                {part ? (
                  <button type="button" onClick={() => onGoTo(s.slot)} className="block w-full truncate text-left text-xs text-fg hover:underline">
                    {part.brand} {part.name}
                  </button>
                ) : (
                  <button type="button" onClick={() => onGoTo(s.slot)} className="inline-flex items-center gap-1 text-xs font-medium text-brand-text hover:underline">
                    <Plus className="size-3" aria-hidden /> Elegir {s.label.toLowerCase()}
                    {!s.required && <span className="font-normal text-fg-subtle"> · opcional</span>}
                  </button>
                )}
              </div>
              {part && (
                <>
                  {slotLevel !== "ok" && <CompatIcon level={slotLevel} />}
                  <span className="tabular text-xs font-semibold text-fg">{formatPrice(part.price)}</span>
                  <button type="button" onClick={() => onRemove(s.slot)} aria-label={`Quitar ${s.label}`} className="-mr-1.5 grid size-7 place-items-center rounded-sm text-fg-subtle hover:bg-surface-3 hover:text-fg">
                    <X className="size-3.5" />
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {/* Compatibilidad */}
      <section aria-labelledby="compat-h" className="border-t border-line px-5 py-4">
        <h3 id="compat-h" className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">Compatibilidad</h3>
        <div aria-live="polite">
          {count === 0 ? (
            <p className="mt-2 text-sm text-fg-muted">Elige tu procesador para empezar.</p>
          ) : issues.length === 0 ? (
            <p className="mt-2 flex animate-fade-in items-center gap-2 text-sm font-semibold text-success">
              <span className="grid size-5 place-items-center rounded-full bg-success-soft">
                <Check className="size-3" strokeWidth={3.5} aria-hidden />
              </span>
              Todo compatible
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {[...errors, ...warns].map((i) => (
                <li key={i.id} className={cn("animate-fade-in rounded-md border px-3 py-2.5 text-xs", i.level === "error" ? "border-danger/25 bg-danger-soft" : "border-warning/25 bg-warning-soft")}>
                  <p className={cn("flex items-center gap-1.5 font-semibold", i.level === "error" ? "text-danger" : "text-warning")}>
                    {i.level === "error" ? <XCircle className="size-3.5" aria-hidden /> : <AlertTriangle className="size-3.5" aria-hidden />}
                    {i.title}
                  </p>
                  <p className="mt-1 text-fg-muted">{i.detail}</p>
                  <button type="button" onClick={() => onGoTo(i.slots[0])} className="mt-1.5 font-semibold text-fg underline-offset-2 hover:underline">
                    Revisar {BUILD_STEPS.find((s) => s.slot === i.slots[0])?.label.toLowerCase()}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {missing.length > 0 && count > 0 && (
            <p className="mt-2 text-xs text-fg-subtle">
              Falta: {missing.map((m) => BUILD_STEPS.find((s) => s.slot === m)?.label).join(", ")}
            </p>
          )}
        </div>
      </section>

      {/* Consumo */}
      <section aria-label="Consumo" className="grid grid-cols-2 gap-4 border-t border-line px-5 py-4">
        <div>
          <h3 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">Consumo estimado</h3>
          <p className="tabular mt-1 text-2xl font-semibold tracking-[-0.02em] text-fg">
            {watts} <span className="text-sm font-medium text-fg-muted">W</span>
          </p>
        </div>
        <div>
          <h3 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">Fuente recomendada</h3>
          <p className="tabular mt-1 text-2xl font-semibold tracking-[-0.02em] text-fg">
            {psu ? (
              <>
                {psu} <span className="text-sm font-medium text-fg-muted">W+</span>
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
        {watts > 0 && (
          <div className="col-span-2">
            <div className="relative h-2 overflow-hidden rounded-full bg-surface-4" role="img" aria-label={`Consumo ${watts} W de ${psuWatts || psu} W`}>
              <div className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-500", psuWatts && watts > psuWatts ? "bg-danger" : "bg-brand-text")} style={{ width: `${(watts / meterMax) * 100}%` }} />
              {psu > 0 && <div className="absolute inset-y-0 w-0.5 bg-fg/60" style={{ left: `${(psu / meterMax) * 100}%` }} aria-hidden />}
            </div>
            <p className="mt-1.5 text-2xs text-fg-subtle">
              {psuWatts ? `Tu fuente: ${psuWatts} W · ` : ""}La marca indica la potencia recomendada.
            </p>
          </div>
        )}
      </section>

      {/* Rendimiento */}
      {perf && (
        <section aria-labelledby="perf-h" className="border-t border-line px-5 py-4">
          <h3 id="perf-h" className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">Rendimiento estimado</h3>
          <div className="mt-3">
            <PerfResolutions perf={perf} />
          </div>
          <div className="mt-4">
            <PerfUsage perf={perf} />
          </div>
          <p className="mt-3 flex gap-1.5 text-2xs leading-relaxed text-fg-subtle">
            <Info className="mt-px size-3 shrink-0" aria-hidden />
            Estimaciones orientativas con datos de demostración. El rendimiento real varía según juego, configuración y drivers.
          </p>
        </section>
      )}

      {/* Total */}
      <div className="sticky bottom-0 mt-auto border-t border-line bg-surface-2/95 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-fg-muted">Total</span>
          <span className="text-right">
            <span className="tabular text-2xl font-bold tracking-[-0.02em] text-fg">{formatPrice(total)}</span>
            <span className="ml-1 text-2xs font-semibold text-fg-subtle">MXN</span>
          </span>
        </div>
        <p className="text-right text-[10.5px] text-fg-subtle">Precio demostrativo</p>
        <Button size="lg" block className="mt-3 uppercase tracking-[0.04em]" disabled={!canBuy} onClick={onAddToCart}>
          <ShoppingCart className="size-4" aria-hidden /> Agregar build al carrito
        </Button>
        {!canBuy && count > 0 && (
          <p className="mt-2 text-center text-2xs text-fg-subtle">
            {errors.length ? "Resuelve las incompatibilidades para continuar." : "Completa las piezas requeridas para continuar."}
          </p>
        )}
        {level === "warn" && canBuy && <p className="mt-2 text-center text-2xs text-warning">Puedes continuar, pero revisa las advertencias.</p>}
      </div>
    </div>
  );
}
