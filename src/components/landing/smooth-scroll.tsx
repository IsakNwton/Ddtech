"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Instancia compartida para pausar el scroll suave cuando hay un panel modal abierto */
export const lenisControl: { instance: Lenis | null } = { instance: null };

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -120 } });
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

  useEffect(() => {
    lenisControl.instance?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
