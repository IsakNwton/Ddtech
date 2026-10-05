"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Aparición al entrar en pantalla: desplazamiento + desenfoque, una sola vez */
export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const word: Variants = {
  hidden: { y: "110%", rotate: 6, opacity: 0 },
  show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 1, ease: EASE } },
};

/** Titular que se revela palabra por palabra */
export function SplitHeading({
  lines,
  className,
  as = "h2",
  immediate = false,
  delay = 0,
}: {
  lines: { text: string; className?: string }[];
  className?: string;
  as?: "h1" | "h2";
  immediate?: boolean;
  delay?: number;
}) {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
      transition={{ delayChildren: delay }}
      aria-label={lines.map((l) => l.text).join(" ")}
    >
      {lines.map((l, li) => (
        <span key={li} className="block" aria-hidden>
          {l.text.split(" ").map((w, wi) => (
            <span key={wi} className="mr-[0.24em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0">
              <motion.span variants={word} className={cn("inline-block origin-bottom-left", l.className)}>
                {w}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
