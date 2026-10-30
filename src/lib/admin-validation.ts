import { z } from "zod";
import type { ArtImage } from "./types";

const AVAILABILITY = ["disponible", "reservada", "vendida", "coleccion-privada", "no-disponible"] as const;
const IMAGE_KINDS = ["principal", "detalle", "sala", "proceso", "reverso", "otra"] as const;

const optionalNumber = (msg: string) =>
  z
    .string()
    .trim()
    .transform((v) => v.replace(",", "."))
    .refine((v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0), msg)
    .transform((v) => (v === "" ? null : Number(v)));

export const imageSchema = z.object({
  src: z.string().url().or(z.string().startsWith("/")),
  width: z.number().positive(),
  height: z.number().positive(),
  alt: z.string().max(400).default(""),
  caption: z.string().max(200).optional(),
  kind: z.enum(IMAGE_KINDS).optional(),
  color: z.string().max(20).optional(),
  blurDataURL: z.string().max(4000).optional(),
  storagePath: z.string().max(300).optional(),
});

const jsonOf = <T extends z.ZodTypeAny>(schema: T) =>
  z.string().transform((s, ctx) => {
    if (!s) return null;
    try {
      const parsed = schema.safeParse(JSON.parse(s));
      if (parsed.success) return parsed.data as z.infer<T>;
    } catch {}
    ctx.addIssue({ code: "custom", message: "Las fotografías no se pudieron leer. Vuelva a subirlas." });
    return z.NEVER;
  });

const thisYear = new Date().getFullYear();

export const artworkFormSchema = z.object({
  id: z.string().optional(),
  intent: z.enum(["draft", "publish"]),
  title: z.string().trim().min(1, "Escriba el título de la obra.").max(160),
  year: z.coerce.number({ message: "Escriba el año con números." }).int("Escriba el año con números.").min(1900, "Revise el año.").max(thisYear + 1, "Revise el año."),
  technique: z.string().trim().min(1, "Indique la técnica (por ejemplo: Óleo sobre lienzo).").max(120),
  materials: z.string().trim().max(300).default(""),
  support: z.string().trim().max(200).default(""),
  height: z.coerce.number({ message: "Escriba el alto en centímetros." }).positive("Escriba el alto en centímetros."),
  width: z.coerce.number({ message: "Escriba el ancho en centímetros." }).positive("Escriba el ancho en centímetros."),
  depth: optionalNumber("La profundidad debe ser un número."),
  collectionId: z.string().trim().default(""),
  style: z.string().trim().max(120).default(""),
  concept: z.string().trim().max(6000).default(""),
  story: z.string().trim().max(6000).default(""),
  availability: z.enum(AVAILABILITY, { message: "Elija la disponibilidad." }),
  inventoryNumber: z.string().trim().max(60).default(""),
  certificateIncluded: z.preprocess((v) => v === "on", z.boolean()),
  certificateNote: z.string().trim().max(300).default(""),
  priceAmount: optionalNumber("El precio debe ser un número, sin puntos ni símbolos."),
  priceCurrency: z.string().trim().length(3).default("MXN"),
  priceVisible: z.preprocess((v) => v === "on", z.boolean()),
  featured: z.preprocess((v) => v === "on", z.boolean()),
  image: jsonOf(imageSchema),
  gallery: jsonOf(z.array(imageSchema).max(24)),
});

export type ArtworkFormErrors = Partial<Record<keyof z.infer<typeof artworkFormSchema>, string>>;

export const collectionFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Escriba el nombre de la colección.").max(120),
  subtitle: z.string().trim().max(160).default(""),
  description: z.string().trim().max(4000).default(""),
  period: z.string().trim().max(60).default(""),
  coverArtworkId: z.string().trim().default(""),
  published: z.preprocess((v) => v === "on", z.boolean()),
});

const lines = (max: number) =>
  z
    .string()
    .default("")
    .transform((s) =>
      s
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, max),
    );

export const artistFormSchema = z.object({
  name: z.string().trim().min(1, "Escriba el nombre artístico.").max(80),
  fullName: z.string().trim().max(160).default(""),
  tagline: z.string().trim().max(160).default(""),
  shortBio: z.string().trim().max(800).default(""),
  biography: z.string().trim().max(12000).default(""),
  philosophy: z.string().trim().max(6000).default(""),
  quoteText: z.string().trim().max(600).default(""),
  quoteContext: z.string().trim().max(160).default(""),
  techniques: lines(20),
  influences: lines(20),
  timeline: jsonOf(z.array(z.object({ year: z.string().max(20), title: z.string().max(160), text: z.string().max(1000) })).max(60)),
  exhibitions: jsonOf(
    z.array(z.object({ year: z.string().max(20), title: z.string().max(200), venue: z.string().max(200), city: z.string().max(120), kind: z.string().max(60) })).max(100),
  ),
  awards: jsonOf(z.array(z.object({ year: z.string().max(20), title: z.string().max(200), organization: z.string().max(200) })).max(60)),
  portrait: jsonOf(imageSchema),
});

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export function firstErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of error.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}

export type UploadedImage = ArtImage;
