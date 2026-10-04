import type { Metadata } from "next";
import { getBestSellers, getDeals, getNewArrivals, getTopRated, minPrice, summaries } from "@/data/catalog";
import { getPresetSummaries } from "@/data/builds";
import { pageMetadata } from "@/lib/seo";
import { PresetCard } from "@/components/builder/preset-card";
import { BrandStrip } from "@/components/home/brand-strip";
import { BuilderPromo } from "@/components/home/builder-promo";
import { CategoryTiles } from "@/components/home/category-tiles";
import { DealsSection } from "@/components/home/deals-section";
import { DiscoveryTabs } from "@/components/home/discovery-tabs";
import { HelpCta } from "@/components/home/help-cta";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeader } from "@/components/ui/section-header";
import { DISCLAIMER, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Componentes, PCs Gaming y hardware",
  description: "Arma tu PC con compatibilidad verificada, compara componentes y descubre ofertas. " + DISCLAIMER,
  path: "/",
});

export default function HomePage() {
  const presets = getPresetSummaries();
  const featured = presets.find((p) => p.preset.id === "1440p") ?? presets[0];
  const fromPrices = {
    cpu: minPrice("cpu"),
    ram: minPrice("ram"),
    gpu: minPrice("gpu"),
    cooling: minPrice("cooling"),
    psu: minPrice("psu"),
    case: minPrice("case"),
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "DDTech (concepto de rediseño)",
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/buscar?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Hero featured={featured} fromPrices={fromPrices} />
      <TrustBar className="mt-6" />
      <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
        <CategoryTiles />
        <DealsSection products={summaries(getDeals(10))} />
        <BuilderPromo example={featured} />
        <section aria-labelledby="presets-title" className="container-page">
          <SectionHeader
            id="presets-title"
            eyebrow="Builds recomendadas"
            title="¿No sabes qué elegir?"
            description="Configuraciones balanceadas por objetivo. Todas pasan el verificador de compatibilidad y puedes personalizarlas."
            href="/arma-tu-pc"
            hrefLabel="Ir al configurador"
          />
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {presets.map((s) => (
              <li key={s.preset.id} className="min-w-0">
                <PresetCard summary={s} />
              </li>
            ))}
          </ul>
        </section>
        <DiscoveryTabs
          tabs={[
            { id: "top", label: "Más vendidos", products: summaries(getBestSellers(8)) },
            { id: "new", label: "Novedades", products: summaries(getNewArrivals(8)) },
            { id: "rated", label: "Mejor valorados", products: summaries(getTopRated(8)) },
          ]}
        />
        <BrandStrip />
        <HelpCta />
      </div>
    </>
  );
}
