import type { Metadata } from "next";
import { getBestSellers, summaries } from "@/data/catalog";
import { CartPage } from "@/components/cart/cart-page";
import { PageHero } from "@/components/catalog/page-hero";
import { ProductRail } from "@/components/product/product-rail";

export const metadata: Metadata = { title: "Carrito", robots: { index: false } };

export default function CarritoPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Carrito" }]} title="Carrito" />
      <div className="container-page mt-8">
        <CartPage />
        <section className="mt-20" aria-labelledby="also">
          <ProductRail products={summaries(getBestSellers(10))} label="Más vendidos" header={{ id: "also", title: "Completa tu pedido", eyebrow: "Más vendidos" }} />
        </section>
      </div>
    </>
  );
}
