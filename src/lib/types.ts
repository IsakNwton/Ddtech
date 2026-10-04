/* ------------------------------------------------------------------ */
/* Dominio del catálogo                                               */
/* ------------------------------------------------------------------ */

export type CategoryId =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "case"
  | "cooling"
  | "fans"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "headset"
  | "pc";

export type CategoryGroup = "componentes" | "perifericos" | "pcs";

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  /** Nombre corto para chips y tarjetas compactas */
  shortName: string;
  singular: string;
  group: CategoryGroup;
  description: string;
  /** Línea secundaria en el mega menú */
  hint: string;
  /** Nombre del archivo de arte representativo */
  art: string;
}

export type ProductTag = "oferta" | "nuevo" | "top" | "envio-gratis";

export type Socket = "AM5" | "AM4" | "LGA1851" | "LGA1700";
export type MemoryType = "DDR5" | "DDR4";
export type FormFactor = "E-ATX" | "ATX" | "Micro-ATX" | "Mini-ITX";
export type GpuPower = "1x 8-pin" | "2x 8-pin" | "3x 8-pin" | "12V-2x6";

export interface CpuTech {
  kind: "cpu";
  family: string;
  socket: Socket;
  cores: number;
  threads: number;
  baseGhz: number;
  boostGhz: number;
  tdp: number;
  /** Consumo pico estimado usado por la calculadora de potencia */
  peakW: number;
  memory: MemoryType[];
  igpu: boolean;
  boxCooler: boolean;
  cacheMb: number;
  /** Índices relativos 0–100 (datos demostrativos) */
  gaming: number;
  productivity: number;
}

export interface BoardTech {
  kind: "motherboard";
  socket: Socket;
  chipset: string;
  formFactor: FormFactor;
  memory: MemoryType;
  memorySlots: number;
  maxMemoryGb: number;
  m2Slots: number;
  wifi: boolean;
}

export interface RamTech {
  kind: "ram";
  memory: MemoryType;
  capacityGb: number;
  modules: number;
  speed: number;
  latency: number;
  rgb: boolean;
}

export interface GpuTech {
  kind: "gpu";
  chipBrand: "NVIDIA" | "AMD" | "Intel";
  chipset: string;
  architecture: string;
  vramGb: number;
  memoryType: string;
  busBits: number;
  boostMhz: number;
  tgp: number;
  recommendedPsu: number;
  power: GpuPower;
  lengthMm: number;
  slots: number;
  outputs: string;
  /** Rendimiento relativo 0–100 (demo) */
  perf: number;
}

export interface StorageTech {
  kind: "storage";
  interface: "NVMe Gen5" | "NVMe Gen4" | "SATA";
  formFactor: "M.2 2280" | '2.5"';
  capacityGb: number;
  readMb: number;
  writeMb: number;
}

export interface PsuTech {
  kind: "psu";
  watts: number;
  efficiency: "80 Plus Bronze" | "80 Plus Gold" | "80 Plus Platinum";
  modular: "Completamente modular" | "Semi modular" | "No modular";
  native12v2x6: boolean;
  pcie8pin: number;
  atx3: boolean;
}

export interface CaseTech {
  kind: "case";
  supports: FormFactor[];
  maxGpuMm: number;
  maxCoolerMm: number;
  radiators: number[];
  fansIncluded: number;
  tone: "Negro" | "Blanco";
}

export interface CoolerTech {
  kind: "cooling";
  type: "Aire" | "Líquida AIO";
  heightMm?: number;
  radiatorMm?: number;
  sockets: Socket[];
  tdpRating: number;
}

export interface PcTech {
  kind: "pc";
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  gaming: number;
  productivity: number;
}

export interface GenericTech {
  kind: "generic";
  facets: Record<string, string>;
}

export type ProductTech =
  | CpuTech
  | BoardTech
  | RamTech
  | GpuTech
  | StorageTech
  | PsuTech
  | CaseTech
  | CoolerTech
  | PcTech
  | GenericTech;

export interface SpecGroup {
  title: string;
  rows: [label: string, value: string][];
}

/* Arte vectorial de producto (sustituible por fotografía real) */
export type ArtType =
  | "gpu"
  | "cpu"
  | "motherboard"
  | "ram"
  | "ssd"
  | "ssd-sata"
  | "psu"
  | "case"
  | "cooler-air"
  | "cooler-aio"
  | "fan"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "headset"
  | "pc";

export type ArtTone = "black" | "gunmetal" | "silver" | "white";

export interface ArtSpec {
  type: ArtType;
  tone: ArtTone;
  accent: string;
  /** Texto corto serigrafiado en el arte (modelo) */
  label?: string;
  sublabel?: string;
  fans?: 1 | 2 | 3;
  rgb?: boolean;
  variant?: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  category: CategoryId;
  brand: string;
  name: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  tags: ProductTag[];
  highlights: string[];
  description: string;
  features: string[];
  specs: SpecGroup[];
  tech: ProductTech;
  art: ArtSpec;
  /** Mensualidades de ejemplo (placeholder) */
  msi?: number;
}

/** Versión ligera serializable que viaja al cliente (tarjetas, carrito, favoritos) */
export interface ProductSummary {
  id: string;
  slug: string;
  category: CategoryId;
  brand: string;
  name: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  tags: ProductTag[];
  highlights: string[];
  image: string;
}

/* ------------------------------------------------------------------ */
/* Arma tu PC                                                          */
/* ------------------------------------------------------------------ */

export type BuildSlot =
  | "cpu"
  | "motherboard"
  | "ram"
  | "gpu"
  | "storage"
  | "psu"
  | "case"
  | "cooling";

export type BuildSelection = Partial<Record<BuildSlot, string>>;

export interface BuilderPart extends ProductSummary {
  tech: ProductTech;
}

export type CompatLevel = "ok" | "warn" | "error";

export interface CompatIssue {
  id: string;
  level: Exclude<CompatLevel, "ok">;
  title: string;
  detail: string;
  slots: BuildSlot[];
}

export interface BuildPreset {
  id: string;
  name: string;
  tagline: string;
  target: string;
  parts: Required<Pick<BuildSelection, "cpu" | "motherboard" | "ram" | "gpu" | "storage" | "psu" | "case">> &
    Pick<BuildSelection, "cooling">;
}
