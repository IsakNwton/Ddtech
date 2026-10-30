"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { EASE_GALLERY, SPRING_GLASS } from "@/lib/motion";
import { navItems } from "@/lib/site";
import { lockScroll } from "./smooth-scroll";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({ artistName }: { artistName: string }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // Se oculta al bajar con decisión y reaparece al subir; nunca si tiene el foco
    const focusInside = navRef.current?.contains(document.activeElement);
    if (y > 480 && y - prev > 6 && !focusInside) setHidden(true);
    else if (prev - y > 4 || y < 200) setHidden(false);
  });

  // Cerrar el menú móvil al navegar
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header ref={navRef} className="site-nav pointer-events-none fixed inset-x-0 top-0 z-50">
      <motion.div
        className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 pt-[max(0.875rem,env(safe-area-inset-top))] sm:px-6 lg:px-10"
        animate={{ y: hidden && !open ? -96 : 0 }}
        transition={SPRING_GLASS}
      >
        {/* Firma del artista */}
        <Link
          href="/"
          className={cn(
            "press glass pointer-events-auto flex h-12 items-center gap-3 rounded-full pl-2 pr-5 text-ink transition-[background-color] duration-500",
            scrolled && "glass-strong",
          )}
          aria-label={`${artistName} — inicio`}
        >
          <span className="grid size-8 place-items-center rounded-full border border-gold/50 font-display text-[0.95rem] italic text-gold-ink">
            {artistName.trim().charAt(0)}
          </span>
          <span className="font-display text-[1.15rem] leading-none tracking-[-0.01em]">{artistName}</span>
        </Link>

        {/* Navegación principal (escritorio) */}
        <nav aria-label="Principal" className="pointer-events-auto hidden lg:block">
          <ul
            className={cn("glass flex h-12 items-center gap-0.5 rounded-full p-1 transition-[background-color] duration-500", scrolled && "glass-strong")}
            onMouseLeave={() => setHovered(null)}
          >
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                    className={cn(
                      "press relative z-10 flex h-10 items-center rounded-full px-[1.1rem] text-[0.875rem] tracking-[-0.005em] transition-colors duration-300",
                      active ? "text-paper" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                  {hovered === item.href && !active && (
                    <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-ink/[0.055]" transition={SPRING_GLASS} aria-hidden />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_6px_16px_-8px_rgb(0_0_0/0.5)]"
                      transition={SPRING_GLASS}
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="pointer-events-auto flex items-center gap-2">
          <ThemeToggle className="hidden lg:grid" />
          <button
            type="button"
            className="press glass grid size-12 place-items-center rounded-full text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={open ? "x" : "m"}
                initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
                transition={SPRING_GLASS}
              >
                {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </header>
  );
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const main = document.getElementById("contenido");
    const footer = document.getElementById("pie");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    const t = window.setTimeout(() => firstLink.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-movil"
          className="pointer-events-auto fixed inset-0 -z-10 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-paper/80 backdrop-blur-2xl backdrop-saturate-150" onClick={onClose} aria-hidden />
          <nav aria-label="Menú" className="relative flex h-full flex-col justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28">
            <ul className="space-y-1">
              {navItems.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%", transition: { duration: 0.3, ease: EASE_GALLERY, delay: (navItems.length - i) * 0.03 } }}
                      transition={{ duration: 0.8, ease: EASE_GALLERY, delay: 0.08 + i * 0.06 }}
                    >
                      <Link
                        ref={i === 0 ? firstLink : undefined}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={onClose}
                        className="group flex items-baseline gap-4 py-1.5"
                      >
                        <span className="w-6 text-xs tabular-nums text-muted-text">{String(i + 1).padStart(2, "0")}</span>
                        <span className={cn("font-display text-[2.75rem] leading-[1.05] transition-colors", active ? "italic text-ink" : "text-ink-soft group-hover:text-ink")}>
                          {item.label}
                        </span>
                        {active && <span className="size-1.5 -translate-y-3 rounded-full bg-gold" aria-hidden />}
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
            <motion.div
              className="flex items-center justify-between border-t border-line pt-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE_GALLERY }}
            >
              <span className="eyebrow">Apariencia</span>
              <ThemeToggle />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
