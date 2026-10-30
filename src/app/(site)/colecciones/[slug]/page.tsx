import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArtworkCard } from "@/components/art/artwork-card";
import { PageTransition } from "@/components/motion/page-transition";
import { MaskLine, Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/cn";
import { getCollection, getCollections } from "@/lib/data";
import { paragraphs } from "@/lib/format";
import { breadcrumbLd, collectionLd } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const cols = await getCollections();
  return cols.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/colecciones/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) return { title: "Colección no encontrada" };
  const description = paragraphs(c.description)[0]?.slice(0, 280);
  return {
    title: `Colección ${c.title}`,
    description,
    alternates: { canonical: `/colecciones/${c.slug}` },
    openGraph: { title: `Colección ${c.title}`, description, images: c.cover ? [{ url: c.cover.src, alt: c.cover.alt }] : undefined },
  };
}

export default async function ColeccionPage({ params }: PageProps<"/colecciones/[slug]">) {
  const { slug } = await params;
  const [c, all] = await Promise.all([getCollection(slug), getCollections()]);
  if (!c) notFound();

  return (
    <PageTransition>
      <div>
        <JsonLd
          data={[
            collectionLd(c),
            breadcrumbLd([
              { name: "Inicio", path: "/" },
              { name: "Colecciones", path: "/colecciones" },
              { name: c.title, path: `/colecciones/${c.slug}` },
            ]),
          ]}
        />
        <header className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-14">
            <div className="lg:col-span-6">
              <Link href="/colecciones" transitionTypes={["nav-back"]} className="group inline-flex items-center gap-1.5 text-xs text-muted-text transition-colors hover:text-ink">
                <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-0.5" strokeWidth={1.5} />
                Colecciones
              </Link>
              <p className="eyebrow mt-10">
                Colección · {c.period} · {c.works.length} {c.works.length === 1 ? "obra" : "obras"}
              </p>
              <h1 className="mt-5 font-display text-[3.4rem] leading-[0.95] tracking-[-0.025em] sm:text-7xl lg:text-[6rem]">
                <MaskLine>{c.title}</MaskLine>
              </h1>
              {c.subtitle && (
                <Reveal delay={0.2}>
                  <p className="mt-4 font-display text-2xl italic text-muted-text">{c.subtitle}</p>
                </Reveal>
              )}
            </div>
            {c.cover && (
              <div className="lg:col-span-5 lg:col-start-8">
                <ViewTransition name={`coleccion-${c.slug}`} share="artwork-morph" default="none">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]" style={{ backgroundColor: c.cover.color }}>
                    <Image src={c.cover.src} alt="" fill sizes="96px" quality={60} className="scale-125 object-cover opacity-70 blur-2xl" aria-hidden />
                    <div className="absolute inset-[9%]">
                      <Image
                        src={c.cover.src}
                        alt={c.cover.alt}
                        fill
                        priority
                        sizes="(min-width: 1024px) 40vw, 92vw"
                        placeholder={c.cover.blurDataURL ? "blur" : "empty"}
                        blurDataURL={c.cover.blurDataURL}
                        className="object-contain drop-shadow-[0_20px_30px_rgb(0_0_0/0.25)]"
                      />
                    </div>
                  </div>
                </ViewTransition>
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-14">
          <Reveal className="mt-16 grid gap-8 border-t border-line pt-12 lg:grid-cols-12">
            <div className="prose-gallery lg:col-span-6 lg:col-start-7">
              {paragraphs(c.description).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          {/* Otras colecciones */}
          {all.length > 1 && (
            <nav aria-label="Colecciones" className="no-scrollbar mt-16 flex gap-2 overflow-x-auto">
              {all.map((o) => (
                <Link
                  key={o.slug}
                  href={`/colecciones/${o.slug}`}
                  aria-current={o.slug === c.slug ? "page" : undefined}
                  className={cn(
                    "press shrink-0 rounded-full border px-5 py-2.5 text-sm transition-colors",
                    o.slug === c.slug ? "border-ink bg-ink text-paper" : "border-line-strong text-ink-soft hover:border-ink/40 hover:text-ink",
                  )}
                >
                  {o.title}
                </Link>
              ))}
            </nav>
          )}

          <section className="mt-14" aria-label={`Obras de la colección ${c.title}`}>
            {c.works.length > 0 ? (
              <div className="masonry columns-1 md:columns-2 xl:columns-3">
                {c.works.map((w, i) => (
                  <ArtworkCard key={w.slug} work={w} index={i} className="mb-16 md:mb-20" />
                ))}
              </div>
            ) : (
              <p className="py-20 text-center text-muted-text">Esta colección todavía no tiene obras publicadas.</p>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
