import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PerfEstimate, PerfLabel } from "@/lib/performance";

const LABEL_TONE: Record<PerfLabel, string> = {
  Excelente: "text-success",
  "Muy bueno": "text-success",
  Bueno: "text-brand-text",
  Básico: "text-warning",
  Limitado: "text-danger",
};

export function PerfStars({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${label}: ${value} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block size-3.5">
            <Star className="absolute inset-0 size-3.5 text-surface-4" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-3.5 text-warning" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function PerfResolutions({ perf, compact }: { perf: PerfEstimate; compact?: boolean }) {
  return (
    <ul className={cn("grid grid-cols-3", compact ? "gap-1.5" : "gap-2")}>
      {perf.resolutions.map((r) => (
        <li key={r.id} className={cn("rounded-md border border-line bg-surface-2", compact ? "px-2 py-1.5" : "px-3 py-2.5")}>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-subtle">{r.id}</p>
          <p className={cn("font-semibold", compact ? "text-xs" : "text-sm", LABEL_TONE[r.label])}>{r.label}</p>
          {!compact && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-4" aria-hidden>
              <div className="h-full rounded-full bg-current transition-[width] duration-500" style={{ width: `${Math.max(6, r.score)}%`, color: "var(--color-brand-text)" }} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function PerfUsage({ perf }: { perf: PerfEstimate }) {
  return (
    <ul className="space-y-2">
      {perf.usage.map((u) => (
        <li key={u.id} className="flex items-center justify-between text-sm">
          <span className="text-fg-muted">{u.id}</span>
          <PerfStars value={u.stars} label={u.id} />
        </li>
      ))}
    </ul>
  );
}
