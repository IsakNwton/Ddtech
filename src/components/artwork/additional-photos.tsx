"use client";

import { Search } from "lucide-react";
import { ArtworkImage } from "@/components/art/artwork-image";
import { Reveal } from "@/components/motion/reveal";
import type { ArtImage } from "@/lib/types";
import { useViewer } from "./viewer-context";

/** Fotografías adicionales: detalles, sala, proceso… (se abren en el visor) */
export function AdditionalPhotos({ images }: { images: ArtImage[] }) {
  const { openZoom } = useViewer();
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {images.map((im, i) => (
        <Reveal key={im.src} delay={i * 0.08} className={i === 2 && images.length === 3 ? "col-span-2 lg:col-span-1" : undefined}>
          <figure>
            <button
              type="button"
              onClick={() => openZoom(i + 1)}
              className="group relative block w-full overflow-hidden rounded-[2px] focus-visible:outline-offset-4"
              aria-label={`Ampliar: ${im.caption ?? im.alt}`}
            >
              <ArtworkImage image={im} sizes="(min-width: 1024px) 30vw, 46vw" imgClassName="transition-transform duration-[1400ms] ease-gallery group-hover:scale-[1.04]" />
              <span className="glass-dark absolute bottom-2.5 right-2.5 grid size-9 place-items-center rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
                <Search className="size-3.5" strokeWidth={1.75} />
              </span>
            </button>
            {im.caption && <figcaption className="mt-3 text-xs text-muted-text">{im.caption}</figcaption>}
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
