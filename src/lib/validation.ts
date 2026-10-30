import { z } from "zod";

export const REASONS = {
  adquisicion: "Adquisición de una obra",
  informacion: "Información sobre una obra",
  galeria: "Galerías y exposiciones",
  prensa: "Prensa o publicaciones",
  otro: "Otro motivo",
} as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Escriba su nombre (al menos 2 letras).").max(120, "El nombre es demasiado largo."),
  email: z.string().trim().email("Revise el correo electrónico; parece incompleto."),
  phone: z
    .string()
    .trim()
    .max(40, "El teléfono es demasiado largo.")
    .regex(/^[\d\s+().-]*$/, "Use solo números, espacios y los signos + ( ) -.")
    .optional()
    .or(z.literal("")),
  reason: z.enum(Object.keys(REASONS) as [keyof typeof REASONS, ...(keyof typeof REASONS)[]], { message: "Elija el motivo de su consulta." }),
  artwork: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Cuéntenos un poco más (al menos 10 caracteres).").max(4000, "El mensaje es demasiado largo (máximo 4000 caracteres)."),
  consent: z.literal("on", { message: "Necesitamos su autorización para responderle." }),
  // Campo trampa para bots: debe llegar vacío
  website: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof InquiryInput;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export type InquiryState = {
  status: "idle" | "success" | "error" | "not_configured";
  message?: string;
  errors?: FieldErrors;
  values?: Partial<Record<keyof InquiryInput, string>>;
  name?: string;
};
