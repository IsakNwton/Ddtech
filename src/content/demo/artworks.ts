/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  OBRAS DE DEMOSTRACIÓN
 * ─────────────────────────────────────────────────────────────────────────────
 *  Estas fichas y sus imágenes NO corresponden a obras reales del artista.
 *  Las imágenes se generaron por computadora (scripts/demo-art) solo para
 *  mostrar el funcionamiento de la galería.
 *
 *  Cómo reemplazarlas:
 *   1. Recomendado: conecte Supabase y cargue las obras desde el panel (/admin).
 *      Con Supabase activo, este archivo deja de usarse.
 *   2. Sin base de datos: coloque las fotografías en /public/obras/<slug>/ y
 *      edite estas fichas (cambie isDemo a false).
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { ArtImage, Artwork } from "@/lib/types";
import manifest from "./images.generated.json";
import { DEMO_ARTIST_NAME } from "./artist";

type ManifestEntry = Record<string, { src: string; width: number; height: number; color: string; blurDataURL: string }>;
const images = manifest as Record<string, ManifestEntry>;

function img(slug: string, key: string, alt: string, extra: Partial<ArtImage> = {}): ArtImage {
  const m = images[slug]?.[key];
  if (!m) throw new Error(`Falta la imagen de demostración ${slug}/${key}. Ejecute: node scripts/demo-art/generate.mjs`);
  return { ...m, alt, ...extra };
}

function gallery(slug: string, title: string): ArtImage[] {
  return [
    img(slug, "detalle-1", `Detalle de la pincelada de «${title}» (imagen de demostración)`, { kind: "detalle", caption: "Detalle de la superficie" }),
    img(slug, "detalle-2", `Segundo detalle de «${title}» (imagen de demostración)`, { kind: "detalle", caption: "Detalle de la composición" }),
    img(slug, "sala", `Simulación de «${title}» colgada en una sala (imagen de demostración)`, { kind: "sala", caption: "Simulación a escala en sala" }),
  ];
}

const STORY_PLACEHOLDER =
  "[Texto provisional] Este espacio está reservado para la historia de la obra contada por el artista: dónde nació la idea, qué lugar, persona o recuerdo la inspiró y cómo fue el proceso de pintarla.\n\nSe completará con información real. No se ha inventado ningún dato biográfico.";

type Seed = Omit<Artwork, "id" | "author" | "image" | "gallery" | "story" | "isDemo" | "status"> & { alt: string; story?: string };

