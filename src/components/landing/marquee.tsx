import { cn } from "@/lib/cn";

/** Marquesina infinita (CSS puro, sin JS) */
export function Marquee({ items, reverse, className, itemClassName }: { items: string[]; reverse?: boolean; className?: string; itemClassName?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]", className)} aria-hidden>
      <div className={cn("flex shrink-0 animate-marquee items-center gap-12 pr-12", reverse && "[animation-direction:reverse]")}>
        {row.map((t, i) => (
          <span key={i} className={cn("shrink-0 whitespace-nowrap", itemClassName)}>
            {t}
          </span>
        ))}
      </div>
      <div className={cn("flex shrink-0 animate-marquee items-center gap-12 pr-12", reverse && "[animation-direction:reverse]")}>
        {row.map((t, i) => (
          <span key={i} className={cn("shrink-0 whitespace-nowrap", itemClassName)}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
