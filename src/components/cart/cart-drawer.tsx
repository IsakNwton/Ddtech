"use client";

import { Lock, ShoppingCart } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartCount, cartSavings, cartSubtotal, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { ButtonLink } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { CartLineItem } from "./cart-line";
import { CartTotals } from "./cart-summary";

/** Carrito lateral: confirma la acción sin sacar al usuario de la página */
export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const count = cartCount(lines);

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Tu carrito"
      description={hydrated ? `${count} ${count === 1 ? "producto" : "productos"}` : "Cargando…"}
      footer={
        hydrated && lines.length > 0 ? (
          <div className="space-y-4">
            <CartTotals subtotal={cartSubtotal(lines)} savings={cartSavings(lines)} />
            <div className="grid gap-2">
              <ButtonLink href="/checkout" size="lg" block onClick={close}>
                <Lock className="size-4" aria-hidden /> Finalizar compra
              </ButtonLink>
              <ButtonLink href="/carrito" variant="ghost" size="sm" block onClick={close}>
                Ver carrito completo
              </ButtonLink>
            </div>
          </div>
        ) : undefined
      }
    >
      {!hydrated ? (
        <div className="space-y-4 p-5">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3.5">
              <Skeleton className="size-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-surface-3 text-fg-subtle">
            <ShoppingCart className="size-6" aria-hidden />
          </span>
          <p className="mt-4 font-semibold text-fg">Tu carrito está vacío</p>
          <p className="mt-1 text-sm text-fg-muted">Explora componentes o arma tu PC con compatibilidad verificada.</p>
          <div className="mt-6 grid w-full gap-2">
            <ButtonLink href="/arma-tu-pc" onClick={close} block>
              Armar mi PC
            </ButtonLink>
            <ButtonLink href="/componentes" variant="secondary" onClick={close} block>
              Explorar componentes
            </ButtonLink>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-line px-5">
          {lines.map((l, i) => (
            <CartLineItem key={l.product.id} line={l} index={i} compact onNavigate={close} />
          ))}
        </ul>
      )}
    </Sheet>
  );
}
