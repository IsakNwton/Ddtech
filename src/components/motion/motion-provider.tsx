"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Respeta prefers-reduced-motion en todas las animaciones de Motion */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}>
      {children}
    </MotionConfig>
  );
}
