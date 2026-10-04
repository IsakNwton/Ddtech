import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";

/** Encabezado compacto de páginas de catálogo: el producto es el protagonista */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  aside,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="container-page pt-5">
      <Breadcrumbs items={crumbs} />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0 max-w-2xl">
          {eyebrow && <p className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-brand-text">{eyebrow}</p>}
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{title}</h1>
          {description && <p className="mt-2 text-pretty text-sm text-fg-muted sm:text-[0.9375rem]">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </div>
  );
}
