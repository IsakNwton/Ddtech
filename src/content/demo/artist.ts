/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PERFIL DEL ARTISTA — CONTENIDO PROVISIONAL
 * ─────────────────────────────────────────────────────────────────────────────
 *  Ningún dato de este archivo es real. Todos los textos están marcados entre
 *  corchetes para que se reconozcan como provisionales en el sitio.
 *  Con Supabase activo, la biografía se edita desde /admin/biografia.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { ArtistProfile } from "@/lib/types";

export const DEMO_ARTIST_NAME = "Nombre del Artista";

export const placeholderArtist: ArtistProfile = {
  name: DEMO_ARTIST_NAME,
  fullName: "[Nombre completo del artista]",
  tagline: "Arte que trasciende el tiempo",
  portrait: null,
  shortBio:
    "[Presentación provisional] Pintor dedicado a la pintura al óleo, el paisaje y la luz. Aquí irá una presentación breve, escrita con sus propias palabras o las de su familia.",
  biography:
    "[Trayectoria provisional] Este apartado contará la vida artística del pintor: dónde nació, cómo empezó a pintar, quiénes fueron sus maestros, qué etapas atravesó su obra y qué lugares la marcaron.\n\nPara que la biografía sea auténtica, se escribirá a partir de una conversación con el artista y de documentos reales —catálogos, recortes de prensa, fotografías— que la familia pueda aportar.\n\nMientras tanto, este texto sirve únicamente para mostrar cómo se verá la página.",
  philosophy:
    "[Filosofía creativa provisional] Aquí el artista explicará qué busca cuando pinta, qué significa para él la luz, el color o el silencio, y por qué vuelve una y otra vez a ciertos temas.",
  techniques: ["[Técnica favorita 1 — p. ej. óleo sobre lienzo]", "[Técnica favorita 2]", "[Técnica favorita 3]"],
  influences: ["[Influencia o maestro 1]", "[Influencia o movimiento 2]", "[Influencia o lugar 3]"],
  quote: {
    text: "[Aquí irá una cita real del artista sobre su manera de entender la pintura.]",
    context: "[Fuente o momento de la cita]",
  },
  timeline: [
    { year: "[Año]", title: "[Inicios]", text: "[Primeros pasos en la pintura: dónde y cómo empezó.]" },
    { year: "[Año]", title: "[Formación]", text: "[Estudios, talleres o maestros que lo formaron.]" },
    { year: "[Año]", title: "[Primera exposición]", text: "[Primera muestra pública de su obra.]" },
    { year: "[Año]", title: "[Etapa de madurez]", text: "[Período en que su lenguaje se consolida.]" },
    { year: "[Año]", title: "[Hoy]", text: "[Qué pinta y dónde trabaja actualmente.]" },
  ],
  exhibitions: [
    { year: "[Año]", title: "[Título de la exposición]", venue: "[Galería o museo]", city: "[Ciudad]", kind: "[Individual / colectiva]" },
    { year: "[Año]", title: "[Título de la exposición]", venue: "[Galería o museo]", city: "[Ciudad]", kind: "[Individual / colectiva]" },
    { year: "[Año]", title: "[Título de la exposición]", venue: "[Galería o museo]", city: "[Ciudad]", kind: "[Individual / colectiva]" },
  ],
  awards: [
    { year: "[Año]", title: "[Nombre del reconocimiento]", organization: "[Institución que lo otorgó]" },
    { year: "[Año]", title: "[Nombre del reconocimiento]", organization: "[Institución que lo otorgó]" },
  ],
  isPlaceholder: true,
};
