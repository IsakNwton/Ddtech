import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";
import type { CollectionWithWorks } from "@/lib/types";

/** Colecciones: portadas grandes en composición asimétrica */
export function CollectionsPreview({ collections }: { collections: CollectionWithWorks[] }) {
  if (!collections.length) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-14 lg:py-36" aria-labelledby="colecciones-home">
      <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden />
            Colecciones
          </p>
          <h2 id="colecciones-home" className="mt-6 font-display text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl xl:text-7xl">
            Series que <span className="italic text-ink-soft">dialogan</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <p className="text-[1.0625rem] leading-relaxed text-muted-text">
            Las obras se agrupan por afinidad: un tema, una luz, un período. Cada colección es una sala propia.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
        {collections.map((c, i) => {
          const layout = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-6 md:col-start-4"][i % 3];
          return (
            <Reveal key={c.slug} delay={(i % 2) * 0.1} className={cn(layout)}>
              <CollectionCover collection={c} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function CollectionCover({ collection: c, sizes = "(min-width: 768px) 55vw, 92vw" }: { collection: CollectionWithWorks; sizes?: string }) {
  return (
    <Link href={`/colecciones/${c.slug}`} className="group block focus-visible:outline-offset-8">
      <ViewTransition name={`coleccion-${c.slug}`} share="artwork-morph" default="none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-ivory" style={{ backgroundColor: c.cover?.color }}>
          {c.cover && (
            <>
              {/* Fondo: la obra difuminada llena el marco; encima, la obra completa sin recortes */}
              <Image src={c.cover.src} alt="" fill sizes="96px" quality={60} className="scale-125 object-cover opacity-70 blur-2xl" aria-hidden />
              <div className="absolute inset-[9%] transition-transform duration-[1600ms] ease-gallery group-hover:scale-[1.03]">
                <Image
                  src={c.cover.src}
                  alt={c.cover.alt}
                  fill
                  sizes={sizes}
                  placeholder={c.cover.blurDataURL ? "blur" : "empty"}
                  blurDataURL={c.cover.blurDataURL}
                  className="object-contain drop-shadow-[0_20px_30px_rgb(0_0_0/0.25)]"
                />
              </div>
            </>
          )}
          <span className="glass absolute bottom-4 right-4 grid size-12 place-items-center rounded-full text-ink opacity-0 transition-all duration-500 ease-gallery group-hover:opacity-100 sm:opacity-100">
            <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
          </span>
        </div>
      </ViewTransition>
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-3xl tracking-[-0.015em] sm:text-4xl">{c.title}</h3>
          {c.subtitle && <p className="mt-1 font-display text-lg italic text-muted-text">{c.subtitle}</p>}
        </div>
        <div className="shrink-0 pt-2 text-right text-xs leading-relaxed text-muted-text">
          <p>{c.period}</p>
          <p>
            {c.works.length} {c.works.length === 1 ? "obra" : "obras"}
          </p>
        </div>
      </div>
    </Link>
  );
}
