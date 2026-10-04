"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, Check, Cpu, CreditCard, GitCompareArrows, Heart, ShieldCheck, ShoppingCart, Store, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPrice, formatPriceCents } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";
import { useHydrated } from "@/hooks/use-hydrated";
import { useProductActions } from "@/hooks/use-product-actions";
import { MAX_QTY } from "@/store/cart";
import { useCompare } from "@/store/compare";
import { useFavorites } from "@/store/favorites";
import { Button } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity";
import { StockStatus } from "@/components/ui/stock";

/**
 * Caja de compra: precio, financiamiento, disponibilidad y envío antes del botón.
 * Dos acciones claras: "Agregar al carrito" (seguir comprando) y "Comprar ahora" (ir directo al pago).
 */
export function BuyBox({ product, msi, builderSlot }: { product: ProductSummary; msi?: number; builderSlot?: string }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const hydrated = useHydrated();
  const isFav = useFavorites((s) => s.items.some((p) => p.id === product.id));
  const inCompare = useCompare((s) => s.items.some((p) => p.id === product.id));
  const { addToCart, toggleFavorite, toggleCompare } = useProductActions();
  const out = product.stock <= 0;
  const savings = product.compareAt ? product.compareAt - product.price : 0;

  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Price price={product.price} compareAt={product.compareAt} size="xl" />
        {savings > 0 && (
          <span className="rounded-sm bg-deal-soft px-2 py-1 text-xs font-semibold text-deal">Ahorras {formatPrice(savings)}</span>
        )}
      </div>

      {msi && (
        <div className="mt-4 flex items-start gap-2.5 rounded-md bg-surface-2 px-3 py-2.5 text-sm">
          <CreditCard className="mt-0.5 size-4 shrink-0 text-brand-text" aria-hidden />
          <div>
            <p className="text-fg">
              Hasta <strong>{msi} MSI</strong> de <span className="tabular font-semibold">{formatPriceCents(product.price / msi)}</span>
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-fg-subtle">
              Ejemplo de cálculo <Placeholder>Bancos y condiciones de DDTech</Placeholder>
            </p>
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-2.5 border-y border-line py-4 text-sm">
        <li className="flex items-center justify-between gap-3">
          <StockStatus stock={product.stock} />
          {!out && <span className="text-xs text-fg-subtle">Existencias demo</span>}
        </li>
        <li className="flex items-start gap-2.5 text-fg-muted">
          <Truck className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            {product.tags.includes("envio-gratis") ? <span className="font-medium text-success">Envío gratis · </span> : "Envío a domicilio · "}
            <Placeholder>Cobertura y tiempos de entrega</Placeholder>
          </span>
        </li>
        <li className="flex items-start gap-2.5 text-fg-muted">
          <Store className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            Recoger en tienda <Placeholder>Disponibilidad por sucursal</Placeholder>
          </span>
        </li>
      </ul>

      <div className="mt-5 flex items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} max={Math.min(MAX_QTY, Math.max(1, product.stock))} />
        <Button
          size="lg"
          className={cn("h-11 flex-1", added && "bg-success text-[#04130c] hover:bg-success")}
          disabled={out}
          onClick={() => {
            if (addToCart(product, qty)) {
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1500);
            }
          }}
        >
          {added ? (
            <>
              <Check className="size-4 animate-check" strokeWidth={3} /> Agregado
            </>
          ) : out ? (
            "Agotado"
          ) : (
            <>
              <ShoppingCart className="size-4" /> Agregar al carrito
            </>
          )}
        </Button>
      </div>
      <Button
        variant="secondary"
        size="lg"
        block
        className="mt-2.5 h-11"
        disabled={out}
        onClick={() => {
          if (addToCart(product, qty, { open: false })) router.push("/checkout");
        }}
      >
        Comprar ahora
      </Button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-pressed={hydrated ? isFav : false}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors",
            hydrated && isFav ? "border-deal/40 bg-deal-soft text-deal" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
          )}
        >
          <Heart className={cn("size-4", hydrated && isFav && "fill-current")} aria-hidden />
          {hydrated && isFav ? "En favoritos" : "Favoritos"}
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(product)}
          aria-pressed={hydrated ? inCompare : false}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors",
            hydrated && inCompare ? "border-brand-line bg-brand-soft text-brand-text" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
          )}
        >
          <GitCompareArrows className="size-4" aria-hidden />
          {hydrated && inCompare ? "Comparando" : "Comparar"}
        </button>
      </div>

      {builderSlot && (
        <Link
          href={`/arma-tu-pc?agregar=${product.slug}`}
          className="group mt-4 flex items-center gap-3 rounded-md border border-brand-line bg-brand-soft px-3.5 py-3 text-sm transition-colors hover:bg-brand/20"
        >
          <Cpu className="size-5 shrink-0 text-brand-text" aria-hidden />
          <span className="flex-1">
            <span className="block font-semibold text-fg">Úsalo en Arma tu PC</span>
            <span className="block text-xs text-fg-muted">Verificamos compatibilidad con el resto de tu build.</span>
          </span>
          <span className="text-brand-text transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
        </Link>
      )}

      <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-2xs text-fg-muted">
        {[
          { icon: ShieldCheck, t: "Compra segura" },
          { icon: BadgeCheck, t: "Producto original" },
          { icon: Check, t: "Garantía" },
        ].map(({ icon: Icon, t }) => (
          <li key={t} className="flex flex-col items-center gap-1.5 rounded-md bg-surface-2 px-2 py-2.5">
            <Icon className="size-4 text-fg-subtle" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-center text-2xs text-fg-subtle">Condiciones de garantía y devoluciones: <Placeholder>por confirmar</Placeholder></p>
    </div>
  );
}
