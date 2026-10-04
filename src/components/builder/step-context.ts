import type { ResolvedBuild } from "@/lib/compatibility";
import type { BoardTech, BuildSlot, CaseTech, CpuTech, GpuTech, PsuTech } from "@/lib/types";

const tech = <T,>(b: ResolvedBuild, slot: BuildSlot) => b[slot]?.tech as T | undefined;

/** Chips de contexto: qué restricciones está aplicando el configurador en cada paso */
export function stepContext(slot: BuildSlot, build: ResolvedBuild, recommendedPsu: number): string[] {
  const cpu = tech<CpuTech>(build, "cpu");
  const mb = tech<BoardTech>(build, "motherboard");
  const gpu = tech<GpuTech>(build, "gpu");
  const psu = tech<PsuTech>(build, "psu");
  const pcCase = tech<CaseTech>(build, "case");
  const out: string[] = [];
  switch (slot) {
    case "cpu":
      if (mb) out.push(`Socket ${mb.socket}`, mb.memory);
      break;
    case "motherboard":
      if (cpu) out.push(`Socket ${cpu.socket}`, cpu.memory.join(" / "));
      if (pcCase) out.push(`Gabinete: ${pcCase.supports.filter((f) => f !== "E-ATX").join(", ")}`);
      break;
    case "ram":
      if (mb) out.push(mb.memory, `${mb.memorySlots} ranuras`);
      else if (cpu) out.push(cpu.memory.join(" / "));
      break;
    case "gpu":
      if (pcCase) out.push(`Largo máx. ${pcCase.maxGpuMm} mm`);
      if (psu) out.push(`Fuente de ${psu.watts} W`);
      if (cpu?.igpu) out.push("Opcional: tu CPU tiene gráficos integrados");
      break;
    case "psu":
      if (recommendedPsu) out.push(`Recomendado ${recommendedPsu} W+`);
      if (gpu) out.push(gpu.power === "12V-2x6" ? "GPU con 12V-2x6" : `GPU con ${gpu.power}`);
      break;
    case "case":
      if (mb) out.push(mb.formFactor);
      if (gpu) out.push(`GPU de ${gpu.lengthMm} mm`);
      break;
    case "cooling":
      if (cpu) out.push(`Socket ${cpu.socket}`, `TDP ${cpu.tdp} W`);
      if (pcCase) out.push(`Altura máx. ${pcCase.maxCoolerMm} mm`);
      if (cpu?.boxCooler) out.push("Opcional: tu CPU incluye disipador");
      break;
  }
  return out;
}
