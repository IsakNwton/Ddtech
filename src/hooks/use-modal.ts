"use client";

import { useEffect, useRef } from "react";
import { lockScroll } from "@/components/layout/smooth-scroll";

/**
 * Comportamiento de diálogo modal accesible:
 * bloquea el desplazamiento, vuelve inerte el resto de la página,
 * cierra con Escape y devuelve el foco al elemento que lo abrió.
 */
export function useModal(onClose: () => void, onKey?: (e: KeyboardEvent) => void) {
  const initialFocus = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  const keyRef = useRef(onKey);
  useEffect(() => {
    closeRef.current = onClose;
    keyRef.current = onKey;
  });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const others = Array.from(document.querySelectorAll<HTMLElement>("body > *:not([data-modal-root])"));
    others.forEach((el) => el.setAttribute("inert", ""));
    const t = window.setTimeout(() => initialFocus.current?.focus(), 60);
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      keyRef.current?.(e);
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", handler);
      others.forEach((el) => el.removeAttribute("inert"));
      lockScroll(false);
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  return initialFocus;
}
