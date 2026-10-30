/** COLECCIONES DE DEMOSTRACIÓN — agrupan las obras de ejemplo. Se reemplazan desde /admin/colecciones. */
import type { Collection } from "@/lib/types";

export const demoCollections: Collection[] = [
  {
    id: "demo-naturaleza-y-memoria",
    slug: "naturaleza-y-memoria",
    title: "Naturaleza y memoria",
    subtitle: "Jardines, valles y bosques",
    description:
      "Paisajes que no buscan describir un lugar exacto, sino la sensación de haber estado en él. Jardines en penumbra, valles cubiertos de niebla y bosques en invierno: la naturaleza como espacio de recuerdo.\n\n[Descripción de demostración: se reemplazará por el texto de la colección real.]",
    period: "2020 — 2024",
    coverArtworkSlug: "el-silencio-del-jardin",
    order: 1,
    status: "publicada",
    isDemo: true,
  },
  {
    id: "demo-horizontes",
    slug: "horizontes",
    title: "Horizontes",
    subtitle: "Mar, llanura y noche",
    description:
      "La línea del horizonte como punto de partida: el mar al atardecer, una llanura sin límites, un puerto de noche. Obras sobre la distancia, la espera y la luz que cambia.\n\n[Descripción de demostración: se reemplazará por el texto de la colección real.]",
    period: "2022 — 2023",
    coverArtworkSlug: "marea-de-septiembre",
    order: 2,
    status: "publicada",
    isDemo: true,
  },
  {
    id: "demo-interiores-y-silencios",
    slug: "interiores-y-silencios",
    title: "Interiores y silencios",
    subtitle: "Habitaciones, objetos y color",
    description:
      "De la ventana a la mesa, del objeto al color puro. Una serie íntima que se mueve entre la naturaleza muerta y la abstracción, unida por la quietud.\n\n[Descripción de demostración: se reemplazará por el texto de la colección real.]",
    period: "2016 — 2019",
    coverArtworkSlug: "ventana-al-norte",
    order: 3,
    status: "publicada",
    isDemo: true,
  },
];
