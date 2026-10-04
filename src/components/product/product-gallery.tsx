"use client";

import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { ProductImage } from "@/components/ui/product-image";

export interface GalleryImage {
  src: string;
  label: string;
}

/**
 * Galería: imagen principal grande con zoom que sigue al cursor (desktop),
 * carrusel deslizable con indicadores (móvil), miniaturas y vista ampliada.
 */
export function ProductGallery({ images, name, badges }: { images: GalleryImage[]; name: string; badges?: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const go = (i: number) => {
    const next = (i + images.length) % images.length;
    setIndex(next);
    const el = trackRef.current;
    if (el && el.clientWidth) el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (lightbox && !d.open) d.showModal();
    if (!lightbox && d.open) d.close();
  }, [lightbox]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="lg:sticky lg:top-[96px]">
      {/* Escritorio: escenario con zoom */}
      <div
        className="stage group relative hidden aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl border border-line md:block"
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
        onClick={() => setLightbox(true)}
      >
        <div
          className="absolute inset-0 p-10 transition-transform duration-200 ease-out will-change-transform"
          style={zoom ? { transform: "scale(2.1)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        >
          <ProductImage key={images[index].src} src={images[index].src} alt={`${name} — ${images[index].label}`} priority sizes="(min-width: 1024px) 55vw, 100vw" className="animate-fade-in" />
        </div>
        {badges && <div className="pointer-events-none absolute left-4 top-4">{badges}</div>}
        <div className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-bg/70 px-2.5 py-1 text-2xs font-medium text-fg-muted opacity-100 ring-1 ring-white/5 backdrop-blur transition-opacity group-hover:opacity-0">
          <ZoomIn className="size-3.5" aria-hidden /> Pasa el cursor para ampliar
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightbox(true);
          }}
          aria-label="Ver imagen ampliada"
          className="absolute bottom-4 right-4 grid size-9 place-items-center rounded-md bg-bg/70 text-fg-muted ring-1 ring-white/5 backdrop-blur transition-colors hover:text-fg"
        >
          <Expand className="size-4" />
        </button>
      </div>

      {/* Móvil: carrusel deslizable */}
      <div className="relative md:hidden">
        <div
          ref={trackRef}
          className="stage flex snap-x snap-mandatory overflow-x-auto rounded-xl border border-line scrollbar-none"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== index) setIndex(i);
          }}
          aria-label={`Imágenes de ${name}`}
        >
          {images.map((img, i) => (
            <button key={img.src} type="button" onClick={() => setLightbox(true)} className="aspect-[4/3] w-full shrink-0 snap-center p-6" aria-label={`Ampliar: ${img.label}`}>
              <ProductImage src={img.src} alt={`${name} — ${img.label}`} priority={i === 0} sizes="100vw" />
            </button>
          ))}
        </div>
        {badges && <div className="pointer-events-none absolute left-3 top-3">{badges}</div>}
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {images.map((img, i) => (
            <span key={img.src} className={cn("h-1.5 rounded-full transition-all duration-200", i === index ? "w-5 bg-fg" : "w-1.5 bg-surface-4")} />
          ))}
        </div>
      </div>

      {/* Miniaturas */}
      <div role="radiogroup" aria-label="Seleccionar imagen" className="mt-3 hidden grid-cols-4 gap-3 md:grid">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="radio"
            aria-checked={i === index}
            aria-label={img.label}
            onClick={() => go(i)}
            onMouseEnter={() => setIndex(i)}
            className={cn(
              "stage aspect-[4/3] overflow-hidden rounded-lg border p-2 transition-[border-color,box-shadow] duration-150",
              i === index ? "border-brand shadow-[0_0_0_3px_rgb(47_95_240/0.2)]" : "border-line hover:border-line-strong",
            )}
          >
            <ProductImage src={img.src} alt="" sizes="140px" />
          </button>
        ))}
      </div>

      {/* Vista ampliada */}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          setLightbox(false);
        }}
        aria-label={`Galería de ${name}`}
        className="m-auto h-dvh max-h-none w-full max-w-none bg-bg/96 p-0 text-fg backdrop:bg-black/80"
      >
        {lightbox && (
          <div className="flex h-full animate-fade-in flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="truncate text-sm text-fg-muted">
                {images[index].label} · {index + 1}/{images.length}
              </p>
              <button type="button" onClick={() => setLightbox(false)} aria-label="Cerrar galería" className="grid size-10 place-items-center rounded-md text-fg-muted hover:bg-surface-3 hover:text-fg">
                <X className="size-5" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
              <div className="aspect-[4/3] max-h-full w-full max-w-5xl">
                <ProductImage key={images[index].src} src={images[index].src} alt={`${name} — ${images[index].label}`} sizes="100vw" className="animate-fade-in" />
              </div>
              <button type="button" onClick={() => go(index - 1)} aria-label="Imagen anterior" className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-surface-2 text-fg hover:bg-surface-3">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Imagen siguiente" className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-surface-2 text-fg hover:bg-surface-3">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
