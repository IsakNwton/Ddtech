import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "Ver todo",
  aside,
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  hrefLabel?: string;
  aside?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-8", className)}>
      <div className="min-w-0 max-w-2xl">
        {eyebrow && (
          <p className="mb-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-brand-text">{eyebrow}</p>
        )}
        <h2 id={id} className="text-balance text-2xl font-semibold tracking-[-0.025em] text-fg md:text-[1.75rem]">
          {title}
        </h2>
        {description && <p className="mt-2 text-pretty text-sm text-fg-muted md:text-[0.9375rem]">{description}</p>}
      </div>
      {(href || aside) && (
        <div className="flex items-center gap-3">
          {href && (
            <Link
              href={href}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg"
            >
              {hrefLabel}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
          {aside}
        </div>
      )}
    </div>
  );
}
