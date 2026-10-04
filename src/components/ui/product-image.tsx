import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Imagen de producto. Hoy sirve ilustraciones SVG estáticas (sin optimizar);
 * con fotografía real basta con quitar `unoptimized` para usar el optimizador de Next.
 */
export function ProductImage({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw",
  fit = "contain",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fit?: "contain" | "cover";
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={480}
      height={360}
      sizes={sizes}
      priority={priority}
      unoptimized
      draggable={false}
      className={cn("h-full w-full select-none", fit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
