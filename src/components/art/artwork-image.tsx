import Image from "next/image";
import { ViewTransition } from "react";
import { cn } from "@/lib/cn";
import type { ArtImage } from "@/lib/types";

type Props = {
  image: ArtImage;
  sizes: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  imgClassName?: string;
  /** Nombre del elemento compartido para la transición entre páginas */
  transitionName?: string;
  style?: React.CSSProperties;
};

/**
 * Imagen de obra: respeta SIEMPRE la proporción original (sin recortes),
 * muestra el color dominante y una miniatura difuminada mientras carga.
 */
export function ArtworkImage({ image, sizes, priority, quality, className, imgClassName, transitionName, style }: Props) {
  const box = (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: `${image.width} / ${image.height}`, backgroundColor: image.color ?? "var(--ivory)", ...style }}
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className={cn("object-contain", imgClassName)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-xs text-muted-text">Sin imagen</div>
      )}
    </div>
  );

  if (!transitionName) return box;
  return (
    <ViewTransition name={transitionName} share="artwork-morph" default="none">
      {box}
    </ViewTransition>
  );
}

export const artTransitionName = (slug: string) => `art-${slug}`;
