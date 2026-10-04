import { estimateWattage, evaluateBuild, overallLevel, recommendedPsu, type ResolvedBuild } from "@/lib/compatibility";
import { estimatePerformance, type PerfEstimate } from "@/lib/performance";
import type { BuildPreset, BuildSlot, CompatLevel } from "@/lib/types";
import { getProduct, toBuilderPart } from "./catalog";
import { buildPresets } from "./presets";

export interface PresetSummary {
  preset: BuildPreset;
  total: number;
  watts: number;
  psu: number;
  level: CompatLevel;
  perf: PerfEstimate | null;
  parts: { slot: BuildSlot; name: string; brand: string; image: string }[];
}

export function resolvePreset(preset: BuildPreset): ResolvedBuild {
  const build: ResolvedBuild = {};
  for (const [slot, id] of Object.entries(preset.parts) as [BuildSlot, string][]) {
    const p = getProduct(id);
    if (p) build[slot] = toBuilderPart(p);
  }
  return build;
}

export function summarizePreset(preset: BuildPreset): PresetSummary {
  const build = resolvePreset(preset);
  const issues = evaluateBuild(build);
  return {
    preset,
    total: Object.values(build).reduce((s, p) => s + (p?.price ?? 0), 0),
    watts: estimateWattage(build),
    psu: recommendedPsu(build),
    level: overallLevel(issues),
    perf: estimatePerformance(build),
    parts: (Object.entries(build) as [BuildSlot, NonNullable<ResolvedBuild[BuildSlot]>][]).map(([slot, p]) => ({
      slot,
      name: p.name,
      brand: p.brand,
      image: p.image,
    })),
  };
}

export function getPresetSummaries(): PresetSummary[] {
  return buildPresets.map(summarizePreset);
}
