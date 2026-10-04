"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";
import { useProductActions } from "@/hooks/use-product-actions";

/** Barra de compra fija en móvil: aparece cuando la caja de compra sale de pantalla */
export function StickyBuyBar({ product, anchorId }: { product: ProductSummary; anchorId: string }) {
  const [visible, setVisible] = useState(false);
  const { addToCart } = useProductActions();
  useEffect(() => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.top < 0));
    obs.observe(el);
    return () => obs.disconnect();
  }, [anchorId]);
  const out = product.stock <= 0;
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface/95 px-4 py-2.5 backdrop-blur-xl transition-transform duration-200 lg:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-[calc(100%+4rem)]",
      )}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-fg-muted">{product.name}</p>
          <p className="tabular text-base font-bold">{formatPrice(product.price)} <span className="text-2xs font-medium text-fg-subtle">demo</span></p>
        </div>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          disabled={out}
          onClick={() => addToCart(product)}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          <ShoppingCart className="size-4" aria-hidden /> {out ? "Agotado" : "Agregar"}
        </button>
      </div>
    </div>
  );
}
