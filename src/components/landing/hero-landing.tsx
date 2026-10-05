"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, Check, Cpu, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { MagneticLink } from "./magnetic";
import { SplitHeading } from "./reveal";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), { ssr: false, loading: () => null });

const EASE = [0.16, 1, 0.3, 1] as const;

function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      // Detección única tras montar (no disponible en SSR)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

function Chip({ children, className, delay }: { children: React.ReactNode; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={`pointer-events-none absolute hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:block ${className}`}
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroLanding({ total, watts, psu }: { total: number; watts: number; psu: number }) {
  const webgl = useWebGL();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 700], [0, -120]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section aria-labelledby="hero-title" className="relative isolate h-[calc(100svh-7.5rem)] min-h-[700px] overflow-hidden bg-[#060709] lg:h-[calc(100svh-8.5rem)] lg:min-h-[720px]">
      {/* Escena 3D */}
      <div className="absolute inset-0 -z-10">
        {webgl === false ? (
          <div className="absolute inset-0 grid place-items-center lg:justify-end lg:pr-[8%]">
            <Image src="/art/hero-pc.svg" alt="" width={600} height={640} priority unoptimized className="h-[70%] w-auto opacity-90" />
          </div>
        ) : (
          webgl && <HeroScene className="absolute inset-0" />
        )}
        {/* Velos para legibilidad */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_75%_45%,transparent_0%,rgba(6,7,9,0.2)_60%,rgba(6,7,9,0.85)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#060709] via-[#060709]/85 to-transparent lg:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-[#060709] via-[#060709]/70 to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060709] to-transparent" />
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.035]" />
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-page flex h-full flex-col justify-end pb-24 lg:justify-center lg:pb-10">
        <div className="max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
          <Link
            href="/arma-tu-pc"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-xs font-medium text-white/75 backdrop-blur-xl transition-colors hover:border-white/25 hover:text-white"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#4d7cff] to-[#7c5cff] px-2.5 py-1 font-semibold text-white">
              <Sparkles className="size-3" aria-hidden /> Nuevo
            </span>
            Arma tu PC con compatibilidad verificada
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          </motion.div>

          <SplitHeading
            as="h1"
            immediate
            delay={0.15}
            className="mt-6 text-[3rem] font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-[4.5rem] xl:text-[6rem]"
            lines={[{ text: "Construye" }, { text: "algo increíble.", className: "text-gradient" }]}
          />
          <span id="hero-title" className="sr-only">
            Construye algo increíble
          </span>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-white/60 sm:text-xl"
          >
            Componentes, PCs y hardware para llevar tu setup al siguiente nivel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease: EASE }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <MagneticLink href="/arma-tu-pc">
              <Cpu className="size-[18px]" aria-hidden /> ARMAR MI PC
            </MagneticLink>
            <MagneticLink href="/componentes" variant="ghost">
              EXPLORAR COMPONENTES <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </MagneticLink>
          </motion.div>
        </div>
      </motion.div>

      {/* Datos flotantes junto al modelo */}
      <Chip className="right-[6%] top-[14%]" delay={1.4}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Tarjeta gráfica</p>
        <p className="mt-1 text-sm font-semibold text-white">16 GB GDDR7 · 300 W</p>
      </Chip>
      <Chip className="bottom-[22%] right-[34%]" delay={1.6}>
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15">
            <Check className="size-3" strokeWidth={3.5} aria-hidden />
          </span>
          Todo compatible
        </p>
        <p className="mt-1 text-xs text-white/50">Build 1440p · {formatPrice(total)} demo</p>
      </Chip>
      <Chip className="bottom-[14%] right-[7%]" delay={1.8}>
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <Zap className="size-3 text-[#8aa6ff]" aria-hidden /> Consumo estimado
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">
          {watts} W <span className="text-sm font-medium text-white/45">/ {psu} W+</span>
        </p>
      </Chip>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40 md:flex"
      >
        Desliza
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="size-4" aria-hidden />
        </motion.span>
      </motion.div>
    </section>
  );
}
