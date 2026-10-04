"use client";

import { useCallback } from "react";
import type { ProductSummary } from "@/lib/types";
import { useCart } from "@/store/cart";
import { MAX_COMPARE, useCompare } from "@/store/compare";
import { useFavorites } from "@/store/favorites";
import { toast, useUI } from "@/store/ui";

/** Acciones de producto con feedback consistente (toasts, carrito lateral, contador). */
export function useProductActions() {
  const add = useCart((s) => s.add);
  const toggleFav = useFavorites((s) => s.toggle);
  const toggleCmp = useCompare((s) => s.toggle);
  const openCart = useUI((s) => s.openCart);
  const pulseCart = useUI((s) => s.pulseCart);

  const addToCart = useCallback(
    (product: ProductSummary, qty = 1, opts: { open?: boolean } = {}) => {
      if (product.stock <= 0) {
        toast({ title: "Producto agotado", description: "Te avisaremos cuando vuelva (demo).", tone: "warning" });
        return false;
      }
      add(product, qty);
      pulseCart();
      if (opts.open !== false) openCart();
      return true;
    },
    [add, openCart, pulseCart],
  );

  const toggleFavorite = useCallback(
    (product: ProductSummary) => {
      const added = toggleFav(product);
      toast({
        title: added ? "Guardado en favoritos" : "Eliminado de favoritos",
        tone: added ? "success" : "default",
        href: added ? { label: "Ver favoritos", to: "/favoritos" } : undefined,
      });
    },
    [toggleFav],
  );

  const toggleCompare = useCallback(
    (product: ProductSummary) => {
      const r = toggleCmp(product);
      if (r === "full") toast({ title: `Puedes comparar hasta ${MAX_COMPARE} productos`, tone: "warning" });
      else if (r === "replaced-category")
        toast({ title: "Nueva comparación iniciada", description: "Solo se comparan productos de la misma categoría." });
      else if (r === "added") toast({ title: "Agregado al comparador", tone: "success", href: { label: "Comparar", to: "/comparar" } });
    },
    [toggleCmp],
  );

  return { addToCart, toggleFavorite, toggleCompare };
}
