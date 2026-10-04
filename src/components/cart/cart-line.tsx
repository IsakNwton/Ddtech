"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { MAX_QTY, useCart, type CartLine } from "@/store/cart";
import { toast } from "@/store/ui";
import { ProductImage } from "@/components/ui/product-image";
import { QuantityStepper } from "@/components/ui/quantity";

export function CartLineItem({ line, index, compact, onNavigate }: { line: CartLine; index: number; compact?: boolean; onNavigate?: () => void }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const restore = useCart((s) => s.restore);
  const p = line.product;

  const onRemove = () => {
    const removed = remove(p.id);
    if (removed) {
      toast({
        title: "Producto eliminado",
        description: p.name,
        action: { label: "Deshacer", onClick: () => restore(removed, index) },
      });
    }
  };

  return (
    <li className={cn("flex gap-3.5", compact ? "py-4" : "py-5")}>
      <Link href={`/producto/${p.slug}`} onClick={onNavigate} className={cn("stage shrink-0 overflow-hidden rounded-md border border-line p-1.5", compact ? "size-20" : "size-24 sm:size-28")}>
        <ProductImage src={p.image} alt={p.name} sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-2xs font-semibold uppercase tracking-[0.1em] text-fg-subtle">{p.brand}</p>
            <Link href={`/producto/${p.slug}`} onClick={onNavigate} className="mt-0.5 line-clamp-2 text-sm font-medium leading-5 text-fg hover:underline">
              {p.name}
            </Link>
          </div>
          <button type="button" onClick={onRemove} aria-label={`Eliminar ${p.name}`} className="-mr-1.5 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger">
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper size="sm" value={line.qty} max={Math.min(MAX_QTY, Math.max(1, p.stock))} onChange={(v) => setQty(p.id, v)} label={`Cantidad de ${p.name}`} />
          <div className="text-right">
            <p className="tabular text-sm font-semibold text-fg">{formatPrice(p.price * line.qty)}</p>
            {line.qty > 1 && <p className="tabular text-2xs text-fg-subtle">{formatPrice(p.price)} c/u</p>}
          </div>
        </div>
      </div>
    </li>
  );
}
