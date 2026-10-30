"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/cn";
import { EASE_GALLERY } from "@/lib/motion";
import type { ArtImage } from "@/lib/types";

const BACKGROUNDS = [
  { id: "marfil", label: "Marfil", color: "#ece9e2", ink: "#202020" },
  { id: "gris", label: "Gris neutro", color: "#6e6b67", ink: "#f8f7f4" },
  { id: "carbon", label: "Carbón", color: "#121110", ink: "#f1efe9" },
] as const;

/** «Contemplar obra»: solo la pintura sobre un fondo neutro, sin interfaz */
export function ContemplateMode({ image, title, caption, onClose }: { image: ArtImage; title: string; caption: string; onClose: () => void }) {
  const [bg, setBg] = useState<(typeof BACKGROUNDS)[number]>(BACKGROUNDS[2]);
  const [ui, setUi] = useState(true);
  const timer = useRef<number>(0);
  const fullscreenRef = useRef(false);

  const close = useCallback(() => {
    if (fullscreenRef.current && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onClose();
  }, [onClose]);

  const wake = useCallback(() => {
    setUi(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setUi(false), 2600);
  }, []);

  const initialFocus = useModal(close, (e) => {
    wake();
    const n = Number(e.key);
    if (n >= 1 && n <= BACKGROUNDS.length) setBg(BACKGROUNDS[n - 1]);
  });

  useEffect(() => {
    timer.current = window.setTimeout(() => setUi(false), 2600);
    // Pantalla completa cuando el navegador lo permite (no disponible en iPhone)
    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen({ navigationUI: "hide" })
        .then(() => (fullscreenRef.current = true))
        .catch(() => {});
    }
    const onFs = () => {
      if (fullscreenRef.current && !document.fullscreenElement) onClose();
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.clearTimeout(timer.current);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [onClose]);

  const ratio = image.width / image.height;

  return createPortal(
    <motion.div
      data-modal-root
      role="dialog"
      aria-modal="true"
      aria-label={`Contemplar «${title}»`}
      className={cn("fixed inset-0 z-[160] grid place-items-center transition-colors duration-700", !ui && "cursor-none")}
      style={{ backgroundColor: bg.color, color: bg.ink }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.8, ease: EASE_GALLERY }}
      onPointerMove={wake}
      onPointerDown={wake}
    >
      <motion.div
        className="relative"
        style={{
          width: `min(92vw, calc(88svh * ${ratio}))`,
          aspectRatio: `${image.width} / ${image.height}`,
          boxShadow: bg.id === "marfil" ? "var(--painting-shadow)" : "0 30px 80px -30px rgb(0 0 0 / 0.65)",
          backgroundColor: image.color,
        }}
        initial={{ opacity: 0, scale: 0.965 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_GALLERY, delay: 0.15 }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="92vw"
          quality={90}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className="object-contain"
          priority
        />
      </motion.div>

      <AnimatePresence>
        {ui && (
          <motion.div
            className="pointer-events-none fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="pointer-events-auto absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex items-center gap-2 sm:right-6">
              <div className="glass-dark flex items-center gap-1 rounded-full p-1" role="group" aria-label="Color de fondo">
                {BACKGROUNDS.map((b, i) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBg(b)}
                    className={cn("press grid size-10 place-items-center rounded-full", bg.id === b.id && "bg-white/15")}
                    aria-label={`Fondo ${b.label} (tecla ${i + 1})`}
                    aria-pressed={bg.id === b.id}
                  >
                    <span className="size-4 rounded-full ring-1 ring-white/40" style={{ backgroundColor: b.color }} />
                  </button>
                ))}
              </div>
              <button
                ref={initialFocus}
                type="button"
                onClick={close}
                className="press glass-dark flex h-12 items-center gap-2 rounded-full pl-4 pr-5 text-sm"
              >
                <X className="size-4" strokeWidth={1.5} /> Salir
              </button>
            </div>
            <div className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 sm:left-8">
              <p className="font-display text-xl italic">{title}</p>
              <p className="text-xs opacity-60">{caption}</p>
            </div>
            <p className="absolute bottom-[max(1.4rem,env(safe-area-inset-bottom))] right-6 hidden text-[0.6875rem] opacity-50 sm:block">
              Mueva el cursor para ver los controles · Esc para salir
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body,
  );
}
