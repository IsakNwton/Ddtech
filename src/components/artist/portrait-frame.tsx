import { User } from "lucide-react";
import Image from "next/image";
import type { ArtImage } from "@/lib/types";

/** Retrato del artista o, mientras no exista, un marco provisional claramente identificado */
export function PortraitFrame({ portrait, name, priority }: { portrait: ArtImage | null; name: string; priority?: boolean }) {
  if (portrait?.src) {
    return (
      <figure className="painting-shadow relative aspect-[4/5] overflow-hidden rounded-[2px]" style={{ backgroundColor: portrait.color }}>
        <Image src={portrait.src} alt={portrait.alt || `Retrato de ${name}`} fill sizes="(min-width: 1024px) 40vw, 92vw" className="object-cover" priority={priority} />
      </figure>
    );
  }
  return (
    <figure className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[2px] border border-line bg-stone/60">
      <div className="paper-grain absolute inset-0" aria-hidden />
      <div className="absolute inset-6 border border-gold/30" aria-hidden />
      <div className="relative text-center">
        <User className="mx-auto size-10 text-muted" strokeWidth={1} aria-hidden />
        <figcaption className="mt-4 px-8 text-sm leading-relaxed text-muted-text">
          Retrato del artista
          <br />
          <span className="text-xs">[Fotografía pendiente]</span>
        </figcaption>
      </div>
    </figure>
  );
}
