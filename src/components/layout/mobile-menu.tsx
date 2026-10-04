"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Cpu, GitCompareArrows, Heart, Info, LifeBuoy, Percent, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavCategory } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { useUI } from "@/store/ui";
import { Sheet } from "@/components/ui/sheet";
import { CategoryIcon } from "./category-icon";
import { Logo } from "./logo";

export function MobileMenu({ nav }: { nav: NavCategory[] }) {
  const open = useUI((s) => s.menuOpen);
  const setOpen = useUI((s) => s.setMenuOpen);
  const pathname = usePathname();
  const [tab, setTab] = useState<"componentes" | "perifericos">("componentes");

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const close = () => setOpen(false);
  const groups = nav.filter((c) => c.group === tab);

  return (
    <Sheet open={open} onClose={close} side="left" title="Menú" hideHeader>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <Logo />
        <button type="button" onClick={close} className="rounded-md px-2 py-1 text-sm text-fg-muted hover:text-fg">
          Cerrar
        </button>
      </div>
      <div className="p-3">
        <Link
          href="/arma-tu-pc"
          onClick={close}
          className="flex items-center gap-3 rounded-lg border border-brand-line bg-brand-soft p-3.5"
        >
          <span className="grid size-10 place-items-center rounded-md bg-brand text-white">
            <Cpu className="size-5" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-fg">Arma tu PC</span>
            <span className="block text-xs text-fg-muted">Con verificación de compatibilidad</span>
          </span>
          <ChevronRight className="size-4 text-fg-muted" aria-hidden />
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link href="/ofertas" onClick={close} className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 p-3 text-sm font-medium">
            <Percent className="size-4 text-deal" aria-hidden /> Ofertas
          </Link>
          <Link href="/pcs-gaming" onClick={close} className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 p-3 text-sm font-medium">
            <CategoryIcon id="pc" className="size-4 text-brand-text" /> PCs Gaming
          </Link>
        </div>
      </div>
      <div className="px-3">
        <div role="tablist" aria-label="Categorías" className="grid grid-cols-2 rounded-md bg-surface-2 p-1">
          {(["componentes", "perifericos"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "h-9 rounded-sm text-sm font-medium transition-colors",
                tab === t ? "bg-surface-4 text-fg shadow-sm" : "text-fg-muted",
              )}
            >
              {t === "componentes" ? "Componentes" : "Periféricos"}
            </button>
          ))}
        </div>
        <ul className="mt-2" role="tabpanel">
          {groups.map((c) => (
            <li key={c.id}>
              <Link href={c.href} onClick={close} className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-fg-muted active:bg-surface-2">
                <span className="grid size-9 place-items-center rounded-md border border-line bg-surface-2">
                  <CategoryIcon id={c.id} className="size-4 text-fg-muted" />
                </span>
                <span className="flex-1 text-fg">{c.name}</span>
                <span className="text-2xs text-fg-subtle">{c.count}</span>
                <ChevronRight className="size-4 text-fg-subtle" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ul className="mt-3 border-t border-line p-3 text-sm">
        {[
          { href: "/cuenta", label: "Mi cuenta", icon: User },
          { href: "/favoritos", label: "Favoritos", icon: Heart },
          { href: "/comparar", label: "Comparador", icon: GitCompareArrows },
          { href: "/soporte", label: "Soporte", icon: LifeBuoy },
          { href: "/propuesta", label: "Sobre este concepto", icon: Info },
        ].map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} onClick={close} className="flex items-center gap-3 rounded-md px-2 py-2.5 text-fg-muted active:bg-surface-2">
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
