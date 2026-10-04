import { AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CompatLevel } from "@/lib/types";

const META: Record<CompatLevel, { label: string; icon: typeof Check; cls: string }> = {
  ok: { label: "Compatible", icon: Check, cls: "text-success bg-success-soft ring-success/25" },
  warn: { label: "Revisar", icon: AlertTriangle, cls: "text-warning bg-warning-soft ring-warning/25" },
  error: { label: "No compatible", icon: X, cls: "text-danger bg-danger-soft ring-danger/25" },
};

export function CompatBadge({ level, label, className }: { level: CompatLevel; label?: string; className?: string }) {
  const m = META[level];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-sm px-2 text-xs font-semibold ring-1 ring-inset",
        m.cls,
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.6} aria-hidden />
      {label ?? m.label}
    </span>
  );
}

export function CompatIcon({ level, className }: { level: CompatLevel; className?: string }) {
  const m = META[level];
  const Icon = m.icon;
  return (
    <span className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset", m.cls, className)} aria-label={m.label}>
      <Icon className="size-3" strokeWidth={3} aria-hidden />
    </span>
  );
}
