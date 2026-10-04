"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Cpu, Sparkles } from "lucide-react";
import type { NavCategory } from "@/data/navigation";
import { formatPrice } from "@/lib/format";
import { CategoryIcon } from "./category-icon";

/** Mega menú "Componentes": 9 categorías con imagen, contexto y precio de entrada */
export function ComponentsMenu({ items, onNavigate }: { items: NavCategory[]; onNavigate: () => void }) {
  const list = items.filter((c) => c.group === "componentes");
  return (
    <div className="grid grid-cols-[1fr_300px] gap-8 py-6">
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <p className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">Componentes</p>
          <Link href="/componentes" onClick={onNavigate} className="text-xs font-semibold text-fg-muted hover:text-fg">
            Ver todas las categorías →
          </Link>
        </div>
        <ul className="grid grid-cols-3 gap-1">
          {list.map((c) => (
            <li key={c.id}>
              <Link
                href={c.href}
                onClick={onNavigate}
                className="group flex items-center gap-3.5 rounded-md p-2.5 transition-colors duration-150 hover:bg-surface-2 focus-visible:bg-surface-2"
              >
                <span className="stage relative size-16 shrink-0 overflow-hidden rounded-md border border-line">
                  <Image src={c.art} alt="" width={64} height={48} unoptimized className="absolute inset-0 size-full object-contain p-1 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                    <CategoryIcon id={c.id} className="size-3.5 text-brand-text" />
                    {c.name}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-fg-subtle">{c.hint}</span>
                  <span className="mt-1 block text-2xs text-fg-subtle">
                    {c.count} productos · desde <span className="tabular text-fg-muted">{formatPrice(c.from)}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link
        href="/arma-tu-pc"
        onClick={onNavigate}
        className="group relative flex flex-col overflow-hidden rounded-lg border border-brand-line bg-[radial-gradient(120%_90%_at_100%_0%,rgb(47_95_240/0.22),transparent_60%)] bg-surface-2 p-5"
      >
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-2 py-0.5 text-2xs font-semibold text-brand-text">
          <Sparkles className="size-3" aria-hidden /> Arma tu PC
        </span>
        <span className="mt-3 text-lg font-semibold leading-snug tracking-[-0.02em] text-fg">
          ¿No sabes si tus piezas son compatibles?
        </span>
        <span className="mt-1.5 text-sm text-fg-muted">Elige paso a paso y verificamos socket, memoria, potencia y espacio.</span>
        <ul className="mt-4 space-y-1.5 text-xs text-fg-muted">
          {["Socket CPU ↔ tarjeta madre", "Potencia de la fuente", "Largo de GPU vs. gabinete"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="grid size-4 place-items-center rounded-full bg-success-soft text-success">
                <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-text">
          <Cpu className="size-4" aria-hidden /> Empezar a armar
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    </div>
  );
}

export function PeripheralsMenu({ items, onNavigate }: { items: NavCategory[]; onNavigate: () => void }) {
  const list = items.filter((c) => c.group === "perifericos");
  return (
    <div className="py-6">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">Periféricos</p>
        <Link href="/perifericos" onClick={onNavigate} className="text-xs font-semibold text-fg-muted hover:text-fg">
          Ver todos los periféricos →
        </Link>
      </div>
      <ul className="grid grid-cols-4 gap-3">
        {list.map((c) => (
          <li key={c.id}>
            <Link href={c.href} onClick={onNavigate} className="group block overflow-hidden rounded-lg border border-line bg-surface-2 transition-colors hover:border-line-strong">
              <span className="stage relative block aspect-[16/10]">
                <Image src={c.art} alt="" width={240} height={180} unoptimized className="absolute inset-0 size-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" />
              </span>
              <span className="flex items-center justify-between px-3.5 py-3">
                <span>
                  <span className="block text-sm font-semibold text-fg">{c.name}</span>
                  <span className="block text-xs text-fg-subtle">{c.hint}</span>
                </span>
                <ArrowRight className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Panel "Categorías": índice completo y escaneable */
export function AllCategoriesMenu({ items, onNavigate }: { items: NavCategory[]; onNavigate: () => void }) {
  const groups = [
    { title: "Componentes", items: items.filter((c) => c.group === "componentes") },
    { title: "Periféricos", items: items.filter((c) => c.group === "perifericos") },
    { title: "Equipos", items: items.filter((c) => c.group === "pcs") },
  ];
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-8 py-6">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">{g.title}</p>
          <ul className={g.items.length > 5 ? "grid grid-cols-2 gap-x-4" : undefined}>
            {g.items.map((c) => (
              <li key={c.id}>
                <Link href={c.href} onClick={onNavigate} className="group flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                  <span className="grid size-8 place-items-center rounded-md border border-line bg-surface-2 text-fg-subtle transition-colors group-hover:border-brand-line group-hover:text-brand-text">
                    <CategoryIcon id={c.id} className="size-4" />
                  </span>
                  <span className="flex-1">{c.name}</span>
                  <span className="tabular text-2xs text-fg-subtle">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
