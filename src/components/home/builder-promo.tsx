import Image from "next/image";
import { ArrowRight, Check, Cpu, Gauge, ShieldCheck, Zap } from "lucide-react";
import type { PresetSummary } from "@/data/builds";
import { formatPrice } from "@/lib/format";
import { BUILD_STEPS } from "@/lib/compatibility";
import { ButtonLink } from "@/components/ui/button";

/** Bloque que vende el diferenciador: el configurador con verificación de compatibilidad */
export function BuilderPromo({ example }: { example: PresetSummary }) {
  return (
    <section aria-labelledby="builder-promo" className="container-page">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_0%_100%,rgb(47_95_240/0.16),transparent_60%)]" aria-hidden />
        <div className="relative grid gap-10 p-5 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:p-14 [&>*]:min-w-0">
          <div className="flex flex-col">
            <p className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-brand-text">Arma tu PC</p>
            <h2 id="builder-promo" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-[2.5rem] sm:leading-[1.05]">
              Arma tu PC sin miedo a equivocarte.
            </h2>
            <p className="mt-4 max-w-md text-pretty text-fg-muted">
              Ocho pasos guiados. Solo te mostramos piezas compatibles y te avisamos antes de que algo no encaje.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, t: "Compatibilidad en tiempo real", d: "Socket, memoria, formato y espacio." },
                { icon: Zap, t: "Potencia calculada", d: "Consumo estimado y fuente recomendada." },
                { icon: Gauge, t: "Rendimiento estimado", d: "1080p, 1440p y 4K de un vistazo." },
                { icon: Cpu, t: "Un clic al carrito", d: "Agrega toda tu build de una vez." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-brand-text">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">{t}</span>
                    <span className="block text-xs text-fg-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/arma-tu-pc" size="lg" className="uppercase tracking-[0.04em]">
                Empezar a armar <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href={`/arma-tu-pc?preset=${example.preset.id}`} size="lg" variant="ghost">
                Partir de una build recomendada
              </ButtonLink>
            </div>
          </div>

          {/* Vista previa del resumen del configurador */}
          <div className="rounded-lg border border-line-strong bg-bg/60 p-4 shadow-pop backdrop-blur sm:p-5" aria-label="Vista previa del configurador">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <p className="text-sm font-semibold text-fg">Tu PC</p>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-success-soft px-2 py-1 text-xs font-semibold text-success">
                <Check className="size-3.5" strokeWidth={3} aria-hidden /> Todo compatible
              </span>
            </div>
            <ol className="divide-y divide-line">
              {BUILD_STEPS.map((s, i) => {
                const part = example.parts.find((p) => p.slot === s.slot);
                return (
                  <li key={s.slot} className="flex items-center gap-3 py-2.5">
                    <span className="tabular grid size-6 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[10px] font-semibold text-fg-muted">{i + 1}</span>
                    {part ? (
                      <span className="stage size-9 shrink-0 overflow-hidden rounded-sm border border-line">
                        <Image src={part.image} alt="" width={36} height={27} unoptimized className="size-full object-contain p-0.5" />
                      </span>
                    ) : (
                      <span className="size-9 shrink-0 rounded-sm border border-dashed border-line-strong" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-2xs uppercase tracking-[0.08em] text-fg-subtle">{s.label}</span>
                      <span className="block truncate text-xs text-fg">{part ? `${part.brand} ${part.name}` : "Usa el disipador incluido"}</span>
                    </span>
                    {part && <Check className="size-4 shrink-0 text-success" strokeWidth={2.6} aria-label="Compatible" />}
                  </li>
                );
              })}
            </ol>
            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-4 text-xs">
              <div>
                <dt className="text-fg-subtle">Consumo</dt>
                <dd className="tabular text-base font-semibold text-fg">{example.watts} W</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">Fuente rec.</dt>
                <dd className="tabular text-base font-semibold text-fg">{example.psu} W+</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">Total demo</dt>
                <dd className="tabular text-base font-semibold text-fg">{formatPrice(example.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
