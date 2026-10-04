import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BuildSelection, BuildSlot } from "@/lib/types";
import { persistOptions } from "./persist";

export interface SavedBuild {
  id: string;
  name: string;
  selection: BuildSelection;
  total: number;
  savedAt: string;
}

interface BuilderState {
  selection: BuildSelection;
  saved: SavedBuild[];
  select: (slot: BuildSlot, id: string) => void;
  clearSlot: (slot: BuildSlot) => void;
  load: (selection: BuildSelection) => void;
  reset: () => void;
  save: (build: Omit<SavedBuild, "id" | "savedAt">) => void;
  removeSaved: (id: string) => void;
}

export const useBuilder = create<BuilderState>()(
  persist(
    (set) => ({
      selection: {},
      saved: [],
      select: (slot, id) => set((s) => ({ selection: { ...s.selection, [slot]: id } })),
      clearSlot: (slot) =>
        set((s) => {
          const next = { ...s.selection };
          delete next[slot];
          return { selection: next };
        }),
      load: (selection) => set({ selection: { ...selection } }),
      reset: () => set({ selection: {} }),
      save: (build) =>
        set((s) => ({
          saved: [{ ...build, id: `b${Date.now().toString(36)}`, savedAt: new Date().toISOString() }, ...s.saved].slice(0, 12),
        })),
      removeSaved: (id) => set((s) => ({ saved: s.saved.filter((b) => b.id !== id) })),
    }),
    persistOptions<BuilderState>("builder", (s) => ({ selection: s.selection, saved: s.saved })),
  ),
);
