"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronUp, Link2, RotateCcw, Save, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { BUILD_STEPS, checkCandidate, type CandidateCheck } from "@/lib/compatibility";
import { formatPrice, normalize } from "@/lib/format";
import { relevance } from "@/lib/filters";
import type { BuildSelection, BuildSlot, BuilderPart } from "@/lib/types";
import { useHydrated } from "@/hooks/use-hydrated";
import { useBuilder } from "@/store/builder";
import { useCart } from "@/store/cart";
import { toast, useUI } from "@/store/ui";
import { Button } from "@/components/ui/button";
import { CompatIcon } from "@/components/ui/compat";
import { Sheet } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { BuilderStepper } from "./builder-stepper";
import { BuildSummary } from "./build-summary";
import { OptionCard } from "./option-card";
import { stepContext } from "./step-context";
import { useResolvedBuild } from "./use-build";

type SortKey = "recomendado" | "precio-asc" | "precio-desc" | "rendimiento";

const LEVEL_ORDER = { ok: 0, warn: 1, error: 2 } as const;

function perfScore(p: BuilderPart): number {
  const t = p.tech;
  if (t.kind === "gpu") return t.perf;
  if (t.kind === "cpu") return t.gaming + t.productivity;
  if (t.kind === "ram") return t.capacityGb * 10 + t.speed / 100;
  if (t.kind === "storage") return t.readMb;
  if (t.kind === "psu") return t.watts;
  if (t.kind === "cooling") return t.tdpRating;
  return p.rating * 10;
}

export interface PresetLite {
  id: string;
  name: string;
  parts: BuildSelection;
}

