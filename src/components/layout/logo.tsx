import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Wordmark conceptual. No reproduce el logotipo oficial de DDTech:
 * en una implementación real se sustituye por el activo de marca original.
 */
export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="DDTech — inicio (concepto)" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 place-items-center rounded-[9px] bg-brand shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_4px_14px_-4px_rgb(47_95_240/0.8)] transition-transform duration-200 group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="size-[19px]" aria-hidden>
          <path d="M3 5h5.2a7 7 0 0 1 0 14H3V5Zm3.2 3v8h2a4 4 0 0 0 0-8h-2Z" fill="white" />
          <path d="M13.2 5h2.6a7 7 0 0 1 0 14h-2.6v-3h2.6a4 4 0 0 0 0-8h-2.6V5Z" fill="white" fillOpacity="0.6" />
        </svg>
      </span>
      {!compact && (
        <span className="text-[1.1875rem] font-bold tracking-[-0.04em] text-fg">
          DD<span className="text-fg-muted">Tech</span>
        </span>
      )}
    </Link>
  );
}
