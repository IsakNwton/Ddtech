import { cn } from "@/lib/cn";
import { stockLabel } from "@/lib/format";

export function StockStatus({ stock, className }: { stock: number; className?: string }) {
  const { label, tone } = stockLabel(stock);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        { ok: "text-success", low: "text-warning", out: "text-fg-subtle" }[tone],
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          { ok: "bg-success shadow-[0_0_0_3px_rgb(52_211_153/0.15)]", low: "bg-warning shadow-[0_0_0_3px_rgb(251_191_36/0.15)]", out: "bg-fg-subtle" }[tone],
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}
