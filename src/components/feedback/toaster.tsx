"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useUI, type ToastTone } from "@/store/ui";

const ICONS: Record<ToastTone, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismiss);
  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:items-end"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-lg border border-line-strong bg-surface-3/95 p-3.5 shadow-pop backdrop-blur-xl"
          >
            <Icon
              className={cn("mt-0.5 size-[18px] shrink-0", {
                default: "text-fg-muted",
                success: "text-success",
                warning: "text-warning",
                error: "text-danger",
              }[t.tone])}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-fg">{t.title}</p>
              {t.description && <p className="mt-0.5 truncate text-xs text-fg-muted">{t.description}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className="shrink-0 rounded-sm px-2 py-1 text-xs font-semibold text-brand-text hover:bg-brand-soft"
              >
                {t.action.label}
              </button>
            )}
            {t.href && (
              <Link href={t.href.to} onClick={() => dismiss(t.id)} className="shrink-0 rounded-sm px-2 py-1 text-xs font-semibold text-brand-text hover:bg-brand-soft">
                {t.href.label}
              </Link>
            )}
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Cerrar notificación" className="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-fg-subtle hover:text-fg">
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
