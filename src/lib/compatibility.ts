import type {
  BoardTech,
  BuildSlot,
  BuilderPart,
  CaseTech,
  CompatIssue,
  CompatLevel,
  CoolerTech,
  CpuTech,
  GpuTech,
  PsuTech,
  RamTech,
} from "./types";

/**
 * Motor de compatibilidad simulado para "Arma tu PC".
 * Reglas deterministas, legibles y fáciles de extender. Los datos son demostrativos:
 * en producción se alimentaría de la ficha técnica real de cada producto.
 */

export type ResolvedBuild = Partial<Record<BuildSlot, BuilderPart>>;

export const BUILD_STEPS: { slot: BuildSlot; label: string; short: string; required: boolean; help: string }[] = [
  { slot: "cpu", label: "Procesador", short: "CPU", required: true, help: "Define la plataforma: socket y tipo de memoria." },
  { slot: "motherboard", label: "Tarjeta madre", short: "Motherboard", required: true, help: "Debe coincidir con el socket de tu procesador." },
  { slot: "ram", label: "Memoria RAM", short: "RAM", required: true, help: "El tipo (DDR5 o DDR4) depende de tu tarjeta madre." },
  { slot: "gpu", label: "Tarjeta gráfica", short: "GPU", required: false, help: "La pieza que más influye en el rendimiento en juegos." },
  { slot: "storage", label: "Almacenamiento", short: "Storage", required: true, help: "Un SSD NVMe acelera el arranque y la carga de juegos." },
  { slot: "psu", label: "Fuente de poder", short: "PSU", required: true, help: "Calculamos la potencia recomendada según tu build." },
  { slot: "case", label: "Gabinete", short: "Case", required: true, help: "Verificamos formato, largo de GPU y altura del disipador." },
  { slot: "cooling", label: "Refrigeración", short: "Cooling", required: false, help: "Opcional si tu procesador incluye disipador." },
];

const get = <T>(part: BuilderPart | undefined, kind: string): T | undefined =>
  part && part.tech.kind === kind ? (part.tech as T) : undefined;

/** Conectores PCIe de 8 pines que exige el adaptador de una GPU 12V-2x6 según su TGP */
function adapterPinsFor(tgp: number): number {
  if (tgp > 450) return 4;
  if (tgp > 200) return 3;
  return 2;
}

function eightPinsRequired(gpu: GpuTech): number {
  switch (gpu.power) {
    case "1x 8-pin":
      return 1;
    case "2x 8-pin":
      return 2;
    case "3x 8-pin":
      return 3;
    default:
      return adapterPinsFor(gpu.tgp);
  }
}

export function estimateWattage(build: ResolvedBuild): number {
  const cpu = get<CpuTech>(build.cpu, "cpu");
  const gpu = get<GpuTech>(build.gpu, "gpu");
  const cooler = get<CoolerTech>(build.cooling, "cooling");
  let w = 0;
  if (cpu) w += cpu.peakW;
  if (gpu) w += gpu.tgp;
  if (build.motherboard) w += 35;
  if (build.ram) w += 10;
  if (build.storage) w += 8;
  if (build.case) w += 15;
  if (cooler) w += cooler.type === "Líquida AIO" ? 15 : 5;
  return w;
}

export function recommendedPsu(build: ResolvedBuild): number {
  const gpu = get<GpuTech>(build.gpu, "gpu");
  const est = estimateWattage(build);
  if (est === 0) return 0;
  const headroom = Math.ceil((est * 1.3) / 50) * 50;
  return Math.max(gpu?.recommendedPsu ?? 0, headroom, 450);
}

