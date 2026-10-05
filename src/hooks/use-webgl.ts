"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | undefined;

function detect(): boolean {
  if (cached !== undefined) return cached;
  try {
    const c = document.createElement("canvas");
    cached = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
}

const noop = () => () => {};

/**
 * Soporte de WebGL. Devuelve `null` en el servidor y durante la hidratación,
 * para que las escenas 3D solo se monten en el cliente y haya un respaldo
 * estático cuando el navegador no puede crear un contexto.
 */
export function useWebGL(): boolean | null {
  return useSyncExternalStore<boolean | null>(noop, detect, () => null);
}
