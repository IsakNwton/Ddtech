import { cn } from "@/lib/cn";
import { availabilityLabel } from "@/lib/format";
import type { Availability } from "@/lib/types";

const dot: Record<Availability, string> = {
  disponible: "bg-[#6f8f62]",
  reservada: "bg-gold",
  vendida: "bg-[#a2574a]",
  "coleccion-privada": "bg-muted",
  "no-disponible": "bg-muted/60",
};

export function AvailabilityBadge({ value, className, size = "sm" }: { value: Availability; className?: string; size?: "sm" | "md" }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-muted-text", size === "md" ? "text-sm" : "text-xs", className)}>
      <span className={cn("size-1.5 rounded-full", dot[value])} aria-hidden />
      {availabilityLabel[value]}
    </span>
  );
}

/** Identifica de forma visible las imágenes y fichas de demostración */
export function DemoBadge({ className, label = "Demo" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "glass-dark inline-flex h-6 items-center rounded-full px-2.5 text-[0.625rem] font-medium uppercase tracking-[0.16em]",
        className,
      )}
      title="Imagen de demostración generada por computadora. No es una obra del artista."
    >
      {label}
    </span>
  );
}
