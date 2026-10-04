import type { Metadata } from "next";
import { PageHero } from "@/components/catalog/page-hero";
import { FavoritesView } from "@/components/account/favorites-view";

export const metadata: Metadata = { title: "Favoritos", robots: { index: false } };

export default function FavoritosPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Favoritos" }]} title="Favoritos" description="Tus productos guardados en este dispositivo (demo)." />
      <div className="container-page mt-8">
        <FavoritesView />
      </div>
    </>
  );
}
