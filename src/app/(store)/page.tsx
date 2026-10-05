import type { Metadata } from "next";
import { countByCategory, getBestSellers, getDeals, getNewArrivals, getTopRated, minPrice, summaries } from "@/data/catalog";
import { getPresetSummaries } from "@/data/builds";
import { DISCLAIMER, SITE_URL, pageMetadata } from "@/lib/seo";
import { PresetCard } from "@/components/builder/preset-card";
import { DiscoveryTabs } from "@/components/home/discovery-tabs";
import { TrustBar } from "@/components/home/trust-bar";
import { AssemblySection } from "@/components/landing/assembly-section";
import { BentoCategories, type BentoItem } from "@/components/landing/bento-categories";
import { DealsHorizontal } from "@/components/landing/deals-horizontal";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroLanding } from "@/components/landing/hero-landing";
import { Marquee } from "@/components/landing/marquee";
import { Reveal, SplitHeading } from "@/components/landing/reveal";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Componentes, PCs Gaming y hardware",
  description: "Arma tu PC con compatibilidad verificada, compara componentes y descubre ofertas. " + DISCLAIMER,
  path: "/",
});

const BRANDS = ["AMD", "NVIDIA", "Intel", "ASUS", "MSI", "Gigabyte", "Corsair", "Kingston", "Samsung", "Lian Li", "NZXT", "Noctua"];

export default function HomePage() {
  const presets = getPresetSummaries();
  const featured = presets.find((p) => p.preset.id === "1440p") ?? presets[0];

  const bento: BentoItem[] = [
    { label: "Tarjetas gráficas", caption: "GeForce RTX · Radeon · Arc", href: "/componentes/gpu", art: "cat-gpu", count: countByCategory("gpu"), from: minPrice("gpu"), size: "lg" },
    { label: "Procesadores", caption: "Ryzen · Core Ultra", href: "/componentes/cpu", art: "cat-cpu", from: minPrice("cpu"), size: "sm" },
    { label: "Tarjetas madre", caption: "AM5 · LGA1851", href: "/componentes/tarjetas-madre", art: "cat-motherboard", from: minPrice("motherboard"), size: "tall" },
    { label: "Memoria RAM", caption: "DDR5 · DDR4", href: "/componentes/memoria-ram", art: "cat-ram", from: minPrice("ram"), size: "sm" },
    { label: "SSD", caption: "NVMe Gen5 · Gen4", href: "/componentes/almacenamiento", art: "cat-storage", from: minPrice("storage"), size: "sm" },
    { label: "Gabinetes", caption: "ATX · Micro-ATX · ITX", href: "/componentes/gabinetes", art: "cat-case", from: minPrice("case"), size: "sm" },
    { label: "Monitores", caption: "QHD · 4K · OLED", href: "/componentes/monitores", art: "cat-monitor", from: minPrice("monitor"), size: "sm" },
    { label: "Periféricos", caption: "Teclados, mouse y audio", href: "/perifericos", art: "cat-peripherals", size: "sm" },
  ];

  return (
    <div className="bg-[#060709]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "DDTech (concepto de rediseño)",
          url: SITE_URL,
          potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/buscar?q={search_term_string}`, "query-input": "required name=search_term_string" },
        }}
      />
      <HeroLanding total={featured.total} watts={featured.watts} psu={featured.psu} />

      <div className="border-y border-white/[0.06] py-7">
        <Marquee items={BRANDS} itemClassName="text-sm font-semibold uppercase tracking-[0.35em] text-white/30" />
      </div>

      <div className="py-28 md:py-40">
        <BentoCategories items={bento} />
      </div>

      <AssemblySection total={featured.total} watts={featured.watts} psu={featured.psu} />

      <div className="py-28 lg:py-0">
        <DealsHorizontal products={summaries(getDeals(10))} />
      </div>

      <div className="space-y-2 overflow-hidden py-16 md:py-24">
        <Marquee items={["ARMA", "COMPARA", "JUEGA", "CREA", "TRANSMITE"]} itemClassName="text-outline text-7xl font-bold tracking-[-0.04em] md:text-[9rem]" />
        <Marquee reverse items={["DDTECH", "HARDWARE", "GAMING", "SETUP", "RENDIMIENTO"]} itemClassName="text-7xl font-bold tracking-[-0.04em] text-white/[0.06] md:text-[9rem]" />
      </div>

      <section aria-labelledby="presets-title" className="container-page py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8aa6ff]">Builds recomendadas</p>
          <SplitHeading
            className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl"
            lines={[{ text: "¿No sabes" }, { text: "qué elegir?", className: "text-white/40" }]}
          />
          <span id="presets-title" className="sr-only">
            ¿No sabes qué elegir?
          </span>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg text-white/55">Configuraciones balanceadas por objetivo. Todas pasan el verificador de compatibilidad.</p>
          </Reveal>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {presets.map((s, i) => (
            <li key={s.preset.id} className="min-w-0">
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <PresetCard summary={s} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <div className="py-12 md:py-20">
        <DiscoveryTabs
          tabs={[
            { id: "top", label: "Más vendidos", products: summaries(getBestSellers(8)) },
            { id: "new", label: "Novedades", products: summaries(getNewArrivals(8)) },
            { id: "rated", label: "Mejor valorados", products: summaries(getTopRated(8)) },
          ]}
        />
      </div>

      <div className="py-12">
        <TrustBar />
      </div>

      <div className="pb-8 pt-16 md:pt-24">
        <FinalCta />
      </div>
    </div>
  );
}
