import Link from "next/link";
import { PortraitFrame } from "@/components/artist/portrait-frame";
import { Reveal } from "@/components/motion/reveal";
import type { ArtistProfile } from "@/lib/types";

export function ArtistTeaser({ artist }: { artist: ArtistProfile }) {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 lg:py-36" aria-labelledby="artista-home">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:px-14">
        <Reveal className="lg:col-span-5">
          <PortraitFrame portrait={artist.portrait} name={artist.name} />
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden />
            El artista
          </p>
          <h2 id="artista-home" className="mt-6 font-display text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl">
            {artist.name}
          </h2>
          <blockquote className="mt-10 border-l border-gold/70 pl-6">
            <p className="font-display text-[1.75rem] italic leading-snug text-ink-soft sm:text-3xl">“{artist.quote.text}”</p>
            <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-text">{artist.quote.context}</footer>
          </blockquote>
          <p className="mt-10 max-w-xl text-[1.0625rem] leading-relaxed text-muted-text">{artist.shortBio}</p>
          <Link href="/artista" className="group mt-10 inline-flex items-center gap-2 text-[0.9375rem]">
            <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-ink">Leer la biografía</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
