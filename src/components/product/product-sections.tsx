import Link from "next/link";
import { Check, ChevronDown, MessageSquarePlus, ThumbsUp } from "lucide-react";
import type { DemoQuestion, DemoReview } from "@/data/reviews";
import type { ProductCompat } from "@/lib/product-compat";
import type { SpecGroup } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/rating";
import { DemoAction } from "./demo-action";

function SectionTitle({ id, children, aside }: { id: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 id={`${id}-title`} className="text-xl font-semibold tracking-[-0.02em] text-fg md:text-2xl">
        {children}
      </h2>
      {aside}
    </div>
  );
}

export function DescriptionSection({ description, features }: { description: string; features: string[] }) {
  return (
    <section id="descripcion" aria-labelledby="descripcion-title" className="scroll-mt-36">
      <SectionTitle id="descripcion">Descripción</SectionTitle>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <p className="max-w-prose text-pretty leading-relaxed text-fg-muted">{description}</p>
        {features.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-fg">Características</h3>
            <ul className="space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-fg-muted">
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function SpecsSection({ specs }: { specs: SpecGroup[] }) {
  return (
    <section id="especificaciones" aria-labelledby="especificaciones-title" className="scroll-mt-36">
      <SectionTitle id="especificaciones" aside={<span className="text-xs text-fg-subtle">Datos de referencia (demo). Verifica con el fabricante.</span>}>
        Especificaciones
      </SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {specs.map((g) => (
          <div key={g.title} className="overflow-hidden rounded-lg border border-line">
            <h3 className="border-b border-line bg-surface-2 px-4 py-2.5 font-mono text-2xs font-semibold uppercase tracking-[0.12em] text-fg-muted">
              {g.title}
            </h3>
            <dl className="divide-y divide-line">
              {g.rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 px-4 py-2.5 text-sm">
                  <dt className="text-fg-muted">{k}</dt>
                  <dd className="font-medium text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CompatSection({ compat, slug }: { compat: ProductCompat | null; slug: string }) {
  return (
    <section id="compatibilidad" aria-labelledby="compatibilidad-title" className="scroll-mt-36">
      <SectionTitle
        id="compatibilidad"
        aside={
          compat?.builderSlot ? (
            <Link href={`/arma-tu-pc?agregar=${slug}`} className="text-sm font-semibold text-brand-text hover:underline">
              Verificar con mi build →
            </Link>
          ) : undefined
        }
      >
        Compatibilidad
      </SectionTitle>
      {!compat ? (
        <p className="rounded-lg border border-line bg-surface p-5 text-sm text-fg-muted">
          Este producto no requiere verificación de compatibilidad con otros componentes.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-lg border border-line bg-surface p-5">
            <h3 className="text-sm font-semibold text-fg">Lo que necesitas saber</h3>
            <dl className="mt-3 space-y-3">
              {compat.requirements.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-2xs font-medium uppercase tracking-[0.08em] text-fg-subtle">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {compat.groups.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {compat.groups.map((g) => (
                <div key={g.title} className="rounded-lg border border-line bg-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-fg">{g.title}</h3>
                      {g.note && <p className="mt-0.5 text-xs text-fg-subtle">{g.note}</p>}
                    </div>
                    <Badge tone={g.total > 0 ? "success" : "danger"}>
                      {g.total}/{g.of}
                    </Badge>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {g.items.slice(0, 5).map((i) => (
                      <li key={i.slug} className="flex items-center gap-2 text-sm">
                        <Check className="size-3.5 shrink-0 text-success" strokeWidth={3} aria-hidden />
                        <Link href={`/producto/${i.slug}`} className="truncate text-fg-muted hover:text-fg">
                          {i.name}
                        </Link>
                      </li>
                    ))}
                    {g.items.length > 5 && <li className="pl-5.5 text-xs text-fg-subtle">y {g.items.length - 5} más</li>}
                    {g.items.length === 0 && <li className="text-sm text-fg-subtle">Sin coincidencias en el catálogo demo.</li>}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function ReviewsSection({ rating, count, distribution, reviews }: { rating: number; count: number; distribution: number[]; reviews: DemoReview[] }) {
  const max = Math.max(...distribution, 1);
  return (
    <section id="opiniones" aria-labelledby="opiniones-title" className="scroll-mt-36">
      <SectionTitle id="opiniones" aside={<DemoAction message="En producción se abriría el formulario de reseñas verificadas.">Escribir opinión</DemoAction>}>
        Opiniones
      </SectionTitle>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-end gap-3">
            <p className="tabular text-5xl font-semibold tracking-[-0.04em] text-fg">{rating.toFixed(1)}</p>
            <div className="pb-1.5">
              <Stars value={rating} size={16} />
              <p className="mt-1 text-xs text-fg-subtle">{formatNumber(count)} opiniones (demo)</p>
            </div>
          </div>
          <ul className="mt-5 space-y-1.5" aria-label="Distribución de calificaciones">
            {distribution.map((n, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs text-fg-muted">
                <span className="w-3 text-right tabular">{5 - i}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-4">
                  <span className="block h-full rounded-full bg-warning" style={{ width: `${(n / max) * 100}%` }} />
                </span>
                <span className="tabular w-8 text-right text-fg-subtle">{n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs text-fg-subtle">Opiniones de ejemplo con fines demostrativos.</p>
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-line bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Stars value={r.rating} />
                    <p className="text-sm font-semibold text-fg">{r.title}</p>
                  </div>
                  <p className="text-xs text-fg-subtle">{r.date}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{r.body}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-fg-subtle">
                  <span>{r.author}</span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="size-3.5" aria-hidden /> {r.helpful} útiles
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function QuestionsSection({ questions }: { questions: DemoQuestion[] }) {
  return (
    <section id="preguntas" aria-labelledby="preguntas-title" className="scroll-mt-36">
      <SectionTitle
        id="preguntas"
        aside={
          <DemoAction message="En producción la pregunta se enviaría al equipo de DDTech.">
            <MessageSquarePlus className="size-4" aria-hidden /> Hacer una pregunta
          </DemoAction>
        }
      >
        Preguntas frecuentes
      </SectionTitle>
      <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
        {questions.map((q) => (
          <li key={q.id}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                {q.q}
                <ChevronDown className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-open:rotate-180" aria-hidden />
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-fg-muted">{q.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
