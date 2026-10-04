import type { CategoryId, Product } from "@/lib/types";

/**
 * Opiniones y preguntas DE EJEMPLO, generadas de forma determinista.
 * No son reseñas reales de clientes; en producción se conectarían a la plataforma de reseñas.
 */

export interface DemoReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  helpful: number;
}

export interface DemoQuestion {
  id: string;
  q: string;
  a: string;
}

const AUTHORS = ["Usuario de ejemplo A.", "Usuario de ejemplo M.", "Usuario de ejemplo J.", "Usuario de ejemplo R."];

const REVIEW_TEMPLATES: Partial<Record<CategoryId, { title: string; body: string }[]>> = {
  gpu: [
    { title: "Gran salto de rendimiento", body: "Ejemplo de reseña: buen rendimiento en juegos actuales y temperaturas controladas. El tamaño requiere revisar el gabinete." },
    { title: "Silenciosa en uso diario", body: "Ejemplo de reseña: en escritorio los ventiladores casi no giran. Bajo carga se escucha, pero sin molestar." },
    { title: "Revisen su fuente", body: "Ejemplo de reseña: funciona perfecto, solo hay que confirmar la potencia y los conectores de la fuente." },
  ],
  cpu: [
    { title: "Excelente para jugar", body: "Ejemplo de reseña: muy buen rendimiento por núcleo y fácil de enfriar con un disipador de torre." },
    { title: "Plataforma con futuro", body: "Ejemplo de reseña: la plataforma permite actualizar más adelante sin cambiar tarjeta madre." },
    { title: "Recomendado", body: "Ejemplo de reseña: instalación sencilla y temperaturas dentro de lo esperado." },
  ],
};

const GENERIC_REVIEWS = [
  { title: "Cumple lo prometido", body: "Ejemplo de reseña: el producto llegó bien empacado y funciona según lo descrito." },
  { title: "Buena relación calidad-precio", body: "Ejemplo de reseña: buena construcción y desempeño para su rango de precio." },
  { title: "Lo volvería a comprar", body: "Ejemplo de reseña: instalación sencilla, sin problemas hasta ahora." },
];

const QUESTIONS: Partial<Record<CategoryId, DemoQuestion[]>> = {
  gpu: [
    { id: "q1", q: "¿Qué fuente de poder necesito?", a: "Consulta la sección Compatibilidad: indicamos la potencia recomendada y el tipo de conector. En Arma tu PC lo verificamos automáticamente." },
    { id: "q2", q: "¿Cabe en mi gabinete?", a: "Compara el largo de la tarjeta con el largo máximo de GPU que admite tu gabinete. El configurador te avisa si el espacio es justo." },
  ],
  cpu: [
    { id: "q1", q: "¿Incluye disipador?", a: "Lo indicamos en Especificaciones → Disipador incluido. Si no lo incluye, el configurador te lo recordará." },
    { id: "q2", q: "¿Qué tarjeta madre es compatible?", a: "En Compatibilidad listamos tarjetas madre con el mismo socket y tipo de memoria." },
  ],
};

const GENERIC_QUESTIONS: DemoQuestion[] = [
  { id: "g1", q: "¿Cuenta con garantía?", a: "Respuesta pendiente: DDTech debe proporcionar su política de garantía oficial." },
  { id: "g2", q: "¿Cuánto tarda el envío?", a: "Respuesta pendiente: los tiempos y la cobertura de envío deben confirmarse con DDTech." },
];

function seededInt(seed: string, mod: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % mod;
}

export function getReviews(p: Product): DemoReview[] {
  const list = REVIEW_TEMPLATES[p.category] ?? GENERIC_REVIEWS;
  return list.map((t, i) => ({
    id: `${p.id}-r${i}`,
    author: AUTHORS[(seededInt(p.id, 4) + i) % AUTHORS.length],
    rating: i === 2 ? 4 : 5,
    title: t.title,
    body: t.body,
    date: ["hace 2 semanas", "hace 1 mes", "hace 3 meses"][i],
    helpful: 3 + seededInt(p.id + i, 40),
  }));
}

/** Distribución por estrellas coherente con el promedio y el total */
export function ratingDistribution(p: Product): number[] {
  const avg = p.rating;
  const weights = [5, 4, 3, 2, 1].map((s) => Math.exp(-Math.pow(s - avg, 2) * 1.6));
  const total = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.round((w / total) * p.reviews));
  return counts;
}

export function getQuestions(p: Product): DemoQuestion[] {
  return [...(QUESTIONS[p.category] ?? []), ...GENERIC_QUESTIONS].slice(0, 4);
}
