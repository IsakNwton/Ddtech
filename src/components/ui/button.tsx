import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "glass" | "ghost" | "outline";
type Size = "md" | "lg" | "sm";

const base =
  "press group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.005em] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_10px_30px_-12px_rgb(20_16_10/0.55)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_16px_40px_-14px_rgb(20_16_10/0.6)] hover:bg-ink-soft",
  glass: "glass text-ink hover:bg-[color-mix(in_srgb,var(--glass-bg-strong)_100%,transparent)]",
  ghost: "text-ink hover:bg-ink/5",
  outline: "border border-line-strong text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}
