"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Instancia compartida para pausar el desplazamiento suave cuando hay un modal abierto */
export const lenisControl: { instance: Lenis | null } = { instance: null };

/** Desplazamiento inercial suave con rueda/trackpad. En táctil se usa el nativo. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -100 } });
    lenisControl.instance = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisControl.instance = null;
    };
  }, []);

  // Al cambiar de página, Lenis se sincroniza con el desplazamiento que hace el router
  useEffect(() => {
    lenisControl.instance?.resize();
  }, [pathname]);

  return null;
}

/** Bloquea el desplazamiento (modales, modo contemplación) */
export function lockScroll(locked: boolean) {
  if (locked) {
    lenisControl.instance?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenisControl.instance?.start();
    document.documentElement.style.overflow = "";
  }
}
