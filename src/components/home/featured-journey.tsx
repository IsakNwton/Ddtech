"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArtworkImage, artTransitionName } from "@/components/art/artwork-image";
import { DemoBadge } from "@/components/ui/badges";
import type { Artwork } from "@/lib/types";

type JourneyWork = Pick<Artwork, "slug" | "title" | "year" | "technique" | "image" | "isDemo">;

/** Alturas y desplazamientos alternos: ritmo de sala, no de catálogo */
const RHYTHM = [
  { h: "62vh", offset: "0vh" },
  { h: "46vh", offset: "14vh" },
  { h: "56vh", offset: "-4vh" },
  { h: "50vh", offset: "10vh" },
  { h: "60vh", offset: "2vh" },
];

/**
 * Recorrido de obras destacadas.
 * En escritorio, GSAP ScrollTrigger fija la sección y desplaza la sala
 * horizontalmente al ritmo del scroll. En móvil y con movimiento reducido,
 * las obras se presentan en una columna editorial sin animación de scroll.
 */
export function FeaturedJourney({ works }: { works: JourneyWork[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let revert: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (st) => barRef.current && (barRef.current.style.transform = `scaleX(${st.progress})`),
          },
        });
        gsap.utils.toArray<HTMLElement>(".journey-item").forEach((el) => {
          const img = el.querySelector("img");
          if (img)
            gsap.fromTo(
              img,
              { scale: 1.1 },
              { scale: 1, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left right", end: "center center", scrub: true } },
            );
          const cap = el.querySelector(".journey-caption");
          if (cap)
            gsap.fromTo(
              cap,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 85%", end: "left 55%", scrub: true } },
            );
        });
      });
      revert = () => mm.revert();
    })();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  if (!works.length) return null;

  return (
    <div id="recorrido">
      <section ref={sectionRef} className="relative overflow-hidden py-24 lg:flex lg:h-[100svh] lg:items-center lg:py-0" aria-labelledby="destacadas">
        <div ref={trackRef} className="flex flex-col gap-20 px-5 sm:px-8 lg:w-max lg:flex-row lg:items-center lg:gap-[7vw] lg:px-14 motion-reduce:lg:w-auto motion-reduce:lg:overflow-x-auto">
          {/* Introducción */}
          <div className="max-w-md shrink-0 lg:w-[30vw] lg:max-w-none">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" aria-hidden />
              Recorrido
            </p>
            <h2 id="destacadas" className="mt-6 font-display text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl xl:text-7xl">
              Obras <span className="italic text-ink-soft">destacadas</span>
            </h2>
            <p className="mt-6 max-w-sm text-[1.0625rem] leading-relaxed text-muted-text">
              Una selección para comenzar la visita. Cada obra conserva su formato original: horizontes amplios, retratos verticales, silencios cuadrados.
            </p>
            <p className="mt-10 hidden items-center gap-3 text-xs text-muted-text lg:flex" aria-hidden>
              Siga desplazándose <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </p>
          </div>

          {works.map((w, i) => {
            const r = RHYTHM[i % RHYTHM.length];
            const ratio = w.image.width / w.image.height;
            return (
              <article
                key={w.slug}
                className="journey-item shrink-0 lg:translate-y-[var(--offset)]"
                style={{ "--offset": r.offset, "--h": r.h, "--ratio": ratio } as React.CSSProperties}
              >
                <Link href={`/obras/${w.slug}`} className="group block rounded-[2px] focus-visible:outline-offset-8">
                  <div className="relative w-full lg:w-[calc(var(--h)*var(--ratio))]">
                    <div className="painting-shadow overflow-hidden rounded-[2px]">
                      <ArtworkImage image={w.image} sizes="(min-width: 1024px) 60vw, 92vw" transitionName={artTransitionName(w.slug)} />
                    </div>
                    {w.isDemo && <DemoBadge className="absolute left-3 top-3" />}
                  </div>
                  <div className="journey-caption mt-5 flex items-baseline justify-between gap-6">
                    <div>
                      <span className="mr-3 text-xs tabular-nums text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="inline font-display text-2xl transition-colors group-hover:text-ink-soft">{w.title}</h3>
                    </div>
                    <p className="shrink-0 text-xs text-muted-text">
                      {w.year} · {w.technique}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}

          {/* Final */}
          <div className="shrink-0 lg:w-[28vw] lg:pr-[6vw]">
            <p className="font-display text-4xl leading-tight tracking-[-0.02em] sm:text-5xl">
              La colección <span className="italic">completa</span>
            </p>
            <Link href="/obras" className="group mt-8 inline-flex items-center gap-3 text-[0.9375rem]">
              <span className="grid size-14 place-items-center rounded-full border border-line-strong transition-all duration-500 ease-gallery group-hover:scale-105 group-hover:bg-ink group-hover:text-paper">
                <ArrowRight className="size-5" strokeWidth={1.5} />
              </span>
              <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-ink">Ver todas las obras</span>
            </Link>
          </div>
        </div>

        {/* Progreso */}
        <div className="absolute inset-x-14 bottom-10 hidden h-px bg-line lg:block motion-reduce:hidden" aria-hidden>
          <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-ink" />
        </div>
      </section>
    </div>
  );
}
