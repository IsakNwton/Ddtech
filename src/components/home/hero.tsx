"use client";

import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArtworkImage, artTransitionName } from "@/components/art/artwork-image";
import { Magnetic } from "@/components/motion/magnetic";
import { DemoBadge } from "@/components/ui/badges";
import { buttonClass } from "@/components/ui/button";
import { EASE_GALLERY } from "@/lib/motion";
import type { Artwork } from "@/lib/types";

type HeroWork = Pick<Artwork, "slug" | "title" | "year" | "technique" | "image" | "isDemo">;

/**
 * Portada: la pintura se revela con calma, el nombre emerge de una máscara
 * y un halo de su propio color tiñe el espacio, como la luz de una sala.
 */
export function Hero({ name, tagline, work }: { name: string; tagline: string; work: HeroWork | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const paintY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Profundidad sutil con el cursor
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const auraX = useTransform(sx, (v) => v * -2.2);
  const auraY = useTransform(sy, (v) => v * -2.2);

  const words = name.trim().split(/\s+/);
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : words;
  const ratio = work ? work.image.width / work.image.height : 1.5;

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden [--hero-h:52svh] sm:[--hero-h:58svh] lg:[--hero-h:72svh]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        py.set(((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
    >
      {/* Halo de luz con el color de la obra */}
      {work && (
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ x: auraX, y: auraY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, ease: "easeOut", delay: 0.3 }}
          aria-hidden
        >
          <div className="absolute right-[-10%] top-[5%] h-[90%] w-[85%] opacity-[0.32] blur-[90px] saturate-[1.3] dark:opacity-[0.28] lg:right-[-5%] lg:w-[70%]">
            <Image src={work.image.src} alt="" fill sizes="64px" quality={60} className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper" />
        </motion.div>
      )}
      <div className="paper-grain pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />

      <div className="mx-auto grid min-h-[100svh] max-w-[1600px] grid-rows-[auto_1fr] gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-14 lg:pb-12 lg:pt-28">
        {/* Pintura destacada */}
        {work && (
          <motion.div className="order-1 flex justify-center lg:order-2 lg:col-span-7 lg:col-start-6 lg:justify-end" style={{ y: paintY }}>
            <motion.div style={{ x: sx, y: sy }} className="w-full">
              <Link
                href={`/obras/${work.slug}`}
                className="group relative mx-auto block rounded-[2px] focus-visible:outline-offset-8 lg:mr-0"
                style={{ width: `min(100%, calc(var(--hero-h) * ${ratio}))` }}
                aria-label={`Ver «${work.title}»`}
              >
                <motion.div
                  className="painting-shadow overflow-hidden rounded-[2px]"
                  initial={{ clipPath: "inset(10% 10% 10% 10% round 2px)", opacity: 0 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0% round 2px)", opacity: 1 }}
                  transition={{ duration: 2, ease: EASE_GALLERY, delay: 0.15 }}
                >
                  <motion.div initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.8, ease: EASE_GALLERY, delay: 0.15 }}>
                    <ArtworkImage
                      image={work.image}
                      priority
                      quality={90}
                      sizes="(min-width: 1024px) 58vw, 92vw"
                      transitionName={artTransitionName(work.slug)}
                      imgClassName="transition-transform duration-[2000ms] ease-gallery group-hover:scale-[1.02]"
                    />
                  </motion.div>
                </motion.div>
                {work.isDemo && <DemoBadge className="absolute left-3 top-3" />}
              </Link>
              <motion.p
                className="mx-auto mt-4 flex max-w-full items-baseline justify-center gap-3 text-xs text-muted-text lg:justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.6 }}
              >
                <span className="font-display text-base italic text-ink-soft">{work.title}</span>
                <span>
                  {work.year} · {work.technique}
                </span>
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Firma */}
        <motion.div className="order-2 lg:order-1 lg:col-span-5 lg:pb-10" style={{ y: textY, opacity: fade }}>
          <motion.p
            className="eyebrow flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: EASE_GALLERY, delay: 0.5 }}
          >
            <span className="h-px w-8 bg-gold" aria-hidden />
            Pintura original
          </motion.p>
          <h1 className="mt-6 font-display text-[clamp(3.6rem,13vw,5.5rem)] font-light leading-[0.92] tracking-[-0.035em] lg:text-[clamp(4.5rem,7.4vw,8.25rem)]">
            {lines.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 1 ? "italic text-ink-soft lg:pl-[0.6em]" : ""}`}
                  initial={{ y: "108%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.5, ease: EASE_GALLERY, delay: 0.55 + i * 0.14 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-7 max-w-sm font-display text-[1.6rem] italic leading-snug text-muted-text"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE_GALLERY, delay: 1.05 }}
          >
            {tagline}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_GALLERY, delay: 1.25 }}
          >
            <Magnetic>
              <Link href="/obras" className={buttonClass("primary", "lg")}>
                Explorar obras
                <ArrowRight className="size-4 transition-transform duration-500 ease-gallery group-hover/btn:translate-x-1" strokeWidth={1.5} />
              </Link>
            </Magnetic>
            <Link href="/artista" className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-soft transition-colors hover:text-ink">
              <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-ink">Conocer al artista</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de desplazamiento */}
      <motion.a
        href="#recorrido"
        className="absolute bottom-6 left-5 hidden items-center gap-3 text-[0.6875rem] uppercase tracking-[0.22em] text-muted-text transition-colors hover:text-ink sm:left-8 sm:flex lg:left-14"
        style={{ opacity: fade }}
      >
        <span className="relative block h-12 w-px overflow-hidden bg-line-strong" aria-hidden>
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ink" />
        </span>
        Desplazarse
      </motion.a>
    </section>
  );
}
