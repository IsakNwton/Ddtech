"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { EASE_GALLERY } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Desplazamiento vertical inicial en px */
  y?: number;
  as?: "div" | "section" | "li" | "article" | "figure" | "header";
};

/** Aparición al desplazarse: fundido + leve ascenso, una sola vez */
export function Reveal({ delay = 0, y = 28, as = "div", children, ...rest }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease: EASE_GALLERY, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Texto que emerge desde una máscara. Se observa el contenedor (no el texto recortado). */
export function MaskLine({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
        transition={{ duration: 1.25, ease: EASE_GALLERY, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
