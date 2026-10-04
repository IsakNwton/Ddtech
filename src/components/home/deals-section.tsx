import { Flame } from "lucide-react";
import type { ProductSummary } from "@/lib/types";
import { ProductRail } from "@/components/product/product-rail";
import { Countdown } from "./countdown";

export function DealsSection({ products }: { products: ProductSummary[] }) {
  return (
    <section aria-labelledby="deals-title" className="container-page">
      <ProductRail
        products={products}
        label="Ofertas de la semana"
        header={{
          id: "deals-title",
          eyebrow: "Contenido conceptual",
          title: (
            <span className="inline-flex items-center gap-2.5">
              <Flame className="size-6 text-deal" aria-hidden /> Ofertas de la semana
            </span>
          ),
          description: "Selección con los mayores descuentos (precios demostrativos).",
          href: "/ofertas",
          hrefLabel: "Ver ofertas",
        }}
        aside={<Countdown />}
      />
    </section>
  );
}
