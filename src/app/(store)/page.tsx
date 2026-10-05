import type { Metadata } from "next";
import { countByCategory, getBestSellers, getDeals, getNewArrivals, getTopRated, minPrice, products, summaries } from "@/data/catalog";
import { getPresetSummaries } from "@/data/builds";
import { DISCLAIMER, SITE_URL, pageMetadata } from "@/lib/seo";
import { DiscoveryTabs } from "@/components/home/discovery-tabs";
import { AssemblySection } from "@/components/landing/assembly-section";
import { BentoCategories, type BentoItem } from "@/components/landing/bento-categories";
import { BuildsShowcase } from "@/components/landing/builds-showcase";
import { DealsHorizontal } from "@/components/landing/deals-horizontal";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroLanding } from "@/components/landing/hero-landing";
import { Marquee } from "@/components/landing/marquee";
import { ProcessTimeline } from "@/components/landing/process-timeline";
import { ShowroomFaq } from "@/components/landing/showroom-faq";
import { WhyDdtech } from "@/components/landing/why-ddtech";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Componentes, PCs Gaming y hardware desde Guadalajara",
  description: "Arma la PC de tus sueños con compatibilidad verificada, PCs armadas por expertos y envío a todo México. " + DISCLAIMER,
  path: "/",
});

const BRANDS = ["AMD", "NVIDIA", "Intel", "ASUS", "MSI", "Gigabyte", "Corsair", "Kingston", "Samsung", "Lian Li", "NZXT", "Noctua"];

export default function HomePage() {
  const presets = getPresetSummaries();
  const featured = presets.find((p) => p.preset.id === "1440p") ?? presets[0];

  const bento: BentoItem[] = [
    { label: "Tarjetas gráficas", caption: "GeForce RTX · Radeon · Arc", href: "/componentes/gpu", art: "cat-gpu", glow: "#3b6bff", count: countByCategory("gpu"), from: minPrice("gpu"), size: "lg" },
    { label: "Procesadores", caption: "Ryzen · Core Ultra", href: "/componentes/cpu", art: "cat-cpu", glow: "#f97316", from: minPrice("cpu"), size: "sm" },
    { label: "Tarjetas madre", caption: "AM5 · LGA1851", href: "/componentes/tarjetas-madre", art: "cat-motherboard", glow: "#22d3ee", from: minPrice("motherboard"), size: "tall" },
    { label: "Memoria RAM", caption: "DDR5 · DDR4", href: "/componentes/memoria-ram", art: "cat-ram", glow: "#a78bfa", from: minPrice("ram"), size: "sm" },
    { label: "SSD", caption: "NVMe Gen5 · Gen4", href: "/componentes/almacenamiento", art: "cat-storage", glow: "#34d399", from: minPrice("storage"), size: "sm" },
    { label: "Gabinetes", caption: "ATX · Micro-ATX · ITX", href: "/componentes/gabinetes", art: "cat-case", glow: "#7aa2ff", from: minPrice("case"), size: "sm" },
    { label: "Monitores", caption: "QHD · 4K · OLED", href: "/componentes/monitores", art: "cat-monitor", glow: "#ec4899", from: minPrice("monitor"), size: "sm" },
    { label: "Periféricos", caption: "Teclados, mouse y audio", href: "/perifericos", art: "cat-peripherals", glow: "#facc15", size: "sm" },
  ];

  const stats = [
    { value: `${products.length}+`, label: "productos en catálogo demo" },
    { value: `${BRANDS.length}`, label: "marcas líderes" },
    { value: "8", label: "verificaciones de compatibilidad" },
    { value: `${presets.length}`, label: "builds recomendadas" },
  ];

  return (
    <div className="bg-[#05060a]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "DDTech (concepto de rediseño)",
          url: SITE_URL,
          potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/buscar?q={search_term_string}`, "query-input": "required name=search_term_string" },
        }}
      />
      <HeroLanding total={featured.total} watts={featured.watts} psu={featured.psu} stats={stats} />

      <div className="relative border-y border-white/[0.06] bg-white/[0.012] py-8">
        <p className="sr-only">Marcas disponibles: {BRANDS.join(", ")}</p>
        <Marquee items={BRANDS} itemClassName="text-sm font-semibold uppercase tracking-[0.35em] text-white/35" />
      </div>

      <div className="py-28 md:py-40">
        <WhyDdtech />
      </div>

      <div className="pb-28 md:pb-40">
        <BentoCategories items={bento} />
      </div>

      <AssemblySection total={featured.total} watts={featured.watts} psu={featured.psu} />

      <div className="py-28 md:py-36">
        <BuildsShowcase presets={presets} featuredId={featured.preset.id} />
      </div>

      <div className="lg:py-0">
        <DealsHorizontal products={summaries(getDeals(10))} />
      </div>

      <div className="space-y-2 overflow-hidden py-16 md:py-24">
        <Marquee items={["ARMA", "COMPARA", "JUEGA", "CREA", "TRANSMITE"]} itemClassName="text-outline text-7xl font-bold tracking-[-0.04em] md:text-[9rem]" />
        <Marquee reverse items={["DDTECH", "GUADALAJARA", "GAMING", "SETUP", "RENDIMIENTO"]} itemClassName="text-7xl font-bold tracking-[-0.04em] text-white/[0.06] md:text-[9rem]" />
      </div>

      <div className="pb-28 md:pb-36">
        <ProcessTimeline />
      </div>

      <div className="pb-16 md:pb-24">
        <DiscoveryTabs
          tabs={[
            { id: "top", label: "Más vendidos", products: summaries(getBestSellers(8)) },
            { id: "new", label: "Novedades", products: summaries(getNewArrivals(8)) },
            { id: "rated", label: "Mejor valorados", products: summaries(getTopRated(8)) },
          ]}
        />
      </div>

      <div className="py-20 md:py-28">
        <ShowroomFaq />
      </div>

      <div className="pb-8 pt-8 md:pt-12">
        <FinalCta />
      </div>
    </div>
  );
}
