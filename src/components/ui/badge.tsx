import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ProductTag } from "@/lib/types";

type Tone = "neutral" | "brand" | "deal" | "success" | "warning" | "danger" | "outline";

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-5.5 items-center gap-1 whitespace-nowrap rounded-xs px-1.5 text-2xs font-bold uppercase tracking-[0.06em]",
        {
          neutral: "bg-surface-4 text-fg-muted",
          brand: "bg-brand-soft text-brand-text ring-1 ring-inset ring-brand-line",
          deal: "bg-deal-strong text-white",
          success: "bg-success-soft text-success",
          warning: "bg-warning-soft text-warning",
          danger: "bg-danger-soft text-danger",
          outline: "text-fg-muted ring-1 ring-inset ring-line-strong",
        }[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const TAG_META: Record<ProductTag, { label: string; tone: Tone }> = {
  oferta: { label: "Oferta", tone: "deal" },
  nuevo: { label: "Nuevo", tone: "brand" },
  top: { label: "Top ventas", tone: "neutral" },
  "envio-gratis": { label: "Envío gratis", tone: "success" },
};

/** Etiquetas de producto ordenadas por relevancia comercial */
export function ProductTags({ tags, max = 2, className }: { tags: ProductTag[]; max?: number; className?: string }) {
  const order: ProductTag[] = ["oferta", "nuevo", "top", "envio-gratis"];
  const list = order.filter((t) => tags.includes(t)).slice(0, max);
  if (!list.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {list.map((t) => (
        <Badge key={t} tone={TAG_META[t].tone}>
          {TAG_META[t].label}
        </Badge>
      ))}
    </div>
  );
}
