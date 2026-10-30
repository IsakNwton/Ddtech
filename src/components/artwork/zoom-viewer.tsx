"use client";

/* eslint-disable @next/next/no-img-element -- el visor usa el archivo original a máxima resolución */
import { ChevronLeft, ChevronRight, Maximize, Minus, Plus, X } from "lucide-react";
import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/cn";
import { EASE_GALLERY } from "@/lib/motion";
import type { ArtImage } from "@/lib/types";

const PAD = 24;
const SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;

/** Visor de alta resolución: rueda, arrastre, pellizco, doble toque y teclado */
export function ZoomViewer({ images, initialIndex, title, onClose }: { images: ArtImage[]; initialIndex: number; title: string; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [zoomPct, setZoomPct] = useState(100);
  const stageRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const image = images[index];

  useMotionValueEvent(scale, "change", (s) => setZoomPct(Math.round(s * 100)));

  // Tamaño «ajustado» de la imagen dentro del escenario
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ratio = image.width / image.height;
  const availW = Math.max(0, box.w - PAD * 2);
  const availH = Math.max(0, box.h - PAD * 2);
  const fitW = availW / availH > ratio ? availH * ratio : availW;
  const fitH = fitW / ratio;
  const maxScale = Math.min(8, Math.max(3, (image.width / Math.max(fitW, 1)) * 1.4));

  const clampPos = useCallback(
    (nx: number, ny: number, s: number) => {
      const mx = Math.max(0, (fitW * s - box.w) / 2 + PAD);
      const my = Math.max(0, (fitH * s - box.h) / 2 + PAD);
      return [Math.min(mx, Math.max(-mx, nx)), Math.min(my, Math.max(-my, ny))] as const;
    },
    [fitW, fitH, box.w, box.h],
  );

  /** Acerca/aleja manteniendo fijo el punto (px, py) relativo al centro */
  const zoomTo = useCallback(
    (target: number, px = 0, py = 0, smooth = true) => {
      const s0 = scale.get();
      const s1 = Math.min(maxScale, Math.max(1, target));
      const [nx, ny] = clampPos(px - (px - x.get()) * (s1 / s0), py - (py - y.get()) * (s1 / s0), s1);
      if (smooth) {
        animate(scale, s1, SPRING);
        animate(x, nx, SPRING);
        animate(y, ny, SPRING);
      } else {
        scale.set(s1);
        x.set(nx);
        y.set(ny);
      }
    },
    [scale, x, y, maxScale, clampPos],
  );

  const reset = useCallback(() => {
    animate(scale, 1, SPRING);
    animate(x, 0, SPRING);
    animate(y, 0, SPRING);
  }, [scale, x, y]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (images.length < 2) return;
      scale.set(1);
      x.set(0);
      y.set(0);
      setIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length, scale, x, y],
  );

  const initialFocus = useModal(onClose, (e) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "+" || e.key === "=") zoomTo(scale.get() * 1.5);
    else if (e.key === "-") zoomTo(scale.get() / 1.5);
    else if (e.key === "0") reset();
  });

  // Rueda / trackpad (listener no pasivo para evitar el desplazamiento de la página)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left - r.width / 2;
      const py = e.clientY - r.top - r.height / 2;
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0022));
      zoomTo(scale.get() * factor, px, py, false);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomTo, scale]);

  // Gestos: arrastre, pellizco, doble toque y deslizamiento entre imágenes
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; scale: number; startX: number; startY: number; moved: boolean; lastTap: number }>({
    dist: 0,
    scale: 1,
    startX: 0,
    startY: 0,
    moved: false,
    lastTap: 0,
  });

  const rel = (cx: number, cy: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    return [cx - r.left - r.width / 2, cy - r.top - r.height / 2] as const;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 1) {
      g.startX = e.clientX;
      g.startY = e.clientY;
      g.moved = false;
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.dist = Math.hypot(a.x - b.x, a.y - b.y);
      g.scale = scale.get();
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > 6) g.moved = true;

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const [mx, my] = rel((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomTo((g.scale * d) / g.dist, mx, my, false);
    } else if (scale.get() > 1.001) {
      const [nx, ny] = clampPos(x.get() + e.clientX - prev.x, y.get() + e.clientY - prev.y, scale.get());
      x.set(nx);
      y.set(ny);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size > 0) return;
    const dx = e.clientX - g.startX;
    // Deslizar para cambiar de imagen (sin zoom)
    if (scale.get() <= 1.001 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(e.clientY - g.startY)) {
      go(dx < 0 ? 1 : -1);
      return;
    }
    // Doble toque / doble clic
    if (!g.moved) {
      const now = performance.now();
      if (now - g.lastTap < 300) {
        const [px, py] = rel(e.clientX, e.clientY);
        if (scale.get() > 1.05) reset();
        else zoomTo(2.5, px, py);
        g.lastTap = 0;
      } else g.lastTap = now;
    }
  };

  const zoomed = zoomPct > 101;

  return createPortal(
    <motion.div
      data-modal-root
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada de «${title}»`}
      className="fixed inset-0 z-[150] flex flex-col bg-[#121110] text-[#f1efe9]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE_GALLERY }}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <div className="min-w-0">
          <p className="truncate font-display text-xl">{title}</p>
          <p className="truncate text-xs text-white/55">
            {image.caption ?? "Obra completa"}
            {images.length > 1 && ` · ${index + 1} de ${images.length}`}
          </p>
        </div>
        <button
          ref={initialFocus}
          type="button"
          onClick={onClose}
          className="press glass-dark grid size-12 shrink-0 place-items-center rounded-full"
          aria-label="Cerrar vista ampliada"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Escenario */}
      <div
        ref={stageRef}
        className={cn("relative flex-1 touch-none select-none overflow-hidden", zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {fitW > 0 && (
          <motion.div
            key={image.src}
            className="absolute left-1/2 top-1/2"
            style={{ width: fitW, height: fitH, marginLeft: -fitW / 2, marginTop: -fitH / 2, x, y, scale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: image.color }} />
            {image.blurDataURL && <img src={image.blurDataURL} alt="" aria-hidden className="absolute inset-0 size-full object-contain blur-xl" draggable={false} />}
            <img
              src={image.src}
              alt={image.alt}
              draggable={false}
              decoding="async"
              onLoad={() => setLoaded((l) => ({ ...l, [image.src]: true }))}
              className={cn("absolute inset-0 size-full object-contain transition-opacity duration-700", loaded[image.src] ? "opacity-100" : "opacity-0")}
            />
          </motion.div>
        )}
        {!loaded[image.src] && (
          <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60" role="status">
            Cargando alta resolución…
          </p>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              onPointerDown={(e) => e.stopPropagation()}
              className="press glass-dark absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full sm:grid"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              onPointerDown={(e) => e.stopPropagation()}
              className="press glass-dark absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full sm:grid"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="glass-dark flex items-center gap-1 rounded-full p-1">
          <button type="button" onClick={() => zoomTo(scale.get() / 1.5)} className="press grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Alejar">
            <Minus className="size-4" strokeWidth={1.5} />
          </button>
          <span className="w-14 text-center text-xs tabular-nums text-white/75" aria-live="polite" aria-label={`Ampliación ${zoomPct} %`}>
            {zoomPct}%
          </span>
          <button type="button" onClick={() => zoomTo(scale.get() * 1.5)} className="press grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Acercar">
            <Plus className="size-4" strokeWidth={1.5} />
          </button>
          <span className="mx-1 h-5 w-px bg-white/15" aria-hidden />
          <button type="button" onClick={reset} className="press flex h-11 items-center gap-2 rounded-full px-4 text-xs hover:bg-white/10" aria-label="Ajustar a la pantalla">
            <Maximize className="size-3.5" strokeWidth={1.5} /> Ajustar
          </button>
        </div>
        {images.length > 1 && (
          <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
            {images.map((im, i) => (
              <button
                key={im.src}
                type="button"
                onClick={() => {
                  scale.set(1);
                  x.set(0);
                  y.set(0);
                  setIndex(i);
                }}
                className={cn(
                  "press relative h-14 shrink-0 overflow-hidden rounded-md ring-1 transition-all",
                  i === index ? "opacity-100 ring-white/80" : "opacity-50 ring-white/10 hover:opacity-80",
                )}
                style={{ aspectRatio: `${im.width} / ${im.height}`, backgroundColor: im.color }}
                aria-label={`Ver ${im.caption ?? "imagen"} (${i + 1} de ${images.length})`}
                aria-current={i === index}
              >
                <Image src={im.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <p className="hidden text-[0.6875rem] text-white/45 sm:block">Rueda o pellizco para acercar · arrastre para recorrer · doble clic para ampliar · Esc para salir</p>
      </div>
    </motion.div>,
    document.body,
  );
}
