/** Modelo de datos de la galería. Es el mismo para el contenido de demostración y para Supabase. */

export type Availability = "disponible" | "reservada" | "vendida" | "coleccion-privada" | "no-disponible";
export type PublishStatus = "publicada" | "borrador";
export type ImageKind = "principal" | "detalle" | "sala" | "proceso" | "reverso" | "otra";

export interface ArtImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  kind?: ImageKind;
  /** Color dominante: fondo mientras carga la imagen */
  color?: string;
  /** Miniatura difuminada (data URL) para la carga progresiva */
  blurDataURL?: string;
  /** Ruta dentro del bucket de Supabase, si la imagen se subió desde el panel */
  storagePath?: string;
}

export interface Dimensions {
  /** Alto en centímetros */
  height: number;
  /** Ancho en centímetros */
  width: number;
  /** Profundidad en centímetros (opcional) */
  depth?: number | null;
}

export interface Price {
  amount: number;
  currency: string;
  /** Si es falso, el sitio muestra «Precio a consultar» */
  visible: boolean;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  author: string;
  year: number;
  technique: string;
  materials: string;
  support: string;
  dimensions: Dimensions;
  collectionSlug: string | null;
  style: string;
  /** Descripción conceptual. Párrafos separados por una línea en blanco. */
  concept: string;
  /** Historia o inspiración. Párrafos separados por una línea en blanco. */
  story: string;
  availability: Availability;
  inventoryNumber: string;
  certificate: { included: boolean; note?: string };
  price: Price | null;
  image: ArtImage;
  gallery: ArtImage[];
  featured: boolean;
  status: PublishStatus;
  order: number;
  /** Registro de demostración: se muestra identificado como tal */
  isDemo: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  period: string;
  /** Obra cuya imagen sirve de portada */
  coverArtworkSlug: string | null;
  order: number;
  status: PublishStatus;
  isDemo: boolean;
}

export interface CollectionWithWorks extends Collection {
  works: Artwork[];
  cover: ArtImage | null;
}

export interface TimelineEntry {
  year: string;
  title: string;
  text: string;
}

export interface Exhibition {
  year: string;
  title: string;
  venue: string;
  city: string;
  kind: string;
}

export interface Award {
  year: string;
  title: string;
  organization: string;
}

export interface ArtistProfile {
  /** Nombre artístico (navegación, portada) */
  name: string;
  fullName: string;
  tagline: string;
  portrait: ArtImage | null;
  /** Presentación breve (portada, metadatos) */
  shortBio: string;
  biography: string;
  philosophy: string;
  techniques: string[];
  influences: string[];
  quote: { text: string; context: string };
  timeline: TimelineEntry[];
  exhibitions: Exhibition[];
  awards: Award[];
  /** Mientras sea verdadero, la web muestra el aviso de contenido provisional */
  isPlaceholder: boolean;
}

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  reason: string;
  artworkSlug: string | null;
  artworkTitle: string | null;
  message: string;
  status: "nueva" | "atendida";
}