export function PcBuilder({ parts, presets }: { parts: BuilderPart[]; presets: PresetLite[] }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const selection = useBuilder((s) => s.selection);
  const select = useBuilder((s) => s.select);
  const clearSlot = useBuilder((s) => s.clearSlot);
  const load = useBuilder((s) => s.load);
  const save = useBuilder((s) => s.save);
  const addMany = useCart((s) => s.addMany);
  const openCart = useUI((s) => s.openCart);

  const partsById = useMemo(() => new Map(parts.map((p) => [p.id, p])), [parts]);
  const state = useResolvedBuild(selection, partsById);

  const [active, setActive] = useState<BuildSlot>("cpu");
  const [compatOnly, setCompatOnly] = useState(true);
  const [sort, setSort] = useState<SortKey>("recomendado");
  const [query, setQuery] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const optionsTop = useRef<HTMLDivElement>(null);
  const handledParams = useRef(false);

  // Parámetros de URL: ?preset=, ?agregar=, ?b= (build compartida)
  useEffect(() => {
    if (!hydrated || handledParams.current) return;
    handledParams.current = true;
    const preset = params.get("preset");
    const add = params.get("agregar");
    const shared = params.get("b");
    let next: BuildSlot | null = null;
    if (preset) {
      const p = presets.find((x) => x.id === preset);
      if (p) {
        load(p.parts);
        toast({ title: `Build "${p.name}" cargada`, description: "Personalízala paso a paso.", tone: "success" });
        next = "cpu";
      }
    } else if (shared) {
      const sel: BuildSelection = {};
      for (const pair of shared.split("~")) {
        const [slot, id] = pair.split(".");
        if (BUILD_STEPS.some((s) => s.slot === slot) && partsById.has(id)) sel[slot as BuildSlot] = id;
      }
      load(sel);
      toast({ title: "Build compartida cargada", tone: "success" });
    } else if (add) {
      const part = partsById.get(add);
      if (part) {
        const slot = part.category as BuildSlot;
        select(slot, part.id);
        toast({ title: "Agregado a tu build", description: `${part.brand} ${part.name}`, tone: "success" });
        next = slot;
      }
    }
    if (preset || shared || add) router.replace(pathname, { scroll: false });
    const firstMissing = BUILD_STEPS.find((s) => !useBuilder.getState().selection[s.slot])?.slot;
    // Sincroniza el paso activo con la build restaurada (una sola vez tras hidratar)
    setActive(next ?? firstMissing ?? "cpu");
  }, [hydrated, params, presets, partsById, load, select, router, pathname]);

  const stepIndex = BUILD_STEPS.findIndex((s) => s.slot === active);
  const step = BUILD_STEPS[stepIndex];

  const options = useMemo(() => {
    const q = normalize(query);
    const list = parts
      .filter((p) => p.category === active)
      .filter((p) => !q || normalize(`${p.brand} ${p.name} ${p.highlights.join(" ")}`).includes(q))
      .map((p) => ({ part: p, check: checkCandidate(state.build, active, p) as CandidateCheck }));
    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "precio-asc":
          return a.part.price - b.part.price;
        case "precio-desc":
          return b.part.price - a.part.price;
        case "rendimiento":
          return perfScore(b.part) - perfScore(a.part);
        default:
          return (
            Number(b.part.id === selection[active]) - Number(a.part.id === selection[active]) ||
            LEVEL_ORDER[a.check.level] - LEVEL_ORDER[b.check.level] ||
            Number(a.part.stock <= 0) - Number(b.part.stock <= 0) ||
            relevance(b.part) - relevance(a.part)
          );
      }
    });
    const hidden = compatOnly ? sorted.filter((o) => o.check.level === "error" && o.part.id !== selection[active]).length : 0;
    const visible = compatOnly ? sorted.filter((o) => o.check.level !== "error" || o.part.id === selection[active]) : sorted;
    return { visible, hidden, total: list.length };
  }, [parts, active, query, sort, compatOnly, state.build, selection]);

  const goTo = (slot: BuildSlot) => {
    setActive(slot);
    setQuery("");
    setSummaryOpen(false);
    requestAnimationFrame(() => {
      const el = optionsTop.current;
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const nextSlot = (from: BuildSlot) => {
    const i = BUILD_STEPS.findIndex((s) => s.slot === from);
    const after = [...BUILD_STEPS.slice(i + 1), ...BUILD_STEPS.slice(0, i)];
    const sel = useBuilder.getState().selection;
    return after.find((s) => !sel[s.slot])?.slot ?? BUILD_STEPS[Math.min(i + 1, BUILD_STEPS.length - 1)].slot;
  };

  const onSelect = (part: BuilderPart) => {
    const wasEmpty = !selection[active];
    if (selection[active] === part.id) return;
    select(active, part.id);
    if (wasEmpty && stepIndex < BUILD_STEPS.length - 1) {
      const target = nextSlot(active);
      window.setTimeout(() => goTo(target), 380);
    }
  };

  const onAddToCart = () => {
    const list = Object.values(state.build).filter((p): p is BuilderPart => !!p);
    addMany(list.map(({ tech, ...summary }) => summary));
    useUI.getState().pulseCart();
    openCart();
    toast({ title: "Build agregada al carrito", description: `${list.length} piezas · ${formatPrice(state.total)}`, tone: "success" });
  };

  const onReset = () => {
    const prev = { ...selection };
    load({});
    goTo("cpu");
    toast({ title: "Build reiniciada", action: { label: "Deshacer", onClick: () => load(prev) } });
  };

  const onShare = async () => {
    const enc = (Object.entries(selection) as [BuildSlot, string][]).map(([s, id]) => `${s}.${id}`).join("~");
    const url = `${window.location.origin}/arma-tu-pc?b=${enc}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Enlace copiado", description: "Comparte tu build con quien quieras.", tone: "success" });
    } catch {
      toast({ title: "No se pudo copiar el enlace", description: url, tone: "warning" });
    }
  };

  const onSave = () => {
    save({ name: `Mi build · ${new Date().toLocaleDateString("es-MX")}`, selection, total: state.total });
    toast({ title: "Build guardada", tone: "success", href: { label: "Ver en mi cuenta", to: "/cuenta" } });
  };

  const context = stepContext(active, state.build, state.psu);
  const optionalSkip =
    (active === "gpu" && state.build.cpu?.tech.kind === "cpu" && state.build.cpu.tech.igpu) ||
    (active === "cooling" && state.build.cpu?.tech.kind === "cpu" && state.build.cpu.tech.boxCooler);
  const currentPrice = selection[active] ? partsById.get(selection[active]!)?.price : undefined;

  const summary = (
    <BuildSummary state={state} onGoTo={goTo} onRemove={(s) => clearSlot(s)} onAddToCart={onAddToCart} />
  );

  return (
    <div className="pb-28 lg:pb-0">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-brand-text">Configurador</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Arma tu PC</h1>
          <p className="mt-2 max-w-xl text-sm text-fg-muted sm:text-[0.9375rem]">
            Elige paso a paso. Verificamos socket, memoria, potencia, conectores y espacio en tiempo real.
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" onClick={onReset} disabled={!state.count}>
            <RotateCcw className="size-4" aria-hidden /> <span className="hidden sm:inline">Reiniciar</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onShare} disabled={!state.count}>
            <Link2 className="size-4" aria-hidden /> <span className="hidden sm:inline">Compartir</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={onSave} disabled={!state.count}>
            <Save className="size-4" aria-hidden /> Guardar
          </Button>
        </div>
      </div>

      {/* Pasos */}
      <div className="sticky top-16 z-20 -mx-4 mt-6 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <BuilderStepper active={active} onSelect={goTo} state={state} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* Opciones */}
        <section aria-labelledby="step-title" className="min-w-0">
          <div ref={optionsTop} className="scroll-mt-40" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-2xs font-medium uppercase tracking-[0.12em] text-fg-subtle">
                Paso {stepIndex + 1} de {BUILD_STEPS.length}
                {!step.required && " · Opcional"}
              </p>
              <h2 id="step-title" className="mt-1 text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                {step.label}
              </h2>
              <p className="mt-1 text-sm text-fg-muted">{step.help}</p>
              {context.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Restricciones aplicadas">
                  {context.map((c) => (
                    <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-text">
                      <SlidersHorizontal className="size-3" aria-hidden />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Buscar en {step.label}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Buscar ${step.label.toLowerCase()}…`}
                className="h-10 w-full rounded-md border border-line-strong bg-surface-2 pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-brand-line focus:outline-none"
              />
            </label>
            <div className="flex gap-2.5">
              <label className="relative">
                <span className="sr-only">Ordenar</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 appearance-none rounded-md border border-line-strong bg-surface-2 pl-3 pr-8 text-sm text-fg focus:border-brand-line focus:outline-none"
                >
                  <option value="recomendado">Recomendados</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="rendimiento">Rendimiento</option>
                </select>
                <ChevronUp className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 rotate-180 text-fg-subtle" aria-hidden />
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={compatOnly}
                onClick={() => setCompatOnly((v) => !v)}
                className="inline-flex h-10 items-center gap-2.5 whitespace-nowrap rounded-md border border-line-strong bg-surface-2 px-3 text-sm text-fg-muted"
              >
                <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200", compatOnly ? "bg-success" : "bg-surface-4")}>
                  <span className={cn("absolute left-0 top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200", compatOnly ? "translate-x-4.5" : "translate-x-0.5")} />
                </span>
                Solo compatibles
              </button>
            </div>
          </div>

          {/* Lista */}
          {!hydrated ? (
            <div className="mt-4 space-y-2.5" aria-busy="true" aria-label="Cargando opciones">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 rounded-lg border border-line bg-surface p-4">
                  <Skeleton className="h-[84px] w-28" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <Skeleton className="h-9 w-24 self-center" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {optionalSkip && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-line-strong bg-surface/60 px-4 py-3 text-sm">
                  <span className="text-fg-muted">
                    {active === "gpu" ? "Tu procesador tiene gráficos integrados: este paso es opcional." : "Tu procesador incluye disipador: este paso es opcional."}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => goTo(nextSlot(active))}>
                    Continuar sin {active === "gpu" ? "GPU" : "disipador"} <ArrowRight className="size-4" aria-hidden />
                  </Button>
                </div>
              )}
              <div role="radiogroup" aria-labelledby="step-title" className="mt-4 space-y-2.5" key={active}>
                {options.visible.map(({ part, check }, i) => (
                  <OptionCard
                    key={part.id}
                    part={part}
                    check={check}
                    selected={selection[active] === part.id}
                    onSelect={() => onSelect(part)}
                    priceDelta={currentPrice !== undefined ? part.price - currentPrice : undefined}
                    delay={Math.min(i, 8) * 25}
                  />
                ))}
              </div>
              {options.visible.length === 0 && (
                <p className="mt-4 rounded-lg border border-line bg-surface p-6 text-center text-sm text-fg-muted">
                  No hay opciones que coincidan. {options.hidden > 0 && "Prueba mostrando también las incompatibles."}
                </p>
              )}
              {options.hidden > 0 && (
                <button type="button" onClick={() => setCompatOnly(false)} className="mt-3 inline-flex items-center gap-2 text-xs text-fg-subtle hover:text-fg">
                  <CompatIcon level="error" />
                  {options.hidden} {options.hidden === 1 ? "opción oculta" : "opciones ocultas"} por incompatibilidad · Mostrar
                </button>
              )}
              <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                <Button variant="ghost" size="sm" disabled={stepIndex === 0} onClick={() => goTo(BUILD_STEPS[stepIndex - 1].slot)}>
                  <ArrowLeft className="size-4" aria-hidden /> Anterior
                </Button>
                {stepIndex < BUILD_STEPS.length - 1 ? (
                  <Button variant="secondary" size="sm" onClick={() => goTo(BUILD_STEPS[stepIndex + 1].slot)}>
                    Siguiente: {BUILD_STEPS[stepIndex + 1].label} <ArrowRight className="size-4" aria-hidden />
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setSummaryOpen(true)} className="lg:hidden">
                    Ver resumen
                  </Button>
                )}
              </div>
            </>
          )}
        </section>

        {/* Resumen lateral (desktop) */}
        <aside aria-label="Resumen de tu PC" className="hidden lg:block">
          <div className="sticky top-[88px] max-h-[calc(100dvh-104px)] overflow-y-auto rounded-xl border border-line bg-surface shadow-card scrollbar-none">
            {hydrated ? summary : <div className="space-y-3 p-5"><Skeleton className="h-5 w-24" />{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>}
          </div>
        </aside>
      </div>

      {/* Barra inferior (móvil) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface/95 px-4 py-2.5 backdrop-blur-xl lg:hidden">
        <button type="button" onClick={() => setSummaryOpen(true)} className="flex w-full items-center gap-3 text-left" aria-label="Ver resumen de tu PC">
          <CompatIcon level={state.count === 0 ? "ok" : state.level} className={state.count === 0 ? "opacity-40" : undefined} />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-fg-muted">
              Tu PC · {state.count}/8 piezas · {state.watts} W
            </span>
            <span className="tabular block text-base font-bold text-fg">{formatPrice(state.total)}</span>
          </span>
          <span className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand px-4 text-sm font-semibold text-white">
            Resumen <ChevronUp className="size-4" aria-hidden />
          </span>
        </button>
      </div>
      <Sheet open={summaryOpen} onClose={() => setSummaryOpen(false)} side="bottom" title="Resumen de tu PC" hideHeader>
        <BuildSummary state={state} onGoTo={goTo} onRemove={(s) => clearSlot(s)} onAddToCart={onAddToCart} onClose={() => setSummaryOpen(false)} />
      </Sheet>
    </div>
  );
}
