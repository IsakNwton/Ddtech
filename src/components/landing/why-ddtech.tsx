import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Check, CreditCard, Headset, ShieldCheck, Truck, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

function Card({ children, className, glow = "#3b6bff" }: { children: ReactNode; className?: string; glow?: string }) {
  return (
    <div
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(165deg,#10131b_0%,#08090d_70%)] p-6 transition-colors duration-500 hover:border-white/15 sm:p-8",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-50"
        style={{ background: glow }}
        aria-hidden
      />
      {children}
    </div>
  );
}

function IconBadge({ children }: { children: ReactNode }) {
  return <span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#9db5ff]">{children}</span>;
}

const CHECKS = [
  { k: "Socket", v: "AM5 ↔ B650" },
  { k: "Memoria", v: "DDR5 · 2 de 4 ranuras" },
  { k: "Tarjeta gráfica", v: "304 mm · cabe con 96 mm libres" },
  { k: "Disipador", v: "155 mm · máx. 180 mm" },
  { k: "Fuente", v: "411 W estimados · 750 W" },
];

/** Mini interfaz del verificador de compatibilidad */
function CompatMock() {
  return (
    <div className="glass relative mt-8 overflow-hidden rounded-2xl p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full animate-scan bg-gradient-to-b from-transparent via-[#7aa2ff]/10 to-transparent" aria-hidden />
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Verificación en tiempo real</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
          <span className="size-1.5 animate-pulse-ring rounded-full bg-emerald-400" /> 5 / 5
        </span>
      </div>
      <ul className="space-y-2">
        {CHECKS.map((c) => (
          <li key={c.k} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2.5">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
              <Check className="size-3" strokeWidth={3.5} aria-hidden />
            </span>
            <span className="text-sm font-medium text-white">{c.k}</span>
            <span className="ml-auto truncate text-right font-mono text-[11px] text-white/45">{c.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Rutas de envío estilizadas desde Guadalajara */
function RoutesMock() {
  const dots = [
    { x: 46, y: 18, l: "Tijuana" },
    { x: 150, y: 40, l: "Monterrey" },
    { x: 160, y: 98, l: "CDMX" },
    { x: 238, y: 82, l: "Mérida" },
  ];
  const gdl = { x: 110, y: 96 };
  return (
    <svg viewBox="0 0 260 130" className="mt-6 h-auto w-full" role="img" aria-label="Envíos desde Guadalajara a todo México">
      <defs>
        <linearGradient id="route" x1="0" x2="1">
          <stop offset="0" stopColor="#7aa2ff" />
          <stop offset="1" stopColor="#67e8f9" />
        </linearGradient>
      </defs>
      {dots.map((d) => (
        <g key={d.l}>
          <path
            d={`M${gdl.x} ${gdl.y} Q ${(gdl.x + d.x) / 2} ${Math.min(gdl.y, d.y) - 34} ${d.x} ${d.y}`}
            fill="none"
            stroke="url(#route)"
            strokeWidth="1.2"
            strokeDasharray="3 4"
            opacity="0.7"
          />
          <circle cx={d.x} cy={d.y} r="3" fill="#cfe0ff" />
          <text x={d.x} y={d.y + 13} textAnchor="middle" fontSize="8" fill="rgb(255 255 255 / 0.45)" fontFamily="var(--font-mono)">
            {d.l}
          </text>
        </g>
      ))}
      <circle cx={gdl.x} cy={gdl.y} r="10" fill="#3b6bff" opacity="0.25" />
      <circle cx={gdl.x} cy={gdl.y} r="4.5" fill="#7aa2ff" stroke="white" strokeWidth="1.5" />
      <text x={gdl.x} y={gdl.y + 20} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="white" fontFamily="var(--font-mono)">
        GDL
      </text>
    </svg>
  );
}

const SMALL = [
  {
    icon: CreditCard,
    title: "Paga a meses",
    body: "Financia tu equipo con tarjetas participantes y paga a tu ritmo.",
    note: "Plazos y bancos",
    glow: "#8b5cf6",
  },
  {
    icon: Headset,
    title: "Asesoría experta",
    body: "Gente que arma PCs todos los días te ayuda a elegir cada pieza.",
    note: "Canales y horarios",
    glow: "#22d3ee",
  },
  {
    icon: ShieldCheck,
    title: "Originales y con garantía",
    body: "Producto nuevo y sellado, con respaldo del fabricante.",
    note: "Condiciones de garantía",
    glow: "#34d399",
  },
];

export function WhyDdtech() {
  return (
    <section aria-labelledby="why-title" className="container-page">
      <SectionHeading id="why-title" eyebrow="Por qué DDTech" title="Todo lo que necesitas" accent="en un solo lugar.">
        Desde la primera pieza hasta que enciendes tu PC en casa: elegimos contigo, verificamos cada detalle y te la enviamos lista para jugar.
      </SectionHeading>

      <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7 lg:row-span-2">
          <Card>
            <IconBadge>
              <Wrench className="size-5" aria-hidden />
            </IconBadge>
            <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Arma tu PC sin errores</h3>
            <p className="mt-3 max-w-md text-white/55">
              Nuestro configurador revisa socket, memoria, espacio en el gabinete y potencia de la fuente con cada pieza que eliges. Si algo no encaja, te lo decimos antes de comprar.
            </p>
            <CompatMock />
            <Link href="/arma-tu-pc" className="group/link mt-auto inline-flex self-start pt-6 items-center gap-2 text-sm font-semibold text-white">
              Abrir el configurador
              <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
            </Link>
          </Card>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.08}>
          <Card glow="#7c5cff">
            <div className="flex items-start justify-between gap-4">
              <div>
                <IconBadge>
                  <BadgeCheck className="size-5" aria-hidden />
                </IconBadge>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-white">PCs armadas por expertos</h3>
                <p className="mt-2 max-w-xs text-sm text-white/55">Ensamblado, cableado limpio, BIOS actualizado y pruebas de estabilidad antes de salir.</p>
                <Placeholder className="mt-3">Proceso de ensamble</Placeholder>
              </div>
              <Image src="/art/hero-pc.svg" alt="" width={300} height={320} unoptimized className="-mr-4 -mt-2 h-40 w-auto shrink-0 drop-shadow-[0_30px_40px_rgba(124,92,255,0.35)] transition-transform duration-700 group-hover:-translate-y-1 group-hover:scale-105 sm:h-48" />
            </div>
            <Link href="/pcs-gaming" className="group/link mt-auto inline-flex self-start items-center gap-2 pt-6 text-sm font-semibold text-white">
              Ver PCs gaming
              <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
            </Link>
          </Card>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.12}>
          <Card glow="#22d3ee">
            <div className="flex items-center gap-4">
              <IconBadge>
                <Truck className="size-5" aria-hidden />
              </IconBadge>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.035em] text-white">Envío a todo México</h3>
                <p className="text-sm text-white/55">Empaque reforzado y guía de rastreo.</p>
              </div>
            </div>
            <RoutesMock />
            <Placeholder className="mt-2 self-start">Tiempos y costos de envío</Placeholder>
          </Card>
        </Reveal>

        {SMALL.map(({ icon: Icon, title, body, note, glow }, i) => (
          <Reveal key={title} className="lg:col-span-4" delay={0.08 * i}>
            <Card glow={glow} className="sm:p-7">
              <IconBadge>
                <Icon className="size-5" aria-hidden />
              </IconBadge>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-white/55">{body}</p>
              <Placeholder className="mt-4 self-start">{note}</Placeholder>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
