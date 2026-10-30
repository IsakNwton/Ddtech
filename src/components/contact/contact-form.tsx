"use client";

import { AlertCircle, Check, ChevronDown, Loader2, Mail, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useId, useState, type ReactNode } from "react";
import { useQueryParams } from "@/hooks/use-query-state";
import { sendInquiry } from "@/lib/actions/contact";
import { cn } from "@/lib/cn";
import { EASE_GALLERY } from "@/lib/motion";
import { REASONS, fieldErrors, inquirySchema, type FieldErrors, type InquiryState } from "@/lib/validation";

type WorkOption = { slug: string; title: string; year: number; available: boolean };

export function ContactForm({ works, email, whatsapp }: { works: WorkOption[]; email: string | null; whatsapp: string | null }) {
  const [round, setRound] = useState(0);
  return <FormInner key={round} works={works} email={email} whatsapp={whatsapp} onReset={() => setRound((r) => r + 1)} />;
}

function FormInner({ works, email, whatsapp, onReset }: { works: WorkOption[]; email: string | null; whatsapp: string | null; onReset: () => void }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(sendInquiry, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [params] = useQueryParams();
  const preselected = params.get("obra") ?? "";
  const errors = { ...state.errors, ...clientErrors };
  const v = state.values ?? {};
  const presetWork = works.find((w) => w.slug === preselected);

  if (state.status === "success") {
    return (
      <motion.div
        className="glass glass-strong rounded-[2rem] px-6 py-14 text-center sm:px-12"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE_GALLERY }}
        role="status"
      >
        <motion.span
          className="mx-auto grid size-16 place-items-center rounded-full bg-ink text-paper"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
        >
          <Check className="size-7" strokeWidth={1.5} />
        </motion.span>
        <h3 className="mt-8 font-display text-4xl">Gracias, {state.name?.split(" ")[0]}</h3>
        <p className="mx-auto mt-4 max-w-md text-[1.0625rem] leading-relaxed text-muted-text">
          Su consulta se ha recibido correctamente. Le responderemos personalmente al correo indicado lo antes posible.
        </p>
        <button type="button" onClick={onReset} className="press mt-10 inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm hover:bg-ink/5">
          Enviar otra consulta
        </button>
      </motion.div>
    );
  }

  return (
    <form
      action={action}
      noValidate
      className="glass glass-strong rounded-[2rem] p-5 sm:p-9"
      onSubmit={(e) => {
        const fd = new FormData(e.currentTarget);
        const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
        const res = inquirySchema.safeParse({ ...raw, consent: raw.consent || undefined });
        if (!res.success) {
          e.preventDefault();
          const errs = fieldErrors(res.error);
          setClientErrors(errs);
          const first = Object.keys(errs)[0];
          if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
        } else setClientErrors({});
      }}
      onChange={(e) => {
        const name = (e.target as unknown as HTMLInputElement).name as keyof FieldErrors;
        if (clientErrors[name]) setClientErrors(({ [name]: _, ...rest }) => rest);
      }}
    >
      <AnimatePresence>
        {(state.status === "error" || state.status === "not_configured") && state.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div role="alert" className="mb-7 flex gap-3 rounded-2xl border border-[#a2574a]/30 bg-[#a2574a]/[0.07] px-5 py-4 text-sm leading-relaxed">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#a2574a]" strokeWidth={1.75} />
              <div>
                <p className="text-ink">{state.message}</p>
                {state.status === "not_configured" && (
                  <div className="mt-2 text-muted-text">
                    {email || whatsapp ? (
                      <p className="flex flex-wrap gap-x-5 gap-y-2">
                        Puede escribir directamente:
                        {email && (
                          <a className="inline-flex items-center gap-1.5 underline underline-offset-4" href={`mailto:${email}?subject=${encodeURIComponent("Consulta desde la galería")}&body=${encodeURIComponent(v.message ?? "")}`}>
                            <Mail className="size-3.5" /> {email}
                          </a>
                        )}
                        {whatsapp && (
                          <a className="inline-flex items-center gap-1.5 underline underline-offset-4" href={whatsapp} target="_blank" rel="noreferrer">
                            <MessageCircle className="size-3.5" /> WhatsApp
                          </a>
                        )}
                      </p>
                    ) : (
                      <p>Para activarlo, configure Supabase o Resend (ver README).</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nombre completo" name="name" error={errors.name}>
          {(p) => <input {...p} type="text" autoComplete="name" required defaultValue={v.name} className={inputClass(!!errors.name)} />}
        </Field>
        <Field label="Correo electrónico" name="email" error={errors.email}>
          {(p) => <input {...p} type="email" autoComplete="email" inputMode="email" required defaultValue={v.email} className={inputClass(!!errors.email)} />}
        </Field>
        <Field label="Teléfono" name="phone" optional error={errors.phone}>
          {(p) => <input {...p} type="tel" autoComplete="tel" inputMode="tel" defaultValue={v.phone} className={inputClass(!!errors.phone)} />}
        </Field>
        <Field label="Motivo de la consulta" name="reason" error={errors.reason}>
          {(p) => (
            <div className="relative">
              <select {...p} key={preselected ? "obra" : "general"} required defaultValue={v.reason ?? (preselected ? "adquisicion" : "")} className={cn(inputClass(!!errors.reason), "appearance-none pr-10")}>
                <option value="" disabled>
                  Elija una opción
                </option>
                {Object.entries(REASONS).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-text" aria-hidden />
            </div>
          )}
        </Field>
        <Field label="Obra de interés" name="artwork" optional error={errors.artwork} className="sm:col-span-2" hint={presetWork ? `Consulta sobre «${presetWork.title}»` : "Si su consulta es sobre una pintura concreta, selecciónela."}>
          {(p) => (
            <div className="relative">
              <select {...p} key={preselected} defaultValue={v.artwork ?? preselected} className={cn(inputClass(!!errors.artwork), "appearance-none pr-10")}>
                <option value="">Ninguna en particular</option>
                {works.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    {w.title} ({w.year}){w.available ? "" : " — no disponible"}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-text" aria-hidden />
            </div>
          )}
        </Field>
        <Field label="Mensaje" name="message" error={errors.message} className="sm:col-span-2">
          {(p) => (
            <textarea
              {...p}
              rows={6}
              required
              defaultValue={v.message}
              placeholder="Cuéntenos qué le interesa: una obra, una visita al taller, una exposición…"
              className={cn(inputClass(!!errors.message), "h-auto resize-y py-4 leading-relaxed")}
            />
          )}
        </Field>
      </div>

      {/* Trampa para bots (oculta a personas y lectores de pantalla) */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label>
          No completar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-7">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-text">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={Boolean(state.values)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-[1.125rem] shrink-0 cursor-pointer rounded accent-[var(--ink)]"
          />
          <span>Acepto que mis datos se utilicen únicamente para responder a esta consulta. No se compartirán con terceros.</span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-2 pl-8 text-sm text-[#a2574a]">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-text">La compra de obras comienza siempre como una solicitud de información. No se realizan pagos en línea.</p>
        <button
          type="submit"
          disabled={pending}
          className="press inline-flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-base font-medium text-paper shadow-[0_10px_30px_-12px_rgb(20_16_10/0.55)] hover:bg-ink-soft disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Enviando…
            </>
          ) : (
            "Enviar consulta"
          )}
        </button>
      </div>
    </form>
  );
}

const inputClass = (invalid: boolean) =>
  cn(
    "block h-14 w-full rounded-2xl border bg-paper/70 px-4 text-base text-ink placeholder:text-muted transition-[border-color,box-shadow] duration-300 focus:outline-none focus:ring-4",
    invalid ? "border-[#a2574a]/60 focus:border-[#a2574a] focus:ring-[#a2574a]/15" : "border-line-strong focus:border-ink/50 focus:ring-gold/20",
  );

function Field({
  label,
  name,
  error,
  optional,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  className?: string;
  children: (props: { id: string; name: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted-text">Opcional</span>}
      </label>
      {children({ id, name, "aria-invalid": !!error, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted-text">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#a2574a]">
          {error}
        </p>
      )}
    </div>
  );
}
