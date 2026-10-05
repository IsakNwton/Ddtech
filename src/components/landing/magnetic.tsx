"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Botón magnético: sigue sutilmente al cursor y vuelve con un resorte */
export function MagneticLink({
  href,
  children,
  variant = "primary",
  className,
  block = false,
  ...rest
}: { href: string; children: ReactNode; variant?: "primary" | "ghost"; block?: boolean } & Omit<ComponentProps<typeof Link>, "href" | "children">) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.span
      style={{ x: sx, y: sy }}
      className={block ? "block" : "inline-block"}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link
        href={href}
        className={cn(
          "group relative inline-flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 text-[0.9375rem] font-semibold tracking-[-0.01em] transition-[transform,box-shadow] duration-300 active:scale-[0.97]",
          variant === "primary"
            ? "bg-white text-[#07080a] shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_20px_60px_-15px_rgba(77,124,255,0.9)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_24px_80px_-10px_rgba(77,124,255,1)]"
            : "border border-white/15 bg-white/[0.04] text-white backdrop-blur-xl hover:border-white/30 hover:bg-white/[0.08]",
          className,
        )}
        {...rest}
      >
        {variant === "primary" && (
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#b9cbff]/70 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            aria-hidden
          />
        )}
        <span className="relative inline-flex items-center gap-2.5">{children}</span>
      </Link>
    </motion.span>
  );
}
