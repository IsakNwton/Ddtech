import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tooltip ligero solo con CSS: aparece en hover y en foco de teclado.
 * El contenido también se expone como texto accesible vía aria-describedby/label en el disparador.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left";
  className?: string;
}) {
  return (
    <span className={cn("group/tt relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-60 rounded-sm border border-line-strong bg-surface-3 px-2 py-1 text-xs font-medium text-fg shadow-pop",
          "opacity-0 transition-[opacity,transform] delay-0 duration-150 group-hover/tt:opacity-100 group-hover/tt:delay-300 group-focus-within/tt:opacity-100",
          side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 group-hover/tt:translate-y-0 group-focus-within/tt:translate-y-0",
          side === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2 -translate-y-1 group-hover/tt:translate-y-0 group-focus-within/tt:translate-y-0",
          side === "left" && "right-full top-1/2 mr-2 -translate-y-1/2",
        )}
      >
        {content}
      </span>
    </span>
  );
}