const seeds: Seed[] = [
  {
    slug: "el-silencio-del-jardin",
    title: "El silencio del jardín",
    year: 2024,
    technique: "Óleo sobre lienzo",
    materials: "Óleo, médium de linaza, veladuras al barniz",
    support: "Lienzo de algodón sobre bastidor de madera",
    dimensions: { height: 80, width: 120, depth: 3.5 },
    collectionSlug: "naturaleza-y-memoria",
    style: "Paisaje expresivo",
    concept:
      "Una penumbra verde, densa y húmeda, se abre a la izquierda hacia una luz que no llega a mostrarse del todo. Sobre ella florecen pequeños estallidos de blanco, rosa pálido y ocre, como si el jardín respirara en voz baja.\n\nLa pincelada es corta y vibrante en las flores, larga y vertical en el follaje: dos ritmos que conviven sin imponerse, y que invitan a mirar despacio.",
    availability: "disponible",
    inventoryNumber: "DEMO-2024-001",
    certificate: { included: true, note: "Certificado de autenticidad firmado por el artista (ejemplo)." },
    price: { amount: 48000, currency: "MXN", visible: false },
    featured: true,
    order: 1,
    alt: "Pintura de demostración: jardín en penumbra verde con pequeñas flores blancas, rosas y ocres",
  },
  {
    slug: "marea-de-septiembre",
    title: "Marea de septiembre",
    year: 2023,
    technique: "Óleo sobre lienzo",
    materials: "Óleo y blanco de titanio en empaste",
    support: "Lienzo de lino sobre bastidor",
    dimensions: { height: 70, width: 105, depth: 3 },
    collectionSlug: "horizontes",
    style: "Marina contemporánea",
    concept:
      "El horizonte divide la tela casi por la mitad: arriba, un cielo bajo que se enciende en dorado justo antes del agua; abajo, un mar de verdes y azules que se quiebra en destellos.\n\nLa obra trabaja la luz reflejada como materia: pequeñas pinceladas de blanco cálido que parecen moverse cuando el espectador cambia de posición.",
    availability: "reservada",
    inventoryNumber: "DEMO-2023-002",
    certificate: { included: true, note: "Certificado de autenticidad (ejemplo)." },
    price: { amount: 42000, currency: "MXN", visible: false },
    featured: true,
    order: 2,
    alt: "Pintura de demostración: marina con cielo gris, franja dorada en el horizonte y mar verde azulado con destellos",
  },
  {
    slug: "llanura-en-ocre",
    title: "Llanura en ocre",
    year: 2022,
    technique: "Óleo sobre lino",
    materials: "Óleo, pigmentos tierra, cera fría",
    support: "Lino belga sobre bastidor",
    dimensions: { height: 60, width: 144, depth: 3 },
    collectionSlug: "horizontes",
    style: "Paisaje panorámico",
    concept:
      "Un formato apaisado, casi cinematográfico, para una llanura que se extiende sin límite. Las colinas lejanas se disuelven en violeta y un árbol solitario fija la mirada en el tercio derecho.\n\nEl ocre del campo se construye con cientos de trazos verticales: una superficie viva, movida por un viento que no se ve.",
    availability: "disponible",
    inventoryNumber: "DEMO-2022-003",
    certificate: { included: true },
    price: { amount: 56000, currency: "MXN", visible: true },
    featured: true,
    order: 3,
    alt: "Pintura de demostración: llanura panorámica en ocre con colinas violetas lejanas y un árbol solitario",
  },
  {
    slug: "niebla-sobre-el-valle",
    title: "Niebla sobre el valle",
    year: 2021,
    technique: "Acrílico y óleo sobre lienzo",
    materials: "Acrílico en capas de fondo, óleo en veladuras",
    support: "Lienzo de algodón",
    dimensions: { height: 110, width: 80, depth: 4 },
    collectionSlug: "naturaleza-y-memoria",
    style: "Paisaje atmosférico",
    concept:
      "Seis planos de montaña se superponen y se aclaran a medida que se alejan, separados por bandas de bruma. El formato vertical convierte el paisaje en una escala que la mirada sube despacio.\n\nEs una obra sobre la distancia y sobre aquello que se intuye más de lo que se ve.",
    availability: "vendida",
    inventoryNumber: "DEMO-2021-004",
    certificate: { included: true },
    price: null,
    featured: false,
    order: 4,
    alt: "Pintura de demostración vertical: capas de montañas gris azuladas separadas por franjas de niebla",
  },
  {
    slug: "bosque-en-invierno",
    title: "Bosque en invierno",
    year: 2020,
    technique: "Óleo sobre tabla entelada",
    materials: "Óleo, blanco de zinc, carga de mármol",
    support: "Tabla entelada",
    dimensions: { height: 100, width: 100, depth: 2.5 },
    collectionSlug: "naturaleza-y-memoria",
    style: "Paisaje",
    concept:
      "Troncos oscuros, verticales y cercanos, contra un fondo de nieve y cielo lechoso. Las sombras azules sobre el suelo marcan una luz baja, de tarde corta.\n\nEl formato cuadrado y el ritmo repetido de los árboles construyen una sensación de quietud casi musical.",
    availability: "coleccion-privada",
    inventoryNumber: "DEMO-2020-005",
    certificate: { included: true },
    price: null,
    featured: false,
    order: 5,
    alt: "Pintura de demostración cuadrada: bosque de troncos oscuros sobre nieve con sombras azules",
  },
  {
    slug: "nocturno-de-puerto",
    title: "Nocturno de puerto",
    year: 2023,
    technique: "Óleo sobre lienzo",
    materials: "Óleo, azul ultramar, veladuras de tierra",
    support: "Lienzo de lino",
    dimensions: { height: 92, width: 68, depth: 3 },
    collectionSlug: "horizontes",
    style: "Nocturno",
    concept:
      "Una luna pequeña y precisa ilumina un cielo profundo cuyas pinceladas giran a su alrededor. Abajo, la costa apenas se adivina por unas luces cálidas, y el reflejo traza una columna vertical sobre el agua.\n\nLa obra se sostiene en el contraste entre la inmensidad del azul y la intimidad de esas pocas luces.",
    availability: "disponible",
    inventoryNumber: "DEMO-2023-006",
    certificate: { included: true },
    price: { amount: 38000, currency: "MXN", visible: false },
    featured: true,
    order: 6,
    alt: "Pintura de demostración vertical: noche azul con luna llena, costa con pequeñas luces y reflejo en el agua",
  },
  {
    slug: "ventana-al-norte",
    title: "Ventana al norte",
    year: 2019,
    technique: "Óleo sobre lienzo",
    materials: "Óleo, ocres y tierras naturales",
    support: "Lienzo de algodón",
    dimensions: { height: 115, width: 90, depth: 3.5 },
    collectionSlug: "interiores-y-silencios",
    style: "Interior",
    concept:
      "Una habitación en penumbra recibe la luz fría de una ventana. Un jarrón azul descansa junto al vano y la luz se derrama sobre la mesa en manchas claras.\n\nMás que un espacio, la pintura retrata un tiempo: el de las horas lentas en las que la luz cambia y nadie la mira.",
    availability: "disponible",
    inventoryNumber: "DEMO-2019-007",
    certificate: { included: true },
    price: { amount: 52000, currency: "MXN", visible: false },
    featured: false,
    order: 7,
    alt: "Pintura de demostración: interior ocre en penumbra con una ventana luminosa y un jarrón azul",
  },
  {
    slug: "naturaleza-muerta-con-limones",
    title: "Naturaleza muerta con limones",
    year: 2018,
    technique: "Óleo sobre lienzo",
    materials: "Óleo, amarillo de cadmio, blanco de plomo sustituto",
    support: "Lienzo de lino",
    dimensions: { height: 60, width: 80, depth: 2.5 },
    collectionSlug: "interiores-y-silencios",
    style: "Naturaleza muerta",
    concept:
      "Cinco limones y un cuenco de cerámica azul sobre un mantel blanco, recortados contra un fondo oscuro. Un tema clásico abordado con economía: pocas formas, mucha luz.\n\nEl amarillo se construye con toques cortos que dan volumen sin dibujar contornos.",
    availability: "vendida",
    inventoryNumber: "DEMO-2018-008",
    certificate: { included: true },
    price: null,
    featured: false,
    order: 8,
    alt: "Pintura de demostración: limones amarillos y un cuenco azul sobre mantel blanco con fondo oscuro",
  },
  {
    slug: "rojo-de-memoria",
    title: "Rojo de memoria",
    year: 2017,
    technique: "Acrílico sobre lienzo",
    materials: "Acrílico en veladuras sucesivas",
    support: "Lienzo de algodón de gran formato",
    dimensions: { height: 120, width: 90, depth: 4 },
    collectionSlug: "interiores-y-silencios",
    style: "Abstracción cromática",
    concept:
      "Dos campos de color flotan sobre un fondo granate: un naranja encendido arriba y un carmín profundo abajo. Sus bordes, deliberadamente imprecisos, hacen que las formas parezcan respirar.\n\nEs una pintura para mirar de cerca y en silencio, dejando que el color actúe.",
    availability: "disponible",
    inventoryNumber: "DEMO-2017-009",
    certificate: { included: true },
    price: { amount: 61000, currency: "MXN", visible: true },
    featured: true,
    order: 9,
    alt: "Pintura de demostración vertical: dos rectángulos de color, naranja y carmín, sobre fondo granate",
  },
  {
    slug: "estudio-en-azul",
    title: "Estudio en azul",
    year: 2016,
    technique: "Técnica mixta sobre papel",
    materials: "Acrílico, pastel al óleo y grafito",
    support: "Papel de algodón 640 g, montado en bastidor",
    dimensions: { height: 90, width: 90 },
    collectionSlug: "interiores-y-silencios",
    style: "Abstracción gestual",
    concept:
      "Grandes arcos azules atraviesan un fondo marfil con la energía de un gesto rápido; un trazo ocre equilibra la composición. Las salpicaduras y los raspados dejan ver el proceso.\n\nUn estudio libre, donde el movimiento del brazo se convierte en forma.",
    availability: "no-disponible",
    inventoryNumber: "DEMO-2016-010",
    certificate: { included: false, note: "Obra de estudio: no incluye certificado (ejemplo)." },
    price: null,
    featured: false,
    order: 10,
    alt: "Pintura de demostración cuadrada: arcos azules y un trazo ocre sobre fondo marfil",
  },
];

export const demoArtworks: Artwork[] = seeds.map(({ alt, story, ...s }) => ({
  ...s,
  id: `demo-${s.slug}`,
  author: DEMO_ARTIST_NAME,
  story: story ?? STORY_PLACEHOLDER,
  image: img(s.slug, "principal", alt, { kind: "principal" }),
  gallery: gallery(s.slug, s.title),
  status: "publicada",
  isDemo: true,
}));