export function evaluateBuild(build: ResolvedBuild): CompatIssue[] {
  const issues: CompatIssue[] = [];
  const cpu = get<CpuTech>(build.cpu, "cpu");
  const mb = get<BoardTech>(build.motherboard, "motherboard");
  const ram = get<RamTech>(build.ram, "ram");
  const gpu = get<GpuTech>(build.gpu, "gpu");
  const psu = get<PsuTech>(build.psu, "psu");
  const pcCase = get<CaseTech>(build.case, "case");
  const cooler = get<CoolerTech>(build.cooling, "cooling");

  // CPU ↔ Tarjeta madre
  if (cpu && mb && cpu.socket !== mb.socket) {
    issues.push({
      id: "socket",
      level: "error",
      title: "Socket incompatible",
      detail: `El procesador usa ${cpu.socket} y la tarjeta madre ${mb.socket}.`,
      slots: ["cpu", "motherboard"],
    });
  }
  if (cpu && mb && cpu.socket === mb.socket && !cpu.memory.includes(mb.memory)) {
    issues.push({
      id: "cpu-memory",
      level: "error",
      title: "Tipo de memoria no soportado",
      detail: `El procesador no admite ${mb.memory}.`,
      slots: ["cpu", "motherboard"],
    });
  }

  // RAM
  if (ram && mb && ram.memory !== mb.memory) {
    issues.push({
      id: "ram-type",
      level: "error",
      title: "Memoria incompatible",
      detail: `La tarjeta madre usa ${mb.memory} y elegiste un kit ${ram.memory}.`,
      slots: ["ram", "motherboard"],
    });
  } else if (ram && !mb && cpu && !cpu.memory.includes(ram.memory)) {
    issues.push({
      id: "ram-cpu",
      level: "error",
      title: "Memoria incompatible",
      detail: `El procesador solo admite ${cpu.memory.join(" / ")}.`,
      slots: ["ram", "cpu"],
    });
  }
  if (ram && mb && ram.modules > mb.memorySlots) {
    issues.push({
      id: "ram-slots",
      level: "error",
      title: "Faltan ranuras de memoria",
      detail: `El kit tiene ${ram.modules} módulos y la tarjeta madre ${mb.memorySlots} ranuras.`,
      slots: ["ram", "motherboard"],
    });
  }
  if (ram && mb && ram.capacityGb > mb.maxMemoryGb) {
    issues.push({
      id: "ram-capacity",
      level: "error",
      title: "Capacidad de memoria excedida",
      detail: `La tarjeta madre admite hasta ${mb.maxMemoryGb} GB.`,
      slots: ["ram", "motherboard"],
    });
  }

  // Gabinete ↔ tarjeta madre / GPU / disipador
  if (pcCase && mb && !pcCase.supports.includes(mb.formFactor)) {
    issues.push({
      id: "case-ff",
      level: "error",
      title: "La tarjeta madre no cabe",
      detail: `El gabinete admite ${pcCase.supports.join(", ")} y la tarjeta madre es ${mb.formFactor}.`,
      slots: ["case", "motherboard"],
    });
  }
  if (pcCase && gpu) {
    const margin = pcCase.maxGpuMm - gpu.lengthMm;
    if (margin < 0) {
      issues.push({
        id: "gpu-length",
        level: "error",
        title: "La tarjeta gráfica no cabe",
        detail: `Mide ${gpu.lengthMm} mm y el gabinete admite hasta ${pcCase.maxGpuMm} mm.`,
        slots: ["gpu", "case"],
      });
    } else if (margin < 15) {
      issues.push({
        id: "gpu-length-tight",
        level: "warn",
        title: "Espacio justo para la GPU",
        detail: `Quedan ${margin} mm libres. Revisa ventiladores frontales o radiadores.`,
        slots: ["gpu", "case"],
      });
    }
  }
  if (pcCase && cooler) {
    if (cooler.type === "Aire" && cooler.heightMm && cooler.heightMm > pcCase.maxCoolerMm) {
      issues.push({
        id: "cooler-height",
        level: "error",
        title: "El disipador es demasiado alto",
        detail: `Mide ${cooler.heightMm} mm y el gabinete admite ${pcCase.maxCoolerMm} mm.`,
        slots: ["cooling", "case"],
      });
    }
    if (cooler.type === "Líquida AIO" && cooler.radiatorMm && !pcCase.radiators.includes(cooler.radiatorMm)) {
      issues.push({
        id: "radiator",
        level: "error",
        title: "Radiador no soportado",
        detail: pcCase.radiators.length
          ? `El gabinete admite radiadores de ${pcCase.radiators.join(", ")} mm.`
          : "El gabinete no admite radiadores.",
        slots: ["cooling", "case"],
      });
    }
  }

  // Refrigeración ↔ CPU
  if (cooler && cpu) {
    if (!cooler.sockets.includes(cpu.socket)) {
      issues.push({
        id: "cooler-socket",
        level: "error",
        title: "Disipador incompatible con el socket",
        detail: `Compatible con ${cooler.sockets.join(", ")}; tu procesador es ${cpu.socket}.`,
        slots: ["cooling", "cpu"],
      });
    } else if (cooler.tdpRating < cpu.tdp) {
      issues.push({
        id: "cooler-tdp",
        level: "warn",
        title: "Enfriamiento limitado",
        detail: `El disipador está pensado para ${cooler.tdpRating} W y el procesador tiene ${cpu.tdp} W de TDP.`,
        slots: ["cooling", "cpu"],
      });
    }
  }
  if (cpu && !cooler && build.case && !cpu.boxCooler) {
    issues.push({
      id: "no-cooler",
      level: "warn",
      title: "Falta un disipador",
      detail: "Tu procesador no incluye disipador. Agrega uno en el paso Refrigeración.",
      slots: ["cooling"],
    });
  }

  // Gráficos
  if (cpu && !gpu && !cpu.igpu && build.case) {
    issues.push({
      id: "no-gpu",
      level: "warn",
      title: "Necesitas una tarjeta gráfica",
      detail: "Tu procesador no tiene gráficos integrados.",
      slots: ["gpu"],
    });
  }

  // Fuente
  if (psu) {
    const est = estimateWattage(build);
    const rec = recommendedPsu(build);
    if (psu.watts < est) {
      issues.push({
        id: "psu-low",
        level: "error",
        title: "Fuente insuficiente",
        detail: `Tu build consume alrededor de ${est} W y la fuente es de ${psu.watts} W.`,
        slots: ["psu"],
      });
    } else if (psu.watts < rec) {
      issues.push({
        id: "psu-headroom",
        level: "warn",
        title: "Revisa la potencia de tu fuente",
        detail: `Recomendamos ${rec} W o más para tener margen. Elegiste ${psu.watts} W.`,
        slots: ["psu"],
      });
    }
    if (gpu) {
      if (gpu.power === "12V-2x6" && !psu.native12v2x6) {
        const need = eightPinsRequired(gpu);
        if (psu.pcie8pin >= need) {
          issues.push({
            id: "psu-adapter",
            level: "warn",
            title: "Usarás el adaptador de la GPU",
            detail: `La GPU usa 12V-2x6 (16 pines). Tu fuente puede alimentarla con el adaptador incluido usando ${need} cables PCIe de 8 pines.`,
            slots: ["psu", "gpu"],
          });
        } else {
          issues.push({
            id: "psu-connectors",
            level: "error",
            title: "Conectores de energía insuficientes",
            detail: `La GPU necesita 12V-2x6 o ${need} conectores PCIe de 8 pines; la fuente tiene ${psu.pcie8pin}.`,
            slots: ["psu", "gpu"],
          });
        }
      } else if (gpu.power !== "12V-2x6" && psu.pcie8pin < eightPinsRequired(gpu)) {
        issues.push({
          id: "psu-connectors",
          level: "error",
          title: "Conectores de energía insuficientes",
          detail: `La GPU necesita ${gpu.power} y la fuente tiene ${psu.pcie8pin} conectores PCIe.`,
          slots: ["psu", "gpu"],
        });
      }
    }
  }

  return issues;
}

