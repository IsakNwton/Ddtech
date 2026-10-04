import type { Metadata } from "next";
import { Suspense } from "react";
import { builderCategories, products, toBuilderPart } from "@/data/catalog";
import { getPresetSummaries } from "@/data/builds";
import { pageMetadata } from "@/lib/seo";
import { PcBuilder } from "@/components/builder/pc-builder";
import { PresetCard } from "@/components/builder/preset-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = pageMetadata({
  title: "Arma tu PC — configurador con compatibilidad verificada",
  description: "Arma tu computadora paso a paso: procesador, tarjeta madre, RAM, GPU, almacenamiento, fuente, gabinete y enfriamiento con verificación de compatibilidad.",
  path: "/arma-tu-pc",
});

function BuilderFallback() {
  return (
    <div aria-busy="true" aria-label="Cargando configurador">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-9 w-56" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-6 grid grid-cols-4 gap-2 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="hidden h-[600px] lg:block" />
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const parts = products.filter((p) => builderCategories.includes(p.category)).map(toBuilderPart);
  const presets = getPresetSummaries();
  return (
    <div className="container-page pt-5">
      <Breadcrumbs items={[{ label: "Arma tu PC" }]} />
      <div className="mt-5">
        <Suspense fallback={<BuilderFallback />}>
          <PcBuilder parts={parts} presets={presets.map((p) => ({ id: p.preset.id, name: p.preset.name, parts: p.preset.parts }))} />
        </Suspense>
      </div>
      <section aria-labelledby="presets" className="mt-20">
        <SectionHeader id="presets" eyebrow="Builds recomendadas" title="¿No sabes qué elegir?" description="Parte de una configuración balanceada y personalízala. Precios aproximados (demo)." />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {presets.map((s) => (
            <li key={s.preset.id} className="min-w-0">
              <PresetCard summary={s} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
