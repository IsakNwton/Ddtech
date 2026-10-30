"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { AvailabilityBadge, DemoBadge } from "@/components/ui/badges";
import { cn } from "@/lib/cn";
import { formatDimensions } from "@/lib/format";
import { EASE_GALLERY } from "@/lib/motion";
import type { Artwork } from "@/lib/types";
import { ArtworkImage, artTransitionName } from "./artwork-image";

export type CardArtwork = Pick<Artwork, "slug" | "title" | "year" | "technique" | "dimensions" | "availability" | "image" | "isDemo">;

export function ArtworkCard({
  work,
  index = 0,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw",
  shared = true,
  className,
  priority,
}: {
  work: CardArtwork;
  index?: number;
  sizes?: string;
  /** Usar transición de elemento compartido hacia la página de la obra */
  shared?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <motion.article
      className={cn("group", className)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.05, ease: EASE_GALLERY, delay: (index % 3) * 0.09 }}
    >
      <Link href={`/obras/${work.slug}`} className="block rounded-[3px] focus-visible:outline-offset-8">
        <div className="relative">
          <div className="painting-shadow overflow-hidden rounded-[2px] transition-shadow duration-700">
            <ArtworkImage
              image={work.image}
              sizes={sizes}
              priority={priority}
              transitionName={shared ? artTransitionName(work.slug) : undefined}
              imgClassName="transition-transform duration-[1600ms] ease-gallery group-hover:scale-[1.035]"
            />
          </div>
          {work.isDemo && <DemoBadge className="absolute left-3 top-3" />}
          <span
            className="glass-dark pointer-events-none absolute bottom-3 right-3 inline-flex h-10 translate-y-2 items-center gap-1.5 rounded-full pl-4 pr-3 text-[0.8125rem] opacity-0 transition-all duration-500 ease-gallery group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            aria-hidden
          >
            Ver obra <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-[1.45rem] leading-tight tracking-[-0.01em] text-ink transition-colors">{work.title}</h3>
            <p className="mt-1 text-[0.8125rem] text-muted-text">
              {work.year} · {work.technique} · {formatDimensions(work.dimensions)}
            </p>
          </div>
          <AvailabilityBadge value={work.availability} className="mt-2 shrink-0" />
        </div>
      </Link>
    </motion.article>
  );
}
