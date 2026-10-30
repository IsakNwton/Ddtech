/** Curvas y resortes compartidos: movimiento sereno, físicamente coherente */
export const EASE_GALLERY = [0.22, 1, 0.36, 1] as const;
export const EASE_SOFT = [0.33, 0, 0.15, 1] as const;

export const SPRING_SOFT = { type: "spring", stiffness: 170, damping: 26, mass: 1 } as const;
export const SPRING_SNAPPY = { type: "spring", stiffness: 380, damping: 32, mass: 0.7 } as const;
export const SPRING_GLASS = { type: "spring", stiffness: 260, damping: 28, mass: 0.8 } as const;
