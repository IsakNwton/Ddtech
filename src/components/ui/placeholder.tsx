import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Marca visualmente contenido que DDTech debe confirmar (políticas, tiempos, métodos de pago…).
 * Nunca se inventan datos corporativos: se muestran como placeholder.
 */
export function Placeholder({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xs border border-dashed border-warning/40 bg-warning-soft px-1.5 py-px text-2xs font-medium text-warning",
        className,
      )}
    >
      {children ?? "Placeholder"}
    </span>
  );
}

export function DemoTag({ className, children = "Precio demo" }: { className?: string; children?: ReactNode }) {
  return (
    <span className={cn("text-[10.5px] font-medium text-fg-subtle", className)}>{children}</span>
  );
}
