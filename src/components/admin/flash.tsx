import { AlertTriangle, Check, Info } from "lucide-react";
import { cn } from "@/lib/cn";

const MESSAGES: Record<string, { tone: "ok" | "warn" | "info"; text: string }> = {
  guardado: { tone: "ok", text: "Cambios guardados." },
  publicada: { tone: "ok", text: "Listo: la obra está publicada y ya se ve en la galería." },
  borrador: { tone: "ok", text: "Guardada como borrador. La obra no se ve en la galería hasta que la publique." },
  despublicada: { tone: "ok", text: "La obra se ha retirado de la galería. Sigue guardada como borrador." },
  disponibilidad: { tone: "ok", text: "Disponibilidad actualizada." },
  orden: { tone: "ok", text: "Orden actualizado." },
  eliminada: { tone: "ok", text: "Eliminada correctamente." },
  "sin-foto": { tone: "warn", text: "No se puede publicar una obra sin fotografía principal. Ábrala con «Editar» y suba la foto." },
  demo: { tone: "info", text: "Modo demostración: este cambio no se ha guardado porque la base de datos todavía no está configurada." },
  error: { tone: "warn", text: "No se pudo completar la acción. Inténtelo de nuevo; si sigue fallando, avise a quien mantiene el sitio." },
  salida: { tone: "ok", text: "Ha cerrado la sesión correctamente." },
};

/** Avisos tras una acción, en lenguaje claro */
export function Flash({ code }: { code?: string | string[] }) {
  const key = Array.isArray(code) ? code[0] : code;
  const msg = key ? MESSAGES[key] : null;
  if (!msg) return null;
  const Icon = msg.tone === "ok" ? Check : msg.tone === "warn" ? AlertTriangle : Info;
  return (
    <div
      role={msg.tone === "warn" ? "alert" : "status"}
      className={cn(
        "mb-8 flex items-start gap-3 rounded-2xl border-2 px-5 py-4 text-lg",
        msg.tone === "ok" && "border-[#6f8f62]/50 bg-[#6f8f62]/10",
        msg.tone === "warn" && "border-[#a2574a]/50 bg-[#a2574a]/[0.08]",
        msg.tone === "info" && "border-gold/60 bg-gold/10",
      )}
    >
      <Icon className="mt-1 size-5 shrink-0" />
      <p>{msg.text}</p>
    </div>
  );
}
