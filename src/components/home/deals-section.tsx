import Link from "next/link";
import { Flame } from "lucide-react";
import type { ProductSummary } from "@/lib/types";
import { ProductRail } from "@/components/product/product-rail";
import { SectionHeader } from "@/components/ui/section-header";
import { Countdown } from "./countdown";

export function DealsSection({ products }: { products: ProductSummary[] }) {
  return (
    <section aria-labelledby="deals-title" className="container-page">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <SectionHeader
          id="deals-title"
          className="mb-0 md:mb-0"
          eyebrow="Contenido conceptual"
          title={
            <span className="inline-flex items-center gap-2.5">
              <Flame className="size-6 text-deal" aria-hidden /> Ofertas de la semana
            </span>
          }
          description="Selección con los mayores descuentos (precios demostrativos)."
        />
        <div className="flex items-center gap-5 md:mr-24">
          <Countdown />
        </div>
      </div>
      <ProductRail products={products} label="Ofertas de la semana" />
      <div className="mt-4 text-center md:hidden">
        <Link href="/ofertas" className="text-sm font-semibold text-brand-text">
          Ver todas las ofertas →
        </Link>
      </div>
    </section>
  );
}
