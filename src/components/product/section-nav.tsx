"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Navegación por secciones con resaltado de la sección visible (scroll spy) */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Secciones del producto" className="sticky top-16 z-20 -mx-4 border-b border-line bg-bg/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-[72px] xl:-mx-8 xl:px-8">
      <ul className="flex gap-1 overflow-x-auto scrollbar-none">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={cn(
                "relative inline-flex h-12 items-center whitespace-nowrap px-3 text-sm font-medium transition-colors",
                active === s.id ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {s.label}
              <span className={cn("absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand transition-opacity", active === s.id ? "opacity-100" : "opacity-0")} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
