import { createJSONStorage, type PersistOptions } from "zustand/middleware";

/**
 * Persistencia en localStorage con hidratación diferida: el primer render del
 * cliente coincide con el HTML del servidor y luego se rehidrata (ver Providers).
 */
export function persistOptions<T>(name: string, partialize?: (s: T) => Partial<T>): PersistOptions<T, Partial<T>> {
  return {
    name: `ddtech-concept:${name}`,
    version: 1,
    storage: createJSONStorage(() => localStorage),
    skipHydration: true,
    partialize: partialize ?? ((s) => s),
  };
}
