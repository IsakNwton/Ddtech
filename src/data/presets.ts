import type { BuildPreset } from "@/lib/types";

/**
 * Builds recomendadas (configuraciones de ejemplo).
 * Todas las combinaciones pasan el verificador de compatibilidad.
 */
export const buildPresets: BuildPreset[] = [
  {
    id: "economica",
    name: "PC Gaming económica",
    tagline: "Para empezar a jugar sin gastar de más",
    target: "eSports y 1080p",
    parts: {
      cpu: "amd-ryzen-5-5600",
      motherboard: "gigabyte-b550m-ds3h",
      ram: "kingston-fury-beast-16gb-2x8gb-ddr4-3200-cl16",
      gpu: "intel-arc-b580-limited-edition-12gb",
      storage: "kingston-nv3-1tb-nvme-m-2",
      psu: "msi-mag-a650bn-650w-80-plus-bronze",
      case: "cooler-master-masterbox-q300l",
    },
  },
  {
    id: "1080p",
    name: "PC Gaming 1080p",
    tagline: "Altas tasas de cuadros en Full HD",
    target: "1080p alto",
    parts: {
      cpu: "amd-ryzen-5-7600",
      motherboard: "asrock-b650m-pro-rs-wifi",
      ram: "kingston-fury-beast-32gb-2x16gb-ddr5-6000-cl30",
      gpu: "msi-geforce-rtx-5060-ti-16g-ventus-2x-oc",
      storage: "kingston-nv3-1tb-nvme-m-2",
      psu: "msi-mag-a650bn-650w-80-plus-bronze",
      case: "nzxt-h5-flow-2024-blanco",
    },
  },
  {
    id: "1440p",
    name: "PC Gaming 1440p",
    tagline: "El punto ideal entre calidad y fluidez",
    target: "1440p ultra",
    parts: {
      cpu: "amd-ryzen-7-9700x",
      motherboard: "gigabyte-b650m-aorus-elite-ax",
      ram: "corsair-vengeance-rgb-32gb-2x16gb-ddr5-6000-cl36",
      gpu: "asus-tuf-gaming-geforce-rtx-5070-12gb-oc",
      storage: "samsung-990-pro-1tb-nvme-m-2",
      psu: "corsair-rm750e-750w-80-plus-gold-atx-3-1",
      case: "lian-li-lancool-216-negro",
      cooling: "thermalright-peerless-assassin-120-se",
    },
  },
  {
    id: "4k",
    name: "PC Gaming 4K",
    tagline: "Máximo detalle con trazado de rayos",
    target: "4K y 1440p alta frecuencia",
    parts: {
      cpu: "amd-ryzen-7-9800x3d",
      motherboard: "msi-mag-x870-tomahawk-wifi",
      ram: "kingston-fury-beast-32gb-2x16gb-ddr5-6000-cl30",
      gpu: "asus-rog-astral-geforce-rtx-5080-16gb-oc",
      storage: "wd-black-sn850x-2tb-nvme-m-2",
      psu: "corsair-rm850x-850w-80-plus-gold-atx-3-1",
      case: "lian-li-o11-dynamic-evo-blanco",
      cooling: "arctic-liquid-freezer-iii-pro-360",
    },
  },
  {
    id: "streaming",
    name: "PC Streaming",
    tagline: "Juega y transmite desde un solo equipo",
    target: "Juego + transmisión",
    parts: {
      cpu: "intel-core-ultra-7-265k",
      motherboard: "asus-prime-b860m-a-wifi",
      ram: "corsair-vengeance-rgb-32gb-2x16gb-ddr5-6000-cl36",
      gpu: "msi-geforce-rtx-5070-ti-16g-gaming-trio-oc",
      storage: "samsung-990-pro-2tb-nvme-m-2",
      psu: "corsair-rm850x-850w-80-plus-gold-atx-3-1",
      case: "corsair-4000d-airflow-negro",
      cooling: "nzxt-kraken-240-2024",
    },
  },
  {
    id: "workstation",
    name: "PC Workstation",
    tagline: "Render, edición y desarrollo sin esperas",
    target: "Creación y productividad",
    parts: {
      cpu: "amd-ryzen-9-9950x",
      motherboard: "asus-tuf-gaming-b650-plus-wifi",
      ram: "g-skill-trident-z5-neo-rgb-64gb-2x32gb-ddr5-6000-cl30",
      gpu: "zotac-gaming-geforce-rtx-5070-ti-solid-16gb",
      storage: "crucial-t705-2tb-nvme-m-2-gen5",
      psu: "be-quiet-pure-power-12-m-850w-80-plus-gold",
      case: "hyte-y60-negro",
      cooling: "arctic-liquid-freezer-iii-pro-360",
    },
  },
];

export function getPreset(id: string) {
  return buildPresets.find((p) => p.id === id);
}
