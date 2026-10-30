import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/types";

/** Anterior / siguiente obra con transición direccional */
export function ArtworkPager({ prev, next }: { prev: Artwork | null; next: Artwork | null }) {
  if (!prev || !next) return null;
  return (
    <nav aria-label="Otras obras" className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2">
      <PagerLink work={prev} dir="prev" />
      <PagerLink work={next} dir="next" />
    </nav>
  );
}

function PagerLink({ work, dir }: { work: Artwork; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/obras/${work.slug}`}
      transitionTypes={[isNext ? "nav-forward" : "nav-back"]}
      className={`group flex items-center gap-5 bg-paper p-5 transition-colors duration-500 hover:bg-ivory sm:p-7 ${isNext ? "flex-row-reverse text-right" : ""}`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2px] sm:h-24 sm:w-24" style={{ backgroundColor: work.image.color }}>
        <Image src={work.image.src} alt="" fill sizes="96px" className="object-cover transition-transform duration-[1200ms] ease-gallery group-hover:scale-110" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`eyebrow flex items-center gap-2 ${isNext ? "justify-end" : ""}`}>
          {!isNext && <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.5} />}
          {isNext ? "Siguiente obra" : "Obra anterior"}
          {isNext && <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />}
        </p>
        <p className="mt-2 truncate font-display text-2xl sm:text-[1.75rem]">{work.title}</p>
        <p className="text-xs text-muted-text">{work.year}</p>
      </div>
    </Link>
  );
}
