"use client";

import { Lock, ShoppingCart, Tag } from "lucide-react";
import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartCount, cartSavings, cartSubtotal, useCart } from "@/store/cart";
import { toast } from "@/store/ui";
import { Button, ButtonLink } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { Skeleton } from "@/components/ui/skeleton";
import { CartLineItem } from "./cart-line";
import { CartTotals } from "./cart-summary";

export function CartPage() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [code, setCode] = useState("");

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-surface px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-surface-3 text-fg-subtle">
          <ShoppingCart className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-lg font-semibold">Tu carrito está vacío</h2>
        <p className="mt-1 text-sm text-fg-muted">Empieza armando tu PC o explora los componentes más buscados.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <ButtonLink href="/arma-tu-pc">Armar mi PC</ButtonLink>
          <ButtonLink href="/componentes" variant="secondary">
            Ver componentes
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <section aria-labelledby="cart-items">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 id="cart-items" className="text-sm font-semibold text-fg-muted">
            {cartCount(lines)} {cartCount(lines) === 1 ? "producto" : "productos"}
          </h2>
          <button type="button" onClick={clear} className="text-xs text-fg-subtle hover:text-fg">
            Vaciar carrito
          </button>
        </div>
        <ul className="divide-y divide-line">
          {lines.map((l, i) => (
            <CartLineItem key={l.product.id} line={l} index={i} />
          ))}
        </ul>
      </section>
      <aside aria-label="Resumen del pedido">
        <div className="sticky top-[88px] rounded-xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-base font-semibold">Resumen</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast({ title: "Cupones: función demostrativa", description: "Las promociones deben definirse con DDTech.", tone: "warning" });
            }}
          >
            <label className="relative flex-1">
              <span className="sr-only">Código de descuento</span>
              <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de descuento"
                className="h-10 w-full rounded-md border border-line-strong bg-surface-2 pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-brand-line focus:outline-none"
              />
            </label>
            <Button type="submit" variant="secondary" size="sm" className="h-10">
              Aplicar
            </Button>
          </form>
          <div className="mt-5">
            <CartTotals subtotal={cartSubtotal(lines)} savings={cartSavings(lines)} />
          </div>
          <ButtonLink href="/checkout" size="lg" block className="mt-5">
            <Lock className="size-4" aria-hidden /> Finalizar compra
          </ButtonLink>
          <p className="mt-3 text-center text-2xs text-fg-subtle">
            Métodos de pago y MSI <Placeholder>por confirmar con DDTech</Placeholder>
          </p>
        </div>
      </aside>
    </div>
  );
}
