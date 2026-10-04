import type { CpuTech, GpuTech, RamTech } from "./types";
import type { ResolvedBuild } from "./compatibility";

/**
 * Estimador de rendimiento ORIENTATIVO.
 * Combina índices relativos (demo) de CPU y GPU. No representa FPS reales.
 */

export type PerfLabel = "Excelente" | "Muy bueno" | "Bueno" | "Básico" | "Limitado";

export interface PerfEstimate {
  resolutions: { id: "1080p" | "1440p" | "4K"; label: PerfLabel; score: number }[];
  usage: { id: "Gaming" | "Streaming" | "Productividad"; stars: number }[];
  integratedOnly: boolean;
}

const thresholds: Record<"1080p" | "1440p" | "4K", [number, number, number, number]> = {
  "1080p": [30, 22, 15, 9],
  "1440p": [46, 34, 24, 15],
  "4K": [68, 50, 36, 24],
};

function labelFor(res: keyof typeof thresholds, eff: number): PerfLabel {
  const [ex, mb, b, ba] = thresholds[res];
  if (eff >= ex) return "Excelente";
  if (eff >= mb) return "Muy bueno";
  if (eff >= b) return "Bueno";
  if (eff >= ba) return "Básico";
  return "Limitado";
}

const clampStars = (v: number) => Math.max(1, Math.min(5, Math.round(v * 2) / 2));

export function estimatePerformance(build: ResolvedBuild): PerfEstimate | null {
  const cpu = build.cpu?.tech.kind === "cpu" ? (build.cpu.tech as CpuTech) : undefined;
  const gpu = build.gpu?.tech.kind === "gpu" ? (build.gpu.tech as GpuTech) : undefined;
  const ram = build.ram?.tech.kind === "ram" ? (build.ram.tech as RamTech) : undefined;
  if (!cpu && !gpu) return null;

  const cpuG = cpu?.gaming ?? 60;
  const gpuP = gpu?.perf ?? (cpu?.igpu ? 4 : 0);

  const eff = {
    "1080p": gpuP * (0.6 + 0.4 * (cpuG / 100)),
    "1440p": gpuP * (0.8 + 0.2 * (cpuG / 100)),
    "4K": gpuP * (0.95 + 0.05 * (cpuG / 100)),
  } as const;

  const resolutions = (["1080p", "1440p", "4K"] as const).map((id) => ({
    id,
    score: Math.round(Math.min(100, (eff[id] / thresholds[id][0]) * 80)),
    label: labelFor(id, eff[id]),
  }));

  const gaming = clampStars(1 + (eff["1440p"] / thresholds["1440p"][0]) * 4);
  const threads = cpu?.threads ?? 8;
  const encoderBonus = gpu?.chipBrand === "NVIDIA" ? 0.6 : gpu ? 0.3 : 0;
  const streaming = clampStars(1 + (threads / 16) * 2 + (gpuP / 60) * 1.4 + encoderBonus);
  const ramBonus = ram ? Math.min(1, ram.capacityGb / 64) : 0.3;
  const productivity = clampStars(1 + ((cpu?.productivity ?? 40) / 100) * 3 + ramBonus);

  return {
    resolutions,
    usage: [
      { id: "Gaming", stars: gaming },
      { id: "Streaming", stars: streaming },
      { id: "Productividad", stars: productivity },
    ],
    integratedOnly: !gpu,
  };
}
