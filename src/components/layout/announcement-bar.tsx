import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Aviso discreto y permanente: el sitio es un concepto, no la tienda oficial */
export function AnnouncementBar() {
  return (
    <div className="border-b border-line bg-surface text-fg-muted">
      <div className="container-page flex h-8 items-center justify-between gap-4 text-[11.5px]">
        <p className="truncate">
          <span className="mr-2 inline-flex h-4 items-center rounded-xs bg-surface-4 px-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-fg">
            Concepto
          </span>
          Rediseño independiente · no afiliado oficialmente con DDTech · precios y datos demostrativos
        </p>
        <Link href="/propuesta" className="hidden shrink-0 items-center gap-1 font-medium text-fg-muted transition-colors hover:text-fg sm:inline-flex">
          Ver la propuesta <ArrowRight className="size-3" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
