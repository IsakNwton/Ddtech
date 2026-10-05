"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check, Cpu, MapPin, Zap } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useWebGL } from "@/hooks/use-webgl";
import { MagneticLink } from "./magnetic";
import { SplitHeading } from "./reveal";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), { ssr: false, loading: () => null });

const EASE = [0.16, 1, 0.3, 1] as const;

function Chip({ children, className, delay }: { children: React.ReactNode; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={`glass pointer-events-none absolute hidden rounded-2xl px-4 py-3 lg:block ${className}`}
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export interface HeroStat {
  value: string;
  label: string;
}

export function HeroLanding({ total, watts, psu, stats }: { total: number; watts: number; psu: number; stats: HeroStat[] }) {
  const webgl = useWebGL();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 700], [0, -120]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const glowY = useTransform(scrollY, [0, 700], [0, 160]);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-[#05060a] lg:h-[calc(100svh-9.6rem)] lg:min-h-[720px]">
      {/* Escena 3D (o ilustración si el navegador no tiene WebGL): arriba en móvil, a la derecha en escritorio */}
      <div className="absolute inset-x-0 top-0 -z-20 h-[420px] sm:h-[480px] lg:inset-0 lg:h-auto">
        {webgl === false ? (
          <div className="absolute inset-0 flex justify-center pt-4 lg:left-auto lg:right-[6%] lg:w-[48%] lg:items-center lg:pt-0">
            <Image src="/art/hero-pc.svg" alt="" width={600} height={640} priority unoptimized className="h-[92%] w-auto animate-float object-contain drop-shadow-[0_60px_80px_rgba(77,124,255,0.35)] lg:h-[78%]" />
          </div>
        ) : (
          webgl && <HeroScene className="absolute inset-0" />
        )}
      </div>

      <div className="absolute inset-0 -z-10">
        {/* Luz de color que envuelve el modelo (se suma sobre el lienzo) */}
        <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0 mix-blend-screen" aria-hidden>
          <div className="aurora-blob left-1/2 top-[6%] size-[420px] -translate-x-1/2 bg-[#3b6bff]/30 lg:left-auto lg:right-[14%] lg:top-[18%] lg:size-[560px] lg:translate-x-0" />
          <div className="aurora-blob right-[2%] top-[38%] hidden size-[380px] bg-[#8b5cf6]/30 [animation-delay:-6s] lg:block" />
          <div className="aurora-blob right-[38%] top-[8%] hidden size-[260px] bg-[#22d3ee]/20 [animation-delay:-11s] lg:block" />
        </motion.div>

        {/* Piso con retícula en perspectiva */}
        <div className="pointer-events-none absolute inset-x-[-20%] bottom-[-8%] h-[46%] opacity-50 mix-blend-screen" aria-hidden>
          <div className="perspective-grid absolute inset-0" />
        </div>

        {/* Velos para legibilidad */}
        <div className="pointer-events-none absolute inset-x-0 top-[260px] h-[200px] bg-gradient-to-b from-transparent to-[#05060a] sm:top-[320px] lg:hidden" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[460px] bg-[#05060a] sm:top-[520px] lg:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-[#05060a] via-[#05060a]/75 to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05060a] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7aa2ff]/40 to-transparent" />
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-page flex flex-col pb-12 pt-[340px] sm:pt-[400px] lg:h-full lg:justify-center lg:pb-28 lg:pt-0">
        <div className="max-w-[660px]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 text-xs font-medium text-white/70 backdrop-blur-xl">
              <span className="relative grid size-5 place-items-center rounded-full bg-emerald-400/15">
                <span className="size-1.5 animate-pulse-ring rounded-full bg-emerald-400" />
              </span>
              <MapPin className="size-3.5 text-white/50" aria-hidden />
              Desde Guadalajara para todo México
            </p>
          </motion.div>

          <SplitHeading
            as="h1"
            immediate
            delay={0.15}
            className="mt-7 text-[3.1rem] font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:text-[4.75rem] xl:text-[6.25rem]"
            lines={[{ text: "Arma la PC" }, { text: "de tus sueños.", className: "text-gradient" }]}
          />
          <span id="hero-title" className="sr-only">
            Arma la PC de tus sueños
          </span>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="mt-7 max-w-[30rem] text-pretty text-lg leading-relaxed text-white/60 sm:text-xl"
          >
            Componentes, PCs gaming y periféricos de las marcas líderes. Compatibilidad verificada, armado experto y envío a todo el país.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease: EASE }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <MagneticLink href="/arma-tu-pc">
              <Cpu className="size-[18px]" aria-hidden /> Armar mi PC
            </MagneticLink>
            <MagneticLink href="/pcs-gaming" variant="ghost">
              Ver PCs armadas <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </MagneticLink>
          </motion.div>
        </div>

        {/* Cifras */}
        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: EASE }}
          className="mt-12 grid max-w-[660px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-4 lg:absolute lg:bottom-10 lg:mt-0 lg:w-[660px]"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col bg-[#07080d]/90 px-4 py-4 backdrop-blur-xl">
              <dt className="text-[11px] leading-snug text-white/45">{s.label}</dt>
              <dd className="tabular mt-1 order-first text-2xl font-semibold tracking-[-0.04em] text-white">{s.value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Datos flotantes junto al modelo */}
      <Chip className="right-[6%] top-[12%]" delay={1.4}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Tarjeta gráfica</p>
        <p className="mt-1 text-sm font-semibold text-white">16 GB GDDR7 · 300 W</p>
      </Chip>
      <Chip className="bottom-[24%] right-[36%]" delay={1.6}>
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15">
            <Check className="size-3" strokeWidth={3.5} aria-hidden />
          </span>
          Todo compatible
        </p>
        <p className="mt-1 text-xs text-white/50">Build 1440p · {formatPrice(total)} demo</p>
      </Chip>
      <Chip className="bottom-[13%] right-[6%]" delay={1.8}>
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <Zap className="size-3 text-[#9db5ff]" aria-hidden /> Consumo estimado
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">
          {watts} W <span className="text-sm font-medium text-white/45">/ {psu} W+</span>
        </p>
      </Chip>

    </section>
  );
}

