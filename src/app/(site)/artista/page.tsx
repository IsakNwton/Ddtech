import type { Metadata } from "next";
import { PortraitFrame } from "@/components/artist/portrait-frame";
import { Timeline } from "@/components/artist/timeline";
import { PageTransition } from "@/components/motion/page-transition";
import { MaskLine, Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { getArtist } from "@/lib/data";
import { paragraphs } from "@/lib/format";
import { personLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const artist = await getArtist();
  return {
    title: "El artista",
    description: `Biografía, trayectoria, filosofía creativa y exposiciones de ${artist.name}.`,
    alternates: { canonical: "/artista" },
  };
}

function Section({ label, title, children, className }: { label: string; title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`mx-auto grid max-w-[1600px] gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:px-14 ${className ?? ""}`}>
      <Reveal className="lg:col-span-3">
        <p className="eyebrow flex items-center gap-3 lg:sticky lg:top-28">
          <span className="h-px w-8 bg-gold" aria-hidden />
          {label}
        </p>
      </Reveal>
      <div className="lg:col-span-8 lg:col-start-5">
        {title && (
          <Reveal>
            <h2 className="mb-10 font-display text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl">{title}</h2>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

export default async function ArtistaPage() {
  const artist = await getArtist();

  return (
    <PageTransition>
      <div>
        <JsonLd data={{ "@context": "https://schema.org", ...personLd(artist), description: artist.shortBio }} />

        {/* Presentación */}
        <header className="mx-auto grid max-w-[1600px] gap-12 px-5 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-12 lg:items-end lg:px-14">
          <div className="lg:col-span-6 lg:pb-8">
            <Reveal y={10}>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-gold" aria-hidden />
                El artista
              </p>
            </Reveal>
            <h1 className="mt-6 font-display text-[3.4rem] font-light leading-[0.94] tracking-[-0.03em] sm:text-7xl lg:text-[6.25rem]">
              <MaskLine>{artist.name}</MaskLine>
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-6 font-display text-2xl italic text-muted-text">{artist.fullName}</p>
              <p className="mt-10 max-w-lg text-[1.125rem] leading-relaxed text-ink-soft">{artist.shortBio}</p>
              {artist.isPlaceholder && (
                <Notice title="Contenido provisional" className="mt-10 max-w-lg">
                  Todos los textos entre corchetes son marcadores. No se ha inventado ningún dato biográfico, exposición ni premio: se completarán con la
                  información real del artista.
                </Notice>
              )}
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <PortraitFrame portrait={artist.portrait} name={artist.name} priority />
          </Reveal>
        </header>

        <div className="mt-28 space-y-28 lg:mt-40 lg:space-y-40">
          <Section label="Trayectoria" title="Una vida dedicada a la pintura">
            <Reveal className="prose-gallery max-w-2xl text-[1.125rem]">
              {paragraphs(artist.biography).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </Section>

          {/* Cita */}
          <section className="bg-ivory py-24 lg:py-36">
            <Reveal className="mx-auto max-w-5xl px-5 text-center sm:px-8">
              <span className="font-display text-8xl leading-none text-gold/60" aria-hidden>
                “
              </span>
              <blockquote>
                <p className="-mt-6 font-display text-[2.1rem] font-light italic leading-[1.2] tracking-[-0.015em] text-pretty sm:text-5xl lg:text-6xl">
                  {artist.quote.text}
                </p>
                <footer className="mt-10 text-xs uppercase tracking-[0.22em] text-muted-text">
                  {artist.name} · {artist.quote.context}
                </footer>
              </blockquote>
            </Reveal>
          </section>

          <Section label="Filosofía" title="Filosofía creativa">
            <Reveal>
              <div className="prose-gallery max-w-2xl text-[1.125rem]">
                {paragraphs(artist.philosophy).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
            <div className="mt-16 grid gap-12 sm:grid-cols-2">
              <Reveal>
                <h3 className="eyebrow mb-5">Técnicas favoritas</h3>
                <ul className="divide-y divide-line border-y border-line">
                  {artist.techniques.map((t) => (
                    <li key={t} className="py-4 font-display text-xl">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <h3 className="eyebrow mb-5">Influencias</h3>
                <ul className="divide-y divide-line border-y border-line">
                  {artist.influences.map((t) => (
                    <li key={t} className="py-4 font-display text-xl">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Section>

          {artist.timeline.length > 0 && (
            <Section label="Cronología" title="Línea del tiempo">
              <Timeline entries={artist.timeline} />
            </Section>
          )}

          {artist.exhibitions.length > 0 && (
            <Section label="Exposiciones" title="Exposiciones">
              <Reveal>
                <ul className="border-t border-line">
                  {artist.exhibitions.map((e, i) => (
                    <li key={i} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline sm:gap-6">
                      <span className="font-display text-xl italic text-gold-ink">{e.year}</span>
                      <span>
                        <span className="font-display text-2xl">{e.title}</span>
                        <span className="block text-sm text-muted-text">
                          {e.venue}, {e.city}
                        </span>
                      </span>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-text">{e.kind}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Section>
          )}

          {artist.awards.length > 0 && (
            <Section label="Reconocimientos" title="Reconocimientos">
              <Reveal>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {artist.awards.map((a, i) => (
                    <li key={i} className="glass rounded-3xl p-7">
                      <p className="font-display text-lg italic text-gold-ink">{a.year}</p>
                      <p className="mt-3 font-display text-2xl leading-tight">{a.title}</p>
                      <p className="mt-2 text-sm text-muted-text">{a.organization}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Section>
          )}

          <section className="mx-auto max-w-[1600px] px-5 text-center sm:px-8 lg:px-14">
            <Reveal>
              <p className="font-display text-4xl tracking-[-0.02em] sm:text-5xl">
                Recorrer su <span className="italic">obra</span>
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/obras" size="lg">
                  Ver las obras
                </ButtonLink>
                <ButtonLink href="/colecciones" variant="glass" size="lg">
                  Colecciones
                </ButtonLink>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
