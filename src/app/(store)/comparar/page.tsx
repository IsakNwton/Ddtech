import type { Metadata } from "next";
import { getProduct, toSummary } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";
import type { Product } from "@/lib/types";
import { PageHero } from "@/components/catalog/page-hero";
import { CompareView } from "@/components/compare/compare-view";

export const metadata: Metadata = pageMetadata({
  title: "Comparador de productos",
  description: "Compara tarjetas gráficas, procesadores y más, lado a lado, con las diferencias resaltadas.",
  path: "/comparar",
});

const EXAMPLES = [
  {
    label: "RTX 5060 vs RTX 5070 vs RX 9070",
    slugs: ["asus-dual-geforce-rtx-5060-oc-8gb", "gigabyte-geforce-rtx-5070-windforce-oc-sff-12g", "powercolor-hellhound-radeon-rx-9070-16gb"],
  },
  {
    label: "Ryzen 7 9700X vs 9800X3D vs Core Ultra 7 265K",
    slugs: ["amd-ryzen-7-9700x", "amd-ryzen-7-9800x3d", "intel-core-ultra-7-265k"],
  },
];

export default function ComparePage() {
  const examples = EXAMPLES.map((e) => ({
    label: e.label,
    items: e.slugs.map((s) => getProduct(s)).filter((p): p is Product => !!p).map(toSummary),
  }));
  return (
    <>
      <PageHero
        crumbs={[{ label: "Comparador" }]}
        eyebrow="Decide con datos"
        title="Comparador"
        description="Diferencias resaltadas y el mejor valor de cada característica marcado. Ideal para elegir entre modelos cercanos."
      />
      <div className="container-page mt-8">
        <CompareView examples={examples} />
      </div>
    </>
  );
}
