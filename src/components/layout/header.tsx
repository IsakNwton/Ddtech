"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutGrid, Menu, Search } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PRIMARY_NAV, type NavCategory } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { useUI } from "@/store/ui";
import { SearchBox } from "@/components/search/search-box";
import { HeaderActions } from "./header-actions";
import { Logo } from "./logo";
import { AllCategoriesMenu, ComponentsMenu, PeripheralsMenu } from "./mega-menu";

type MenuId = "categorias" | "componentes" | "perifericos";

/**
 * Header en dos niveles:
 * 1) Barra fija con logo, categorías, búsqueda (protagonista) y acciones.
 * 2) Navegación primaria que se desplaza con la página para liberar espacio.
 * Los menús abren con hover intencional (retardo), clic o teclado y cierran con Escape.
 */
export function Header({ nav }: { nav: NavCategory[] }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState<MenuId | null>(null);
  // Temporizadores del "hover intencional" (objeto estable, no participa del render)
  const [timers] = useState(() => new Map<"open" | "close", number>());
  const setMenuOpen = useUI((s) => s.setMenuOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const [scrolled, setScrolled] = useState(false);

  const clear = () => {
    window.clearTimeout(timers.get("open"));
    window.clearTimeout(timers.get("close"));
  };
  const hoverOpen = (id: MenuId) => {
    clear();
    timers.set("open", window.setTimeout(() => setMenu(id), menu ? 0 : 120));
  };
  const hoverClose = () => {
    clear();
    timers.set("close", window.setTimeout(() => setMenu(null), 180));
  };
  const close = useCallback(() => {
    window.clearTimeout(timers.get("open"));
    window.clearTimeout(timers.get("close"));
    setMenu(null);
  }, [timers]);

  useEffect(() => {
    // Cerrar menús al navegar
    // eslint-disable-next-line react-hooks/set-state-in-effect
    close();
  }, [pathname, close]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const trigger = document.querySelector<HTMLElement>(`[data-menu-trigger="${menu}"]`);
        close();
        trigger?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, close]);

  const trigger = (id: MenuId, label: ReactNode, extra?: string) => ({
    "data-menu-trigger": id,
    "aria-expanded": menu === id,
    "aria-controls": `menu-${id}`,
    "aria-haspopup": "true" as const,
    onClick: () => setMenu((m) => (m === id ? null : id)),
    onMouseEnter: () => hoverOpen(id),
    onMouseLeave: hoverClose,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMenu(id);
        requestAnimationFrame(() => document.querySelector<HTMLElement>(`#menu-${id} a`)?.focus());
      }
    },
    className: cn(
      "h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors duration-150",
      extra?.includes("hidden") ? null : "inline-flex",
      menu === id ? "bg-surface-3 text-fg" : "text-fg-muted hover:text-fg",
      extra,
    ),
    children: (
      <>
        {label}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", menu === id && "rotate-180")} aria-hidden />
      </>
    ),
  });

  const panel = menu && (
    <div
      id={`menu-${menu}`}
      onMouseEnter={clear}
      onMouseLeave={hoverClose}
      className="absolute inset-x-0 top-full hidden animate-fade-in border-b border-line bg-surface/97 shadow-pop backdrop-blur-xl lg:block"
    >
      <div className="container-page">
        {menu === "componentes" && <ComponentsMenu items={nav} onNavigate={close} />}
        {menu === "perifericos" && <PeripheralsMenu items={nav} onNavigate={close} />}
        {menu === "categorias" && <AllCategoriesMenu items={nav} onNavigate={close} />}
      </div>
    </div>
  );

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-bg/88 backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow] duration-200",
          scrolled ? "border-line shadow-[0_8px_30px_-12px_rgb(0_0_0/0.8)]" : "border-transparent",
        )}
      >
        <div className="container-page flex h-16 items-center gap-3 lg:h-[72px] lg:gap-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="-ml-2 inline-flex size-10 shrink-0 items-center justify-center rounded-md text-fg-muted hover:bg-surface-3 hover:text-fg lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Logo />
          <button type="button" {...trigger("categorias", <><LayoutGrid className="size-4" aria-hidden />Categorías</>, "hidden lg:inline-flex")} />
          <SearchBox className="hidden flex-1 lg:block lg:max-w-[760px]" />
          <div className="ml-auto flex items-center lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-md text-fg-muted transition-opacity hover:bg-surface-3 hover:text-fg lg:hidden",
                !scrolled && "pointer-events-none opacity-0",
              )}
              tabIndex={scrolled ? 0 : -1}
            >
              <Search className="size-5" />
            </button>
            <HeaderActions />
          </div>
        </div>
        {menu === "categorias" && panel}
      </header>
      {menu && <div className="fixed inset-0 z-30 hidden animate-fade-in bg-black/40 lg:block" onClick={close} aria-hidden />}

      {/* Nivel 2: búsqueda en móvil / navegación primaria en desktop */}
      <div className="relative z-30 border-b border-line bg-bg">
        <div className="container-page py-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-full items-center gap-2.5 rounded-lg border border-line-strong bg-surface-2 px-3.5 text-left text-sm text-fg-subtle"
          >
            <Search className="size-[18px]" aria-hidden />
            ¿Qué estás buscando?
          </button>
        </div>
        <nav aria-label="Principal" className="container-page hidden h-12 items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) =>
            item.menu ? (
              <button key={item.label} type="button" {...trigger(item.menu, item.label, isActive(item.href) ? "text-fg" : undefined)} />
            ) : (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                  isActive(item.href) ? "text-fg" : "text-fg-muted hover:text-fg",
                  item.highlight && "text-fg",
                )}
              >
                {item.highlight && <span className="size-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgb(47_95_240/0.25)]" aria-hidden />}
                {item.label}
                {isActive(item.href) && <span className="absolute inset-x-3 -bottom-[5px] h-0.5 rounded-full bg-brand" aria-hidden />}
              </Link>
            ),
          )}
          <div className="ml-auto flex items-center gap-4 text-xs text-fg-subtle">
            <Link href="/comparar" className="transition-colors hover:text-fg">
              Comparador
            </Link>
            <span className="h-3 w-px bg-line-strong" aria-hidden />
            <Link href="/propuesta" className="transition-colors hover:text-fg">
              Sobre este concepto
            </Link>
          </div>
        </nav>
        {menu !== "categorias" && panel}
      </div>
    </>
  );
}
