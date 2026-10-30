"use client";

import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

/** Controles del panel: grandes, de alto contraste y con textos claros */

export const adminInput =
  "block w-full rounded-xl border-2 border-line-strong bg-paper px-4 py-3.5 text-lg text-ink placeholder:text-muted transition-colors focus:border-ink focus:outline-none focus:ring-4 focus:ring-gold/25 aria-[invalid=true]:border-[#a2574a]";

export function AdminField({
  label,
  hint,
  error,
  htmlFor,
  optional,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex flex-wrap items-baseline gap-x-3 text-lg font-medium text-ink">
        {label}
        {optional && <span className="text-sm font-normal text-muted-text">(opcional)</span>}
      </label>
      {hint && <p className="-mt-1 mb-2.5 text-base leading-snug text-muted-text">{hint}</p>}
      {children}
      {error && (
        <p className="mt-2 flex items-center gap-2 text-base font-medium text-[#a2574a]" role="alert">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

export function AdminSection({ step, title, description, children }: { step?: number; title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:p-8">
      <header className="mb-7 flex items-start gap-4">
        {step !== undefined && (
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-display text-xl text-paper" aria-hidden>
            {step}
          </span>
        )}
        <div>
          <h2 className="font-display text-3xl leading-tight">{title}</h2>
          {description && <p className="mt-1 text-base text-muted-text">{description}</p>}
        </div>
      </header>
      <div className="space-y-7">{children}</div>
    </section>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Guardando…",
  variant = "primary",
  name,
  value,
  className,
  disabled,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  name?: string;
  value?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { pending, data } = useFormStatus();
  const mine = pending && (!name || data?.get(name) === value);
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending || disabled}
      className={cn(
        "press inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl px-7 text-lg font-medium disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-ink text-paper hover:bg-ink-soft",
        variant === "secondary" && "border-2 border-ink/80 bg-paper text-ink hover:bg-ink/5",
        variant === "danger" && "border-2 border-[#a2574a] text-[#a2574a] hover:bg-[#a2574a]/10",
        className,
      )}
    >
      {mine ? (
        <>
          <Loader2 className="size-5 animate-spin" /> {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Botón que pide confirmación antes de acciones irreversibles */
export function ConfirmSubmit({ label, confirmLabel, question, className }: { label: ReactNode; confirmLabel: string; question: string; className?: string }) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className={cn("press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-[#a2574a]/70 px-5 text-base font-medium text-[#a2574a] hover:bg-[#a2574a]/10", className)}
      >
        {label}
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-[#a2574a]/40 bg-[#a2574a]/[0.06] p-3" role="alertdialog" aria-label={question}>
      <p className="text-base font-medium text-ink">{question}</p>
      <SubmitButton variant="danger" pendingLabel="Eliminando…" className="min-h-12 px-5 text-base">
        {confirmLabel}
      </SubmitButton>
      <button type="button" onClick={() => setAsking(false)} className="press min-h-12 rounded-xl px-5 text-base underline underline-offset-4">
        No, cancelar
      </button>
    </div>
  );
}

export function FormMessage({ status, message }: { status: "idle" | "success" | "error"; message?: string }) {
  if (!message || status === "idle") return null;
  const ok = status === "success";
  return (
    <div
      role={ok ? "status" : "alert"}
      className={cn(
        "flex items-start gap-3 rounded-2xl border-2 px-5 py-4 text-lg",
        ok ? "border-[#6f8f62]/50 bg-[#6f8f62]/10 text-ink" : "border-[#a2574a]/50 bg-[#a2574a]/[0.08] text-ink",
      )}
    >
      {ok ? <Check className="mt-1 size-5 shrink-0 text-[#4f6e44]" /> : <AlertTriangle className="mt-1 size-5 shrink-0 text-[#a2574a]" />}
      <p>{message}</p>
    </div>
  );
}

export function Toggle({ name, defaultChecked, label, hint }: { name: string; defaultChecked?: boolean; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-line p-4 transition-colors has-[:checked]:border-ink/60 has-[:checked]:bg-ink/[0.03]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 size-6 shrink-0 cursor-pointer accent-[var(--ink)]" />
      <span>
        <span className="block text-lg font-medium">{label}</span>
        {hint && <span className="mt-0.5 block text-base text-muted-text">{hint}</span>}
      </span>
    </label>
  );
}
