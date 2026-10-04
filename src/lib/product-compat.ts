import { products } from "@/data/catalog";
import type { Product } from "./types";

/**
 * Información de compatibilidad para la ficha de producto, calculada a partir del catálogo.
 * Responde la pregunta "¿con qué funciona esto?" sin salir de la página.
 */

export interface CompatGroup {
  title: string;
  note?: string;
  items: { name: string; slug: string }[];
  total: number;
  of: number;
}

export interface ProductCompat {
  requirements: [string, string][];
  groups: CompatGroup[];
  builderSlot?: string;
}

const pick = (list: Product[]) => list.map((p) => ({ name: `${p.brand} ${p.name}`, slug: p.slug }));
const of = (kind: Product["tech"]["kind"]) => products.filter((p) => p.tech.kind === kind);

export function getProductCompat(p: Product): ProductCompat | null {
  const t = p.tech;
  switch (t.kind) {
    case "cpu": {
      const boards = of("motherboard").filter((b) => b.tech.kind === "motherboard" && b.tech.socket === t.socket && t.memory.includes(b.tech.memory));
      const coolers = of("cooling").filter((c) => c.tech.kind === "cooling" && c.tech.sockets.includes(t.socket));
      return {
        builderSlot: "cpu",
        requirements: [
          ["Socket", t.socket],
          ["Memoria", t.memory.join(" / ")],
          ["Disipador", t.boxCooler ? "Incluido en caja" : "Se vende por separado"],
          ["Gráficos", t.igpu ? "Integrados (GPU dedicada opcional)" : "Requiere tarjeta gráfica dedicada"],
        ],
        groups: [
          { title: `Tarjetas madre ${t.socket} compatibles`, items: pick(boards), total: boards.length, of: of("motherboard").length },
          { title: "Disipadores compatibles", items: pick(coolers), total: coolers.length, of: of("cooling").length },
        ],
      };
    }
    case "motherboard": {
      const cpus = of("cpu").filter((c) => c.tech.kind === "cpu" && c.tech.socket === t.socket && c.tech.memory.includes(t.memory));
      const rams = of("ram").filter((r) => r.tech.kind === "ram" && r.tech.memory === t.memory);
      const cases = of("case").filter((c) => c.tech.kind === "case" && c.tech.supports.includes(t.formFactor));
      return {
        builderSlot: "motherboard",
        requirements: [
          ["Socket", t.socket],
          ["Memoria", `${t.memory} · ${t.memorySlots} ranuras`],
          ["Formato", t.formFactor],
        ],
        groups: [
          { title: "Procesadores compatibles", items: pick(cpus), total: cpus.length, of: of("cpu").length },
          { title: `Memoria ${t.memory} compatible`, items: pick(rams), total: rams.length, of: of("ram").length },
          { title: `Gabinetes para ${t.formFactor}`, items: pick(cases), total: cases.length, of: of("case").length },
        ],
      };
    }
    case "ram": {
      const boards = of("motherboard").filter((b) => b.tech.kind === "motherboard" && b.tech.memory === t.memory && b.tech.memorySlots >= t.modules);
      return {
        builderSlot: "ram",
        requirements: [
          ["Tipo", t.memory],
          ["Módulos", `${t.modules}`],
        ],
        groups: [{ title: `Tarjetas madre ${t.memory}`, items: pick(boards), total: boards.length, of: of("motherboard").length }],
      };
    }
    case "gpu": {
      const cases = of("case").filter((c) => c.tech.kind === "case" && c.tech.maxGpuMm >= t.lengthMm);
      const psus = of("psu").filter((s) => s.tech.kind === "psu" && s.tech.watts >= t.recommendedPsu);
      return {
        builderSlot: "gpu",
        requirements: [
          ["Fuente recomendada", `${t.recommendedPsu} W o más`],
          ["Conector de energía", t.power === "12V-2x6" ? "12V-2x6 (16 pines)" : t.power],
          ["Largo", `${t.lengthMm} mm`],
          ["Ranuras", `${t.slots}`],
        ],
        groups: [
          { title: "Gabinetes donde cabe", note: `Admiten GPU de ${t.lengthMm} mm o más`, items: pick(cases), total: cases.length, of: of("case").length },
          { title: "Fuentes con potencia suficiente", note: `${t.recommendedPsu} W o más`, items: pick(psus), total: psus.length, of: of("psu").length },
        ],
      };
    }
    case "psu": {
      const gpus = of("gpu").filter((g) => g.tech.kind === "gpu" && g.tech.recommendedPsu <= t.watts);
      return {
        builderSlot: "psu",
        requirements: [
          ["Potencia", `${t.watts} W`],
          ["12V-2x6 nativo", t.native12v2x6 ? "Sí" : "No (usa adaptador de la GPU)"],
          ["PCIe 8 pines", `${t.pcie8pin}`],
        ],
        groups: [{ title: "Tarjetas gráficas soportadas por potencia", items: pick(gpus), total: gpus.length, of: of("gpu").length }],
      };
    }
    case "case": {
      const gpus = of("gpu").filter((g) => g.tech.kind === "gpu" && g.tech.lengthMm <= t.maxGpuMm);
      const coolers = of("cooling").filter(
        (c) =>
          c.tech.kind === "cooling" &&
          (c.tech.type === "Aire" ? (c.tech.heightMm ?? 0) <= t.maxCoolerMm : t.radiators.includes(c.tech.radiatorMm ?? 0)),
      );
      return {
        builderSlot: "case",
        requirements: [
          ["Tarjetas madre", t.supports.join(", ")],
          ["GPU máx.", `${t.maxGpuMm} mm`],
          ["Disipador máx.", `${t.maxCoolerMm} mm`],
        ],
        groups: [
          { title: "Tarjetas gráficas que caben", items: pick(gpus), total: gpus.length, of: of("gpu").length },
          { title: "Enfriamiento compatible", items: pick(coolers), total: coolers.length, of: of("cooling").length },
        ],
      };
    }
    case "cooling": {
      const cases = of("case").filter(
        (c) =>
          c.tech.kind === "case" &&
          (t.type === "Aire" ? (t.heightMm ?? 0) <= c.tech.maxCoolerMm : c.tech.radiators.includes(t.radiatorMm ?? 0)),
      );
      const cpus = of("cpu").filter((c) => c.tech.kind === "cpu" && t.sockets.includes(c.tech.socket));
      return {
        builderSlot: "cooling",
        requirements: [
          ["Sockets", t.sockets.join(", ")],
          [t.type === "Aire" ? "Altura" : "Radiador", t.type === "Aire" ? `${t.heightMm} mm` : `${t.radiatorMm} mm`],
          ["TDP de referencia", `${t.tdpRating} W`],
        ],
        groups: [
          { title: "Gabinetes compatibles", items: pick(cases), total: cases.length, of: of("case").length },
          { title: "Procesadores compatibles", items: pick(cpus), total: cpus.length, of: of("cpu").length },
        ],
      };
    }
    case "storage":
      return {
        builderSlot: "storage",
        requirements: [
          ["Interfaz", t.interface],
          ["Formato", t.formFactor],
          ["Requisito", t.formFactor === "M.2 2280" ? "Ranura M.2 libre en la tarjeta madre" : "Puerto SATA y bahía de 2.5\""],
        ],
        groups: [],
      };
    default:
      return null;
  }
}
