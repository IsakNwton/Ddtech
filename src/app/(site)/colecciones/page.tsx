import type { Metadata } from "next";
import Link from "next/link";
import { CollectionCover } from "@/components/home/collections-preview";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { getArtist, getCollections } from "@/lib/data";
import { paragraphs } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const artist = await getArtist();
  return {
    title: "Colecciones",
    description: `Series y colecciones de la obra de ${artist.name}, agrupadas por tema, luz y período.`,
    alternates: { canonical: "/colecciones" },
  };
}

export default async function ColeccionesPage() {
  const collections = await getCollections();
  return (
    <PageTransition>
      <div>
        <PageHeader
          eyebrow="Series"
          title="Colecciones"
          intro="Cada colección reúne obras que comparten una búsqueda: un paisaje interior, una forma de mirar la luz, un período de la vida del taller."
        />
        <div className="mx-auto max-w-[1600px] space-y-28 px-5 sm:px-8 lg:space-y-40 lg:px-14">
          {collections.length === 0 && <p className="py-20 text-center font-display text-3xl text-muted-text">Aún no hay colecciones publicadas.</p>}
          {collections.map((c, i) => (
            <section key={c.slug} className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14" aria-labelledby={`col-${c.slug}`}>
              <Reveal className={i % 2 ? "lg:order-2 lg:col-span-7 lg:col-start-6" : "lg:col-span-7"}>
                <CollectionCover collection={c} sizes="(min-width: 1024px) 50vw, 92vw" />
              </Reveal>
              <Reveal delay={0.12} className={i % 2 ? "lg:order-1 lg:col-span-4 lg:col-start-1" : "lg:col-span-4 lg:col-start-9"}>
                <p className="font-display text-7xl font-light text-gold/70" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 id={`col-${c.slug}`} className="sr-only">
                  {c.title}
                </h2>
                <div className="prose-gallery mt-6">
                  {paragraphs(c.description).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <Link
                  href={`/colecciones/${c.slug}`}
                  className="group mt-8 inline-flex items-center gap-2 border-b border-ink/25 pb-0.5 text-[0.9375rem] transition-colors hover:border-ink"
                >
                  Entrar en la colección
                </Link>
              </Reveal>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
