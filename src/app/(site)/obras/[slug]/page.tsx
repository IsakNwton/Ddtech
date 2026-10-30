import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/art/artwork-card";
import { AdditionalPhotos } from "@/components/artwork/additional-photos";
import { ArtworkPager } from "@/components/artwork/artwork-pager";
import { ArtworkStage } from "@/components/artwork/artwork-stage";
import { SpecSheet } from "@/components/artwork/spec-sheet";
import { ViewerProvider } from "@/components/artwork/viewer-context";
import { PageTransition } from "@/components/motion/page-transition";
import { MaskLine, Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { AvailabilityBadge } from "@/components/ui/badges";
import { ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { getArtist, getArtwork, getArtworks, getCollection, getNeighbours, getRelated } from "@/lib/data";
import { formatDimensions, formatPrice, paragraphs } from "@/lib/format";
import { artworkLd, breadcrumbLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const works = await getArtworks();
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/obras/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = await getArtwork(slug);
  if (!work) return { title: "Obra no encontrada" };
  const description = `${work.title} (${work.year}). ${work.technique}, ${formatDimensions(work.dimensions)}. ${paragraphs(work.concept)[0] ?? ""}`.slice(0, 300);
  return {
    title: `${work.title}, ${work.year}`,
    description,
    alternates: { canonical: `/obras/${work.slug}` },
    openGraph: {
      title: `${work.title} · ${work.author}`,
      description,
      type: "article",
      images: [{ url: work.image.src, width: work.image.width, height: work.image.height, alt: work.image.alt }],
    },
    twitter: { card: "summary_large_image", images: [work.image.src] },
  };
}

export default async function ObraPage({ params }: PageProps<"/obras/[slug]">) {
  const { slug } = await params;
  const work = await getArtwork(slug);
  if (!work) notFound();

  const [artist, collection, related, { prev, next }] = await Promise.all([
    getArtist(),
    work.collectionSlug ? getCollection(work.collectionSlug) : Promise.resolve(null),
    getRelated(work),
    getNeighbours(work.slug),
  ]);

  const caption = `${work.year} · ${work.technique} · ${formatDimensions(work.dimensions)}`;
  const price = formatPrice(work.price, work.availability);
  const acquirable = work.availability === "disponible" || work.availability === "reservada";
  const wa = whatsappLink(`Hola, me interesa la obra «${work.title}» (${work.inventoryNumber}). ¿Podrían darme más información?`);
  const concept = paragraphs(work.concept);
  const story = paragraphs(work.story);

  return (
    <PageTransition>
      <article>
        <JsonLd
          data={[
            artworkLd(work, artist),
            breadcrumbLd([
              { name: "Inicio", path: "/" },
              { name: "Obras", path: "/obras" },
              { name: work.title, path: `/obras/${work.slug}` },
            ]),
          ]}
        />
        <ViewerProvider images={[work.image, ...work.gallery]} title={work.title} caption={caption}>
          {/* Sala: la pintura protagonista */}
          <section className="relative overflow-hidden bg-wall pb-14 pt-28 sm:pt-32 lg:pb-20">
            <div className="paper-grain pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-14">
              <nav aria-label="Ruta" className="mb-8 flex items-center gap-2 text-xs text-muted-text">
                <Link href="/obras" transitionTypes={["nav-back"]} className="group inline-flex items-center gap-1.5 transition-colors hover:text-ink">
                  <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-0.5" strokeWidth={1.5} />
                  Obras
                </Link>
                {collection && (
                  <>
                    <span aria-hidden>/</span>
                    <Link href={`/colecciones/${collection.slug}`} className="transition-colors hover:text-ink">
                      {collection.title}
                    </Link>
                  </>
                )}
              </nav>
              <ArtworkStage slug={work.slug} image={work.image} title={work.title} isDemo={work.isDemo} />
            </div>
          </section>

          {/* Cartela + ficha */}
          <section className="mx-auto max-w-[1600px] px-5 pt-16 sm:px-8 lg:px-14 lg:pt-24">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <p className="eyebrow">{work.author}</p>
                  <h1 className="mt-4 font-display text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl xl:text-7xl">
                    <MaskLine>{work.title}</MaskLine>
                  </h1>
                  <Reveal delay={0.15}>
                    <p className="mt-5 font-display text-xl italic text-muted-text">{caption}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <AvailabilityBadge value={work.availability} size="md" className="text-ink" />
                      {price && <span className="text-sm text-muted-text">{price}</span>}
                    </div>
                    <div className="mt-9 flex flex-wrap gap-3">
                      <ButtonLink href={`/contacto?obra=${work.slug}#formulario`} size="lg">
                        {acquirable ? "Consultar disponibilidad" : "Consultar obras similares"}
                      </ButtonLink>
                      {wa && (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noreferrer"
                          className="press glass inline-flex h-14 items-center gap-2 rounded-full px-6 text-[0.9375rem] text-ink"
                        >
                          <MessageCircle className="size-4" strokeWidth={1.5} /> WhatsApp
                        </a>
                      )}
                    </div>
                    <p className="mt-5 max-w-sm text-xs leading-relaxed text-muted-text">
                      La adquisición comienza con una consulta personal. No se realizan cobros en línea.
                    </p>
                    {work.isDemo && (
                      <Notice title="Ficha de demostración" className="mt-10">
                        Imagen generada por computadora y datos de ejemplo para mostrar la estructura de la ficha. No es una obra del artista.
                      </Notice>
                    )}
                  </Reveal>
                </div>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <Reveal>
                  <h2 className="eyebrow mb-5">Ficha técnica</h2>
                  <SpecSheet work={work} collection={collection} />
                </Reveal>

                {concept.length > 0 && (
                  <Reveal className="mt-20">
                    <h2 className="eyebrow mb-6">Texto curatorial</h2>
                    <p className="font-display text-[1.75rem] leading-[1.3] tracking-[-0.01em] text-ink text-pretty sm:text-[2rem]">{concept[0]}</p>
                    {concept.length > 1 && (
                      <div className="prose-gallery mt-6">
                        {concept.slice(1).map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    )}
                  </Reveal>
                )}

                {story.length > 0 && (
                  <Reveal className="mt-16">
                    <h2 className="eyebrow mb-6">Historia e inspiración</h2>
                    <div className="prose-gallery border-l border-gold/60 pl-6">
                      {story.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          </section>

          {work.gallery.length > 0 && (
            <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:px-14" aria-labelledby="fotos">
              <div className="mb-10 flex items-end justify-between gap-6">
                <h2 id="fotos" className="font-display text-4xl tracking-[-0.02em] sm:text-5xl">
                  Fotografías adicionales
                </h2>
                <p className="hidden text-sm text-muted-text sm:block">Toque una imagen para ampliarla</p>
              </div>
              <AdditionalPhotos images={work.gallery} />
            </section>
          )}
        </ViewerProvider>

        {related.length > 0 && (
          <section className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8 lg:px-14" aria-labelledby="relacionadas">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-14">
              <div>
                <p className="eyebrow">{collection ? `Colección ${collection.title}` : "Seguir recorriendo"}</p>
                <h2 id="relacionadas" className="mt-3 font-display text-4xl tracking-[-0.02em] sm:text-5xl">
                  Obras relacionadas
                </h2>
              </div>
              <Link href="/obras" className="text-sm text-muted-text underline-offset-4 transition-colors hover:text-ink hover:underline">
                Ver todas las obras
              </Link>
            </div>
            <div className="grid items-start gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
              {related.map((w, i) => (
                <ArtworkCard key={w.slug} work={w} index={i} sizes="(min-width: 768px) 30vw, 92vw" />
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto mt-28 max-w-[1600px] px-5 sm:px-8 lg:px-14">
          <ArtworkPager prev={prev} next={next} />
        </section>
      </article>
    </PageTransition>
  );
}
