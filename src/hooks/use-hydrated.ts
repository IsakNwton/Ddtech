import { useUI } from "@/store/ui";

/** true cuando los stores persistidos ya se rehidrataron en el cliente */
export function useHydrated(): boolean {
  return useUI((s) => s.hydrated);
}
