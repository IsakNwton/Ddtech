"use client";

import { useMemo } from "react";
import {
  BUILD_STEPS,
  buildTotal,
  estimateWattage,
  evaluateBuild,
  missingRequired,
  overallLevel,
  recommendedPsu,
  type ResolvedBuild,
} from "@/lib/compatibility";
import { estimatePerformance } from "@/lib/performance";
import type { BuildSelection, BuildSlot, BuilderPart } from "@/lib/types";

/** Deriva todo el estado calculado de la build a partir de la selección */
export function useResolvedBuild(selection: BuildSelection, partsById: Map<string, BuilderPart>) {
  return useMemo(() => {
    const build: ResolvedBuild = {};
    for (const s of BUILD_STEPS) {
      const id = selection[s.slot];
      const p = id ? partsById.get(id) : undefined;
      if (p) build[s.slot] = p;
    }
    const issues = evaluateBuild(build);
    const level = overallLevel(issues);
    const missing = missingRequired(build);
    const count = Object.keys(build).length;
    return {
      build,
      issues,
      level,
      missing,
      count,
      total: buildTotal(build),
      watts: estimateWattage(build),
      psu: recommendedPsu(build),
      perf: estimatePerformance(build),
      issuesFor: (slot: BuildSlot) => issues.filter((i) => i.slots.includes(slot)),
    };
  }, [selection, partsById]);
}

export type ResolvedState = ReturnType<typeof useResolvedBuild>;
