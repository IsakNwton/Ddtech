import type { Category, CategoryId } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cpu",
    slug: "cpu",
    name: "Procesadores",
    shortName: "CPU",
    singular: "Procesador",
    group: "componentes",
    description: "AMD Ryzen e Intel Core para gaming, streaming y productividad.",
    hint: "AMD Ryzen · Intel Core",
    art: "cat-cpu",
  },
  {
    id: "gpu",
    slug: "gpu",
    name: "Tarjetas gráficas",
    shortName: "GPU",
    singular: "Tarjeta gráfica",
    group: "componentes",
    description: "NVIDIA GeForce RTX, AMD Radeon e Intel Arc.",
    hint: "GeForce RTX · Radeon · Arc",
    art: "cat-gpu",
  },
  {
    id: "motherboard",
    slug: "tarjetas-madre",
    name: "Tarjetas madre",
    shortName: "Motherboards",
    singular: "Tarjeta madre",
    group: "componentes",
    description: "AM5, AM4, LGA1851 y LGA1700 en ATX, Micro-ATX y Mini-ITX.",
    hint: "AM5 · LGA1851 · AM4",
    art: "cat-motherboard",
  },
  {
    id: "ram",
    slug: "memoria-ram",
    name: "Memoria RAM",
    shortName: "RAM",
    singular: "Memoria RAM",
    group: "componentes",
    description: "Kits DDR5 y DDR4 de alto rendimiento.",
    hint: "DDR5 · DDR4",
    art: "cat-ram",
  },
  {
    id: "storage",
    slug: "almacenamiento",
    name: "Almacenamiento",
    shortName: "SSD",
    singular: "Unidad de almacenamiento",
    group: "componentes",
    description: "SSD NVMe Gen5, Gen4 y SATA.",
    hint: "NVMe Gen5 · Gen4 · SATA",
    art: "cat-storage",
  },
  {
    id: "psu",
    slug: "fuentes-de-poder",
    name: "Fuentes de poder",
    shortName: "Fuentes",
    singular: "Fuente de poder",
    group: "componentes",
    description: "Fuentes certificadas 80 Plus, ATX 3.x y modulares.",
    hint: "80 Plus · ATX 3.1",
    art: "cat-psu",
  },
  {
    id: "case",
    slug: "gabinetes",
    name: "Gabinetes",
    shortName: "Gabinetes",
    singular: "Gabinete",
    group: "componentes",
    description: "Gabinetes ATX, Micro-ATX y Mini-ITX con gran flujo de aire.",
    hint: "ATX · Micro-ATX · ITX",
    art: "cat-case",
  },
  {
    id: "cooling",
    slug: "enfriamiento",
    name: "Refrigeración",
    shortName: "Enfriamiento",
    singular: "Disipador",
    group: "componentes",
    description: "Disipadores por aire y enfriamiento líquido AIO.",
    hint: "Aire · Líquida AIO",
    art: "cat-cooling",
  },
  {
    id: "fans",
    slug: "ventiladores",
    name: "Ventiladores",
    shortName: "Ventiladores",
    singular: "Ventilador",
    group: "componentes",
    description: "Ventiladores de 120 mm y 140 mm, PWM y ARGB.",
    hint: "120 mm · PWM · ARGB",
    art: "cat-fans",
  },
  {
    id: "monitor",
    slug: "monitores",
    name: "Monitores",
    shortName: "Monitores",
    singular: "Monitor",
    group: "perifericos",
    description: "Monitores gaming 1080p, 1440p, 4K y OLED.",
    hint: "QHD · 4K · OLED",
    art: "cat-monitor",
  },
  {
    id: "keyboard",
    slug: "teclados",
    name: "Teclados",
    shortName: "Teclados",
    singular: "Teclado",
    group: "perifericos",
    description: "Teclados mecánicos y de bajo perfil.",
    hint: "Mecánicos · TKL · 75%",
    art: "cat-keyboard",
  },
  {
    id: "mouse",
    slug: "mouse",
    name: "Mouse",
    shortName: "Mouse",
    singular: "Mouse",
    group: "perifericos",
    description: "Mouse gaming inalámbricos y alámbricos.",
    hint: "Inalámbricos · Ultraligeros",
    art: "cat-mouse",
  },
  {
    id: "headset",
    slug: "audifonos",
    name: "Audífonos",
    shortName: "Audífonos",
    singular: "Audífonos",
    group: "perifericos",
    description: "Headsets gaming con micrófono.",
    hint: "Inalámbricos · Surround",
    art: "cat-headset",
  },
  {
    id: "pc",
    slug: "pcs-gaming",
    name: "PCs Gaming",
    shortName: "PCs",
    singular: "PC Gaming",
    group: "pcs",
    description: "Equipos armados y probados, listos para jugar.",
    hint: "Listas para jugar",
    art: "cat-pc",
  },
];

const byId = new Map(categories.map((c) => [c.id, c]));
const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(id: CategoryId): Category {
  const c = byId.get(id);
  if (!c) throw new Error(`Categoría desconocida: ${id}`);
  return c;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return bySlug.get(slug);
}

export function categoryHref(id: CategoryId): string {
  if (id === "pc") return "/pcs-gaming";
  return `/componentes/${getCategory(id).slug}`;
}

export const componentCategories = categories.filter((c) => c.group === "componentes");
export const peripheralCategories = categories.filter((c) => c.group === "perifericos");

/** Las 8 tarjetas de la sección "¿Qué estás buscando?" */
export const homeCategoryTiles: { label: string; href: string; art: string; id?: CategoryId; caption: string }[] = [
  { label: "GPU", caption: "Tarjetas gráficas", href: "/componentes/gpu", art: "cat-gpu", id: "gpu" },
  { label: "CPU", caption: "Procesadores", href: "/componentes/cpu", art: "cat-cpu", id: "cpu" },
  { label: "Motherboards", caption: "Tarjetas madre", href: "/componentes/tarjetas-madre", art: "cat-motherboard", id: "motherboard" },
  { label: "RAM", caption: "Memoria DDR5 · DDR4", href: "/componentes/memoria-ram", art: "cat-ram", id: "ram" },
  { label: "SSD", caption: "Almacenamiento NVMe", href: "/componentes/almacenamiento", art: "cat-storage", id: "storage" },
  { label: "Gabinetes", caption: "ATX · Micro-ATX · ITX", href: "/componentes/gabinetes", art: "cat-case", id: "case" },
  { label: "Monitores", caption: "QHD · 4K · OLED", href: "/componentes/monitores", art: "cat-monitor", id: "monitor" },
  { label: "Periféricos", caption: "Teclados, mouse y audio", href: "/perifericos", art: "cat-peripherals" },
];
