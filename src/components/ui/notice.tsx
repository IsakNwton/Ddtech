import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Aviso discreto para contenido provisional o funciones pendientes de configurar */
export function Notice({ title, children, className, tone = "info" }: { title: string; children?: ReactNode; className?: string; tone?: "info" | "warning" }) {
  return (
    <div
      role="note"
      className={cn(
        "glass flex gap-3.5 rounded-2xl px-5 py-4 text-sm leading-relaxed",
        tone === "warning" && "border-gold/50",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-gold-ink" aria-hidden />
      <div>
        <p className="font-medium text-ink">{title}</p>
        {children && <div className="mt-1 text-muted-text">{children}</div>}
      </div>
    </div>
  );
}
