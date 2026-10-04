import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

export function Stars({ value, size = 13, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("relative inline-flex", className)} aria-hidden>
      <span className="flex text-surface-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} width={size} height={size} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span className="absolute inset-0 flex overflow-hidden text-warning" style={{ width: `${(value / 5) * 100}%` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} width={size} height={size} className="shrink-0" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
    </span>
  );
}

export function Rating({ value, count, className, compact }: { value: number; count?: number; className?: string; compact?: boolean }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs text-fg-muted", className)}
      aria-label={`Valoración ${value.toFixed(1)} de 5${count ? `, ${count} opiniones` : ""}`}
    >
      {compact ? <Star width={13} height={13} className="text-warning" fill="currentColor" strokeWidth={0} aria-hidden /> : <Stars value={value} />}
      <span className="tabular font-semibold text-fg">{value.toFixed(1)}</span>
      {count !== undefined && <span className="tabular text-fg-subtle">({formatNumber(count)})</span>}
    </span>
  );
}
