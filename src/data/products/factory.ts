import type {
  ArtSpec,
  BoardTech,
  CaseTech,
  CategoryId,
  CoolerTech,
  CpuTech,
  GenericTech,
  GpuTech,
  PcTech,
  Product,
  ProductTag,
  PsuTech,
  RamTech,
  SpecGroup,
  StorageTech,
} from "@/lib/types";
import { slugify } from "@/lib/format";

/**
 * Fábrica de productos de DEMOSTRACIÓN.
 * Las especificaciones se inspiran en hardware real, pero precios, existencias,
 * valoraciones y ventas son ficticios y deterministas (no corresponden a DDTech).
 */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(key: string) {
  let s = hash(key) || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

interface BaseInput {
  brand: string;
  name: string;
  price: number;
  compareAt?: number;
  tags?: ProductTag[];
  stock?: number;
  rating?: number;
  reviews?: number;
  sold?: number;
  art: Omit<ArtSpec, "type"> & { type?: ArtSpec["type"] };
  description?: string;
  features?: string[];
  extraSpecs?: SpecGroup[];
  slug?: string;
}

function base(category: CategoryId, input: BaseInput, defaults: { art: ArtSpec["type"] }) {
  const slug = input.slug ?? slugify(`${input.brand} ${input.name}`);
  const rnd = seeded(slug);
  const rating = input.rating ?? Math.round((4.2 + rnd() * 0.75) * 10) / 10;
  const reviews = input.reviews ?? Math.floor(8 + rnd() * 420);
  const stock = input.stock ?? Math.floor(rnd() * 36);
  const sold = input.sold ?? Math.floor(20 + rnd() * 900);
  const tags = new Set(input.tags ?? []);
  if (input.compareAt && input.compareAt > input.price) tags.add("oferta");
  const sku = `DDT-${category.toUpperCase().slice(0, 3)}-${(hash(slug) % 90000) + 10000}`;
  const msi = input.price >= 3000 ? (input.price >= 15000 ? 18 : input.price >= 8000 ? 12 : 6) : undefined;
  return {
    id: slug,
    slug,
    sku,
    category,
    brand: input.brand,
    name: input.name,
    price: input.price,
    compareAt: input.compareAt,
    rating: Math.min(rating, 5),
    reviews,
    stock,
    sold,
    tags: [...tags],
    msi,
    art: { type: defaults.art, ...input.art } as ArtSpec,
  };
}

const yesNo = (v: boolean) => (v ? "Sí" : "No");

/* ------------------------------------------------------------------ */

export function gpu(input: BaseInput & { tech: Omit<GpuTech, "kind"> }): Product {
  const t: GpuTech = { kind: "gpu", ...input.tech };
  const b = base("gpu", input, { art: "gpu" });
  return {
    ...b,
    highlights: [`${t.vramGb} GB ${t.memoryType}`, `${t.tgp} W`, `${t.lengthMm} mm`],
    description:
      input.description ??
      `La ${input.brand} ${input.name} lleva la arquitectura ${t.architecture} de ${t.chipBrand} a tu equipo con ${t.vramGb} GB de memoria ${t.memoryType}. Diseñada para jugar con altas tasas de cuadros, transmitir y acelerar aplicaciones creativas, con un sistema de enfriamiento de ${b.art.fans ?? 2} ventiladores que mantiene bajas las temperaturas y el ruido.`,
    features: input.features ?? [
      `Arquitectura ${t.architecture} con soporte para trazado de rayos y escalado por IA`,
      `${t.vramGb} GB de memoria ${t.memoryType} en bus de ${t.busBits} bits`,
      `Enfriamiento de ${b.art.fans ?? 2} ventiladores con modo silencioso a baja carga`,
      `Alimentación ${t.power === "12V-2x6" ? "mediante conector 12V-2x6 (16 pines)" : `mediante ${t.power}`}`,
    ],
    specs: [
      {
        title: "Procesador gráfico",
        rows: [
          ["GPU", `${t.chipBrand} ${t.chipset}`],
          ["Arquitectura", t.architecture],
          ["Frecuencia boost", `${t.boostMhz.toLocaleString("es-MX")} MHz`],
        ],
      },
      {
        title: "Memoria",
        rows: [
          ["VRAM", `${t.vramGb} GB`],
          ["Tipo de memoria", t.memoryType],
          ["Interfaz de memoria", `${t.busBits} bits`],
        ],
      },
      {
        title: "Energía",
        rows: [
          ["Consumo (TGP)", `${t.tgp} W`],
          ["PSU recomendada", `${t.recommendedPsu} W`],
          ["Conectores de energía", t.power === "12V-2x6" ? "1x 12V-2x6 (16 pines)" : t.power],
        ],
      },
      {
        title: "Físico y conectividad",
        rows: [
          ["Dimensiones (largo)", `${t.lengthMm} mm`],
          ["Ranuras ocupadas", `${t.slots}`],
          ["Puertos", t.outputs],
          ["Interfaz", "PCI Express 5.0 x16"],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

export function cpu(input: BaseInput & { tech: Omit<CpuTech, "kind"> }): Product {
  const t: CpuTech = { kind: "cpu", ...input.tech };
  const b = base("cpu", input, { art: "cpu" });
  return {
    ...b,
    highlights: [`${t.cores}C / ${t.threads}T`, `Hasta ${t.boostGhz} GHz`, t.socket],
    description:
      input.description ??
      `El ${input.brand} ${input.name} combina ${t.cores} núcleos y ${t.threads} hilos con frecuencias de hasta ${t.boostGhz} GHz en la plataforma ${t.socket}. Una opción equilibrada para jugar, transmitir y trabajar con aplicaciones exigentes.`,
    features: input.features ?? [
      `${t.cores} núcleos y ${t.threads} hilos`,
      `Frecuencia de hasta ${t.boostGhz} GHz`,
      `Compatible con memoria ${t.memory.join(" y ")}`,
      t.igpu ? "Gráficos integrados para diagnóstico o uso básico" : "Requiere tarjeta gráfica dedicada",
      t.boxCooler ? "Incluye disipador en caja" : "No incluye disipador",
    ],
    specs: [
      {
        title: "Rendimiento",
        rows: [
          ["Núcleos / hilos", `${t.cores} / ${t.threads}`],
          ["Frecuencia base", `${t.baseGhz} GHz`],
          ["Frecuencia máxima", `${t.boostGhz} GHz`],
          ["Caché total", `${t.cacheMb} MB`],
        ],
      },
      {
        title: "Plataforma",
        rows: [
          ["Socket", t.socket],
          ["Memoria compatible", t.memory.join(", ")],
          ["Gráficos integrados", yesNo(t.igpu)],
        ],
      },
      {
        title: "Energía y enfriamiento",
        rows: [
          ["TDP", `${t.tdp} W`],
          ["Disipador incluido", yesNo(t.boxCooler)],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

export function board(input: BaseInput & { tech: Omit<BoardTech, "kind"> }): Product {
  const t: BoardTech = { kind: "motherboard", ...input.tech };
  const b = base("motherboard", input, { art: "motherboard" });
  return {
    ...b,
    highlights: [t.socket, t.formFactor, t.memory],
    description:
      input.description ??
      `La ${input.brand} ${input.name} es una tarjeta madre ${t.formFactor} con chipset ${t.chipset} para procesadores ${t.socket}. Ofrece ${t.memorySlots} ranuras ${t.memory}, ${t.m2Slots} ranuras M.2${t.wifi ? " y conectividad inalámbrica integrada" : ""}.`,
    features: input.features ?? [
      `Socket ${t.socket} con chipset ${t.chipset}`,
      `${t.memorySlots} ranuras ${t.memory}, hasta ${t.maxMemoryGb} GB`,
      `${t.m2Slots} ranuras M.2 para SSD NVMe`,
      t.wifi ? "Wi-Fi y Bluetooth integrados" : "Red Ethernet integrada",
    ],
    specs: [
      {
        title: "Plataforma",
        rows: [
          ["Socket", t.socket],
          ["Chipset", t.chipset],
          ["Formato", t.formFactor],
        ],
      },
      {
        title: "Memoria",
        rows: [
          ["Tipo", t.memory],
          ["Ranuras", `${t.memorySlots}`],
          ["Capacidad máxima", `${t.maxMemoryGb} GB`],
        ],
      },
      {
        title: "Almacenamiento y conectividad",
        rows: [
          ["Ranuras M.2", `${t.m2Slots}`],
          ["Wi-Fi", yesNo(t.wifi)],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

export function ram(input: BaseInput & { tech: Omit<RamTech, "kind"> }): Product {
  const t: RamTech = { kind: "ram", ...input.tech };
  const b = base("ram", input, { art: "ram" });
  return {
    ...b,
    highlights: [`${t.capacityGb} GB (${t.modules}x${t.capacityGb / t.modules})`, `${t.memory}-${t.speed}`, `CL${t.latency}`],
    description:
      input.description ??
      `Kit ${input.brand} ${input.name} de ${t.capacityGb} GB en ${t.modules} módulos ${t.memory} a ${t.speed} MT/s con latencia CL${t.latency}.${t.rgb ? " Iluminación RGB personalizable." : " Perfil bajo para máxima compatibilidad con disipadores."}`,
    features: input.features ?? [
      `${t.capacityGb} GB en ${t.modules} módulos (dual channel)`,
      `${t.speed} MT/s con perfiles de overclock`,
      `Latencia CL${t.latency}`,
      t.rgb ? "Iluminación RGB" : "Disipador de aluminio de perfil bajo",
    ],
    specs: [
      {
        title: "Memoria",
        rows: [
          ["Tipo", t.memory],
          ["Capacidad", `${t.capacityGb} GB`],
          ["Módulos", `${t.modules} x ${t.capacityGb / t.modules} GB`],
          ["Velocidad", `${t.speed} MT/s`],
          ["Latencia", `CL${t.latency}`],
          ["RGB", yesNo(t.rgb)],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

const formatCapacity = (gb: number) => (gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`);

export function storage(input: BaseInput & { tech: Omit<StorageTech, "kind"> }): Product {
  const t: StorageTech = { kind: "storage", ...input.tech };
  const b = base("storage", input, { art: t.interface === "SATA" ? "ssd-sata" : "ssd" });
  return {
    ...b,
    highlights: [formatCapacity(t.capacityGb), t.interface, `${t.readMb.toLocaleString("es-MX")} MB/s`],
    description:
      input.description ??
      `Unidad ${input.brand} ${input.name} de ${formatCapacity(t.capacityGb)} con interfaz ${t.interface}. Lecturas de hasta ${t.readMb.toLocaleString("es-MX")} MB/s para cargas rápidas en juegos y proyectos pesados.`,
    features: input.features ?? [
      `Capacidad de ${formatCapacity(t.capacityGb)}`,
      `Lectura secuencial de hasta ${t.readMb.toLocaleString("es-MX")} MB/s`,
      `Escritura secuencial de hasta ${t.writeMb.toLocaleString("es-MX")} MB/s`,
      `Formato ${t.formFactor}`,
    ],
    specs: [
      {
        title: "Almacenamiento",
        rows: [
          ["Capacidad", formatCapacity(t.capacityGb)],
          ["Interfaz", t.interface],
          ["Formato", t.formFactor],
          ["Lectura secuencial", `${t.readMb.toLocaleString("es-MX")} MB/s`],
          ["Escritura secuencial", `${t.writeMb.toLocaleString("es-MX")} MB/s`],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

export function psu(input: BaseInput & { tech: Omit<PsuTech, "kind"> }): Product {
  const t: PsuTech = { kind: "psu", ...input.tech };
  const b = base("psu", input, { art: "psu" });
  return {
    ...b,
    highlights: [`${t.watts} W`, t.efficiency.replace("80 Plus ", "80+ "), t.atx3 ? "ATX 3.1" : t.modular],
    description:
      input.description ??
      `Fuente ${input.brand} ${input.name} de ${t.watts} W con certificación ${t.efficiency}. ${t.native12v2x6 ? "Incluye conector 12V-2x6 nativo para tarjetas gráficas de nueva generación." : `Ofrece ${t.pcie8pin} conectores PCIe de 8 pines.`}`,
    features: input.features ?? [
      `${t.watts} W de potencia continua`,
      `Certificación ${t.efficiency}`,
      t.modular,
      t.native12v2x6 ? "Conector 12V-2x6 nativo" : `${t.pcie8pin} conectores PCIe 8 pines`,
    ],
    specs: [
      {
        title: "Energía",
        rows: [
          ["Potencia", `${t.watts} W`],
          ["Eficiencia", t.efficiency],
          ["Estándar", t.atx3 ? "ATX 3.1" : "ATX 2.x"],
        ],
      },
      {
        title: "Conectores",
        rows: [
          ["Cableado", t.modular],
          ["12V-2x6 nativo", yesNo(t.native12v2x6)],
          ["PCIe 8 pines", `${t.pcie8pin}`],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

export function pcCase(input: BaseInput & { tech: Omit<CaseTech, "kind"> }): Product {
  const t: CaseTech = { kind: "case", ...input.tech };
  const b = base("case", input, { art: "case" });
  return {
    ...b,
    highlights: [t.supports[0] === "E-ATX" ? "ATX / E-ATX" : t.supports[0], `GPU ${t.maxGpuMm} mm`, t.tone],
    description:
      input.description ??
      `Gabinete ${input.brand} ${input.name} compatible con tarjetas madre ${t.supports.join(", ")}. Admite tarjetas gráficas de hasta ${t.maxGpuMm} mm y disipadores de hasta ${t.maxCoolerMm} mm de altura.`,
    features: input.features ?? [
      `Compatible con ${t.supports.join(", ")}`,
      `Tarjetas gráficas de hasta ${t.maxGpuMm} mm`,
      t.radiators.length ? `Radiadores de hasta ${Math.max(...t.radiators)} mm` : "Sin soporte para radiadores",
      `${t.fansIncluded} ventiladores incluidos`,
    ],
    specs: [
      {
        title: "Compatibilidad",
        rows: [
          ["Tarjetas madre", t.supports.join(", ")],
          ["Largo máximo de GPU", `${t.maxGpuMm} mm`],
          ["Altura máxima de disipador", `${t.maxCoolerMm} mm`],
          ["Radiadores", t.radiators.length ? t.radiators.map((r) => `${r} mm`).join(", ") : "No"],
        ],
      },
      {
        title: "Diseño",
        rows: [
          ["Color", t.tone],
          ["Ventiladores incluidos", `${t.fansIncluded}`],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

export function cooler(input: BaseInput & { tech: Omit<CoolerTech, "kind"> }): Product {
  const t: CoolerTech = { kind: "cooling", ...input.tech };
  const b = base("cooling", input, { art: t.type === "Aire" ? "cooler-air" : "cooler-aio" });
  return {
    ...b,
    highlights: [
      t.type,
      t.type === "Aire" ? `${t.heightMm} mm` : `Radiador ${t.radiatorMm} mm`,
      `${t.tdpRating} W`,
    ],
    description:
      input.description ??
      `${t.type === "Aire" ? "Disipador por aire" : "Enfriamiento líquido todo en uno"} ${input.brand} ${input.name}, compatible con ${t.sockets.join(", ")}. Capacidad de disipación de referencia de ${t.tdpRating} W.`,
    features: input.features ?? [
      `Compatible con ${t.sockets.join(", ")}`,
      t.type === "Aire" ? `Altura de ${t.heightMm} mm` : `Radiador de ${t.radiatorMm} mm`,
      `Capacidad de referencia: ${t.tdpRating} W`,
    ],
    specs: [
      {
        title: "Enfriamiento",
        rows: [
          ["Tipo", t.type],
          ...(t.type === "Aire"
            ? ([["Altura", `${t.heightMm} mm`]] as [string, string][])
            : ([["Radiador", `${t.radiatorMm} mm`]] as [string, string][])),
          ["Sockets", t.sockets.join(", ")],
          ["TDP de referencia", `${t.tdpRating} W`],
        ],
      },
      ...(input.extraSpecs ?? []),
    ],
    tech: t,
  };
}

export function generic(
  category: CategoryId,
  input: BaseInput & { facets: Record<string, string>; highlights: string[]; specs: SpecGroup[] },
): Product {
  const t: GenericTech = { kind: "generic", facets: input.facets };
  const artType = (input.art.type ?? category) as ArtSpec["type"];
  const b = base(category, input, { art: artType });
  return {
    ...b,
    highlights: input.highlights,
    description: input.description ?? `${input.brand} ${input.name}.`,
    features: input.features ?? [],
    specs: input.specs,
    tech: t,
  };
}

export function prebuilt(
  input: BaseInput & { tech: Omit<PcTech, "kind">; specs: SpecGroup[] },
): Product {
  const t: PcTech = { kind: "pc", ...input.tech };
  const b = base("pc", input, { art: "pc" });
  return {
    ...b,
    highlights: [t.cpu.replace(/^(AMD|Intel) /, ""), t.gpu.replace(/^(NVIDIA GeForce|AMD Radeon|Intel Arc) /, ""), t.ram],
    description: input.description ?? `${input.name}.`,
    features: input.features ?? [],
    specs: input.specs,
    tech: t,
  };
}
