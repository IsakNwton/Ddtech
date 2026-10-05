"use client";

import { useEffect } from "react";
import { lenisControl } from "@/components/landing/smooth-scroll";

/** Bloquea el scroll del body mientras un panel modal está abierto */
export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    lenisControl.instance?.stop();
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      lenisControl.instance?.start();
    };
  }, [locked]);
}
