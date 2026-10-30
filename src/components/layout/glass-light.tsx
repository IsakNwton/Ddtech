"use client";

import { useEffect } from "react";

/**
 * Brillo especular del cristal: actualiza --lx/--ly/--lo solo en la superficie
 * bajo el cursor (una por vez, limitado a un fotograma) para no gastar GPU.
 */
export function GlassLight() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let current: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      raf = 0;
      if (!last) return;
      const target = (last.target as Element | null)?.closest?.<HTMLElement>(".glass");
      if (current && current !== target) current.style.setProperty("--lo", "0");
      current = target ?? null;
      if (!current) return;
      const r = current.getBoundingClientRect();
      current.style.setProperty("--lx", `${last.clientX - r.left}px`);
      current.style.setProperty("--ly", `${last.clientY - r.top}px`);
      current.style.setProperty("--lo", "1");
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      current?.style.setProperty("--lo", "0");
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
