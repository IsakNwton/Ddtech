import type { Metadata } from "next";
import { GalleryExplorer } from "@/components/art/gallery-explorer";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Notice } from "@/components/ui/notice";
import { dataSource, getArtist, getArtworks, getCollectionsRaw } from "@/lib/data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const artist = await getArtist();
  return {
    title: "Obras",
    description: `Catálogo de pinturas originales de ${artist.name}: óleos, acrílicos y técnicas mixtas, con ficha técnica completa de cada obra.`,
    alternates: { canonical: "/obras" },
  };
}

export default async function ObrasPage() {
  const [works, collections] = await Promise.all([getArtworks(), getCollectionsRaw()]);
  const isDemo = dataSource() === "demo";

  return (
    <PageTransition>
      <div>
        <PageHeader
          eyebrow="Catálogo de obra"
          title="Obras"
          intro={
            <>
              Cada pintura se presenta completa, sin recortes, con su ficha técnica y la historia que la acompaña. Filtre por colección, técnica, año o
              disponibilidad.
            </>
          }
        />
        <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-14" aria-label="Galería de obras">
          {isDemo && (
            <Notice title="Galería de demostración" className="mb-10 max-w-3xl">
              Las imágenes fueron generadas por computadora para mostrar el funcionamiento del sitio. No son obras del artista y se reemplazarán por las
              fotografías reales.
            </Notice>
          )}
          {works.length > 0 ? (
            <GalleryExplorer
              works={works.map((w) => ({
                slug: w.slug,
                title: w.title,
                year: w.year,
                technique: w.technique,
                dimensions: w.dimensions,
                availability: w.availability,
                image: w.image,
                isDemo: w.isDemo,
                collectionSlug: w.collectionSlug,
                order: w.order,
              }))}
              collections={collections.map((c) => ({ slug: c.slug, title: c.title }))}
            />
          ) : (
            <p className="py-24 text-center font-display text-3xl text-muted-text">Muy pronto se publicarán las primeras obras.</p>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
