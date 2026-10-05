import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal, SplitHeading } from "./reveal";

/** Encabezado de sección de la landing: etiqueta, titular en dos tonos y bajada */
export function SectionHeading({
  id,
  eyebrow,
  title,
  accent,
  children,
  align = "left",
  className,
  accentClassName = "text-white/40",
}: {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
  accentClassName?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <SplitHeading
        className="mt-5 text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl"
        lines={[{ text: title }, { text: accent, className: accentClassName }]}
      />
      <span id={id} className="sr-only">
        {title} {accent}
      </span>
      {children && (
        <Reveal delay={0.15}>
          <p className={cn("mt-5 text-pretty text-lg leading-relaxed text-white/55", align === "center" && "mx-auto max-w-xl")}>{children}</p>
        </Reveal>
      )}
    </div>
  );
}
