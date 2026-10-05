"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useWebGL } from "@/hooks/use-webgl";
import { MagneticLink } from "./magnetic";

const AssemblyScene = dynamic(() => import("@/components/three/assembly-scene"), { ssr: false, loading: () => null });

const STEPS = [
  { n: "01", t: "Tarjeta madre", d: "La base de todo. Define socket y memoria." },
  { n: "02", t: "Procesador", d: "Solo te mostramos CPUs del socket correcto." },
  { n: "03", t: "Refrigeración", d: "Validamos TDP, socket y espacio del radiador." },
  { n: "04", t: "Memoria RAM", d: "DDR4 o DDR5 según tu tarjeta madre." },
  { n: "05", t: "Almacenamiento", d: "NVMe Gen4 o Gen5 para cargas instantáneas." },
  { n: "06", t: "Tarjeta gráfica", d: "Revisamos largo, potencia y conector 12V-2x6." },
  { n: "07", t: "Fuente de poder", d: "Calculamos consumo y potencia recomendada." },
  { n: "08", t: "Gabinete", d: "Formato, GPU y disipador: todo cabe." },
];

/** Sección fija de 400vh: la PC se arma pieza por pieza mientras haces scroll */
export function AssemblySection({ total, watts, psu }: { total: number; watts: number; psu: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const bar = useTransform(progress, [0, 1], ["0%", "100%"]);
  const webgl = useWebGL();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * 1.12 * STEPS.length))));
    setDone(v > 0.93);
  });

  if (webgl === false) return <StaticAssembly sectionRef={ref} total={total} watts={watts} psu={psu} />;

  return (
    <section ref={ref} aria-labelledby="assembly-title" className="relative h-[420vh] bg-[#060709]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {webgl && <AssemblyScene progress={progress} className="absolute inset-0" />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060709] via-[#060709]/40 to-transparent lg:via-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060709] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060709] to-transparent" />

        <div className="container-page relative flex h-full flex-col justify-between pb-24 pt-24 lg:justify-center lg:pb-24">
          <div className="max-w-md">
            <p className="eyebrow">Arma tu PC</p>
            <h2 id="assembly-title" className="mt-5 text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl">
              Pieza por pieza.
              <br />
              <span className="text-white/40">Sin errores.</span>
            </h2>

            <ol className="mt-10 hidden space-y-1 lg:block">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={cn(
                    "flex items-start gap-4 rounded-xl px-3 py-2 transition-all duration-500",
                    i === active ? "bg-white/[0.05] opacity-100" : i < active ? "opacity-45" : "opacity-25",
                  )}
                >
                  <span className={cn("mt-0.5 font-mono text-xs tabular-nums transition-colors", i <= active ? "text-[#8aa6ff]" : "text-white/40")}>{s.n}</span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[0.95rem] font-semibold text-white">
                      {s.t}
                      {i < active && <Check className="size-3.5 text-emerald-400" strokeWidth={3} aria-hidden />}
                    </span>
                    <span className={cn("grid transition-all duration-500", i === active ? "mt-1 grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <span className="overflow-hidden text-sm text-white/55">{s.d}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4 lg:mt-10 lg:max-w-md">
            {/* Móvil: paso actual */}
            <div className="lg:hidden">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl">
                <p className="font-mono text-xs text-[#8aa6ff]">{STEPS[active].n} / 08</p>
                <p className="mt-1 text-lg font-semibold text-white">{STEPS[active].t}</p>
                <p className="text-sm text-white/55">{STEPS[active].d}</p>
              </motion.div>
            </div>
            <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
              <motion.div style={{ width: bar }} className="h-full rounded-full bg-gradient-to-r from-[#4d7cff] via-[#7c5cff] to-[#c084fc]" />
            </div>
          </div>
        </div>

        {/* Resultado final */}
        <motion.div
          initial={false}
          animate={done ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute bottom-10 right-4 w-[min(360px,calc(100%-2rem))] rounded-3xl border border-white/10 bg-[#0b0d12]/80 p-6 shadow-[0_40px_120px_-30px_rgba(77,124,255,0.6)] backdrop-blur-2xl sm:right-10 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2",
            !done && "pointer-events-none",
          )}
          aria-hidden={!done}
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <span className="grid size-6 place-items-center rounded-full bg-emerald-400/15">
              <Check className="size-3.5" strokeWidth={3.5} aria-hidden />
            </span>
            Todo compatible
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-white/45">Consumo estimado</dt>
              <dd className="text-2xl font-semibold tracking-[-0.03em] text-white">{watts} W</dd>
            </div>
            <div>
              <dt className="text-xs text-white/45">Fuente recomendada</dt>
              <dd className="text-2xl font-semibold tracking-[-0.03em] text-white">{psu} W+</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
            <div>
              <p className="text-xs text-white/45">Total (demo)</p>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{formatPrice(total)}</p>
            </div>
          </div>
          <div className="mt-6">
            <MagneticLink href="/arma-tu-pc?preset=1440p" block className="h-12 w-full px-6 text-sm" tabIndex={done ? 0 : -1}>
              Personalizar esta build
            </MagneticLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Respaldo sin WebGL: los ocho pasos completos junto a la ilustración de la PC */
function StaticAssembly({ sectionRef, total, watts, psu }: { sectionRef: React.RefObject<HTMLElement | null>; total: number; watts: number; psu: number }) {
  return (
    <section ref={sectionRef} aria-labelledby="assembly-title" className="relative bg-[#060709] py-24 md:py-32">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Arma tu PC</p>
          <h2 id="assembly-title" className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl">
            Pieza por pieza.
            <br />
            <span className="text-white/40">Sin errores.</span>
          </h2>
          <ol className="mt-10 grid gap-2 sm:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.n} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <span className="mt-0.5 font-mono text-xs tabular-nums text-[#9db5ff]">{s.n}</span>
                <span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    {s.t} <Check className="size-3.5 text-emerald-400" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="mt-0.5 block text-xs text-white/50">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative flex flex-col items-center">
          <span className="absolute top-1/3 size-80 rounded-full bg-[#3b6bff]/25 blur-3xl" aria-hidden />
          <Image src="/art/hero-pc.svg" alt="" width={480} height={512} unoptimized className="relative h-[420px] w-auto" />
          <div className="glass relative -mt-16 w-full max-w-sm rounded-3xl p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Check className="size-4" strokeWidth={3.5} aria-hidden /> Todo compatible
            </p>
            <p className="mt-3 text-sm text-white/55">
              {watts} W estimados · fuente de {psu} W+ · <span className="font-semibold text-white">{formatPrice(total)}</span> demo
            </p>
            <div className="mt-5">
              <MagneticLink href="/arma-tu-pc?preset=1440p" block className="h-12 w-full px-6 text-sm">
                Personalizar esta build
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
