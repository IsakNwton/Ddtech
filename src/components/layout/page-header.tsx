import type { ReactNode } from "react";
import { MaskLine, Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

/** Encabezado editorial de página: etiqueta, título serif y entradilla asimétrica */
export function PageHeader({
  eyebrow,
  title,
  intro,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto max-w-[1600px] px-5 pb-14 pt-36 sm:px-8 md:pt-44 lg:px-14 lg:pb-20", className)}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Reveal y={10}>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" aria-hidden />
              {eyebrow}
            </p>
          </Reveal>
          <h1 className="mt-6 font-display text-[3.4rem] leading-[0.95] tracking-[-0.025em] sm:text-7xl lg:text-[6.5rem]">
            <MaskLine>{title}</MaskLine>
          </h1>
        </div>
        {(intro || aside) && (
          <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9">
            {intro && <div className="text-[1.0625rem] leading-relaxed text-muted-text text-pretty">{intro}</div>}
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  );
}
