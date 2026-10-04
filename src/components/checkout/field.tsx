import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  error,
  hint,
  className,
  id,
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode; children?: ReactNode }) {
  const errId = error ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm text-fg-muted">
        {label}
        {props.required && <span className="text-fg-subtle"> *</span>}
      </label>
      {children ?? (
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={errId}
          className={cn(
            "mt-1.5 h-11 w-full rounded-md border bg-surface-2 px-3 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:outline-none",
            error ? "border-danger/60 focus:border-danger" : "border-line-strong focus:border-brand-line",
          )}
          {...props}
        />
      )}
      {error ? (
        <p id={errId} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-fg-subtle">{hint}</p>
      )}
    </div>
  );
}
