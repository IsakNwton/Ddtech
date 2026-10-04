import { cn } from "@/lib/cn";
import { discountPercent, formatPrice } from "@/lib/format";
import { DemoTag } from "./placeholder";

interface PriceProps {
  price: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showDemo?: boolean;
  className?: string;
  layout?: "stack" | "inline";
}

export function Price({ price, compareAt, size = "md", showDemo = true, className, layout = "stack" }: PriceProps) {
  const pct = discountPercent(price, compareAt);
  return (
    <div className={cn("flex min-w-0", layout === "stack" ? "flex-col" : "flex-wrap items-baseline gap-x-2", className)}>
      {pct > 0 && layout === "stack" && (
        <div className="flex items-center gap-1.5 text-xs">
          <s className="tabular text-fg-subtle" aria-label={`Precio anterior ${formatPrice(compareAt!)}`}>
            {formatPrice(compareAt!)}
          </s>
          <span className="font-semibold text-deal">−{pct}%</span>
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "tabular font-bold tracking-[-0.02em] text-fg",
            { sm: "text-base", md: "text-xl", lg: "text-2xl", xl: "text-[2rem] leading-none" }[size],
          )}
        >
          {formatPrice(price)}
        </span>
        <span className="text-2xs font-semibold text-fg-subtle">MXN</span>
      </div>
      {pct > 0 && layout === "inline" && (
        <>
          <s className="tabular text-xs text-fg-subtle">{formatPrice(compareAt!)}</s>
          <span className="text-xs font-semibold text-deal">−{pct}%</span>
        </>
      )}
      {showDemo && <DemoTag className="mt-0.5">Precio demo · no oficial</DemoTag>}
    </div>
  );
}