export function overallLevel(issues: CompatIssue[]): CompatLevel {
  if (issues.some((i) => i.level === "error")) return "error";
  if (issues.some((i) => i.level === "warn")) return "warn";
  return "ok";
}

export interface CandidateCheck {
  level: CompatLevel;
  reasons: string[];
}

/**
 * Evalúa cómo quedaría la build si el candidato ocupa su ranura.
 * Se atribuyen al candidato los problemas que lo involucran directamente y los que
 * aparecen solo al agregarlo (p. ej. una GPU que deja corta a la fuente elegida).
 */
export function checkCandidate(build: ResolvedBuild, slot: BuildSlot, candidate: BuilderPart): CandidateCheck {
  const base: ResolvedBuild = { ...build };
  delete base[slot];
  const baseIds = new Set(evaluateBuild(base).map((i) => i.id));
  const next: ResolvedBuild = { ...build, [slot]: candidate };
  const issues = evaluateBuild(next).filter(
    (i) => (i.slots.includes(slot) || !baseIds.has(i.id)) && i.id !== "no-cooler" && i.id !== "no-gpu",
  );
  return { level: overallLevel(issues), reasons: issues.map((i) => i.title + ". " + i.detail) };
}

/** Precio total */
export function buildTotal(build: ResolvedBuild): number {
  return Object.values(build).reduce((sum, p) => sum + (p?.price ?? 0), 0);
}

export function missingRequired(build: ResolvedBuild): BuildSlot[] {
  const cpu = get<CpuTech>(build.cpu, "cpu");
  return BUILD_STEPS.filter((s) => {
    if (build[s.slot]) return false;
    if (s.required) return true;
    if (s.slot === "gpu") return cpu ? !cpu.igpu : false;
    if (s.slot === "cooling") return cpu ? !cpu.boxCooler : false;
    return false;
  }).map((s) => s.slot);
}
