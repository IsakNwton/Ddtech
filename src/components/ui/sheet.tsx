"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useLockBody } from "@/hooks/use-lock-body";

/**
 * Panel modal basado en <dialog> nativo: trampa de foco, Escape, capa superior
 * y fondo inerte sin dependencias. Entra desde la derecha, izquierda o abajo.
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
  footer,
  className,
  hideHeader,
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left" | "bottom";
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  hideHeader?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useLockBody(open);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-0 max-h-none max-w-none overflow-clip bg-transparent p-0 text-fg backdrop:bg-black/60 backdrop:backdrop-blur-[2px] open:backdrop:animate-fade-in",
        side === "right" && "ml-auto h-dvh w-full sm:w-[440px]",
        side === "left" && "mr-auto h-dvh w-[88vw] max-w-[380px]",
        side === "bottom" && "mt-auto w-full",
      )}
    >
      {open && (
        <div
          className={cn(
            "flex flex-col border-line bg-surface shadow-pop",
            side === "right" && "h-full animate-slide-in-right border-l",
            side === "left" && "h-full animate-slide-in-left border-r",
            side === "bottom" && "max-h-[88dvh] animate-slide-in-up rounded-t-xl border-t",
            className,
          )}
        >
          {side === "bottom" && <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-surface-4" aria-hidden />}
          {!hideHeader && (
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-[-0.01em]">{title}</h2>
                {description && <div className="mt-0.5 text-xs text-fg-muted">{description}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="-mr-2 -mt-1 inline-flex size-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg"
              >
                <X className="size-4.5" />
              </button>
            </div>
          )}
          <div className="min-h-0 flex-auto overflow-y-auto overscroll-contain">{children}</div>
          {footer && <div className="shrink-0 border-t border-line bg-surface px-5 py-4 safe-bottom">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
