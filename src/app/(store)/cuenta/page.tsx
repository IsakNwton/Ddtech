import type { Metadata } from "next";
import { builderCategories, products } from "@/data/catalog";
import { productImage } from "@/data/catalog";
import { PageHero } from "@/components/catalog/page-hero";
import { AccountView } from "@/components/account/account-view";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } };

export default function CuentaPage() {
  const parts = Object.fromEntries(
    products.filter((p) => builderCategories.includes(p.category)).map((p) => [p.id, { name: `${p.brand} ${p.name}`, image: productImage(p.slug) }]),
  );
  return (
    <>
      <PageHero crumbs={[{ label: "Mi cuenta" }]} title="Mi cuenta" description="Área de cliente demostrativa: los datos se guardan solo en este navegador." />
      <div className="container-page mt-8">
        <AccountView parts={parts} />
      </div>
    </>
  );
}
