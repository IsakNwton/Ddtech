"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { EASE_GALLERY } from "@/lib/motion";
import type { TimelineEntry } from "@/lib/types";

/** Línea del tiempo: el trazo dorado avanza con el desplazamiento */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol ref={ref} className="relative ml-2 sm:ml-0">
      <span className="absolute bottom-2 left-[5px] top-2 w-px bg-line sm:left-[calc(9rem+5px)]" aria-hidden />
      <motion.span
        className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-gold sm:left-[calc(9rem+5px)]"
        style={{ scaleY: progress }}
        aria-hidden
      />
      {entries.map((e, i) => (
        <motion.li
          key={`${e.year}-${i}`}
          className="relative grid gap-2 pb-14 pl-10 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-0 sm:pl-0"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1, ease: EASE_GALLERY }}
        >
          <span className="absolute left-0 top-2 size-[11px] rounded-full border border-gold bg-paper sm:left-[9rem]" aria-hidden />
          <p className="font-display text-2xl italic text-gold-ink sm:pr-10 sm:text-right">{e.year}</p>
          <div className="sm:pl-12">
            <h3 className="font-display text-[1.75rem] leading-tight">{e.title}</h3>
            <p className="mt-2 max-w-xl text-[1.0625rem] leading-relaxed text-muted-text">{e.text}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
