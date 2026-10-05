"use client";

import { Instance, Instances } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { RealFan } from "./fan";
import type { Pbr } from "./pbr";

/* Componentes con medidas reales (1 unidad = 100 mm). Diseños genéricos. */

/* ------------------------------------------------------------------ */
/* Tarjeta madre ATX (244 × 305 mm)                                    */
/* ------------------------------------------------------------------ */
export const ATX = { w: 2.44, h: 3.05 };
export const SOCKET = { x: -0.15, y: 0.75 };
export const PCIE_Y = -0.3;

function FinBlock({ m, size, fins = 12, axis = "x" }: { m: Pbr; size: [number, number, number]; fins?: number; axis?: "x" | "y" }) {
  const [w, h, d] = size;
  return (
    <group>
      <mesh position={[0, 0, d * 0.25]} material={m.gunmetal}>
        <boxGeometry args={[w, h, d * 0.5]} />
      </mesh>
      <Instances limit={fins} material={m.anodized}>
        <boxGeometry args={axis === "x" ? [w / fins / 2, h, d * 0.5] : [w, h / fins / 2, d * 0.5]} />
        {Array.from({ length: fins }).map((_, i) => (
          <Instance key={i} position={axis === "x" ? [-w / 2 + (i + 0.5) * (w / fins), 0, d * 0.75] : [0, -h / 2 + (i + 0.5) * (h / fins), d * 0.75]} />
        ))}
      </Instances>
    </group>
  );
}

export function Motherboard({ m }: { m: Pbr }) {
  const caps = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 9; i++) out.push([-0.72 + i * 0.075, 1.32]);
    for (let i = 0; i < 6; i++) out.push([-0.88, 0.95 - i * 0.075]);
    return out;
  }, []);
  return (
    <group>
      {/* PCB */}
      <mesh material={m.pcb} receiveShadow>
        <boxGeometry args={[ATX.w, ATX.h, 0.02]} />
      </mesh>
      {/* Cubierta de E/S */}
      <group position={[-1.0, 1.05, 0.02]}>
        <mesh position={[0, 0, 0.2]} material={m.shroud}>
          <boxGeometry args={[0.38, 0.9, 0.4]} />
        </mesh>
        <mesh position={[0.19, 0.0, 0.21]} material={m.gunmetal}>
          <boxGeometry args={[0.02, 0.8, 0.36]} />
        </mesh>
      </group>
      {/* Disipadores de VRM */}
      <group position={[-0.15, 1.3, 0.01]}>
        <FinBlock m={m} size={[1.0, 0.28, 0.3]} fins={14} />
      </group>
      <group position={[-0.68, 0.7, 0.01]}>
        <FinBlock m={m} size={[0.24, 0.75, 0.3]} fins={10} axis="y" />
      </group>
      {/* Capacitores */}
      <Instances limit={caps.length} material={m.capacitor}>
        <cylinderGeometry args={[0.024, 0.024, 0.08, 16]} />
        {caps.map(([x, y], i) => (
          <Instance key={i} position={[x, y - 0.2, 0.05]} rotation={[Math.PI / 2, 0, 0]} />
        ))}
      </Instances>
      {/* Socket con marco de retención */}
      <group position={[SOCKET.x, SOCKET.y, 0.01]}>
        <mesh position={[0, 0, 0.02]} material={m.steel}>
          <boxGeometry args={[0.62, 0.62, 0.03]} />
        </mesh>
        <mesh position={[0, 0, 0.036]} material={m.plastic}>
          <boxGeometry args={[0.46, 0.46, 0.01]} />
        </mesh>
        <mesh position={[0.36, -0.1, 0.03]} rotation={[0, 0, Math.PI / 2]} material={m.steel}>
          <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
        </mesh>
      </group>
      {/* Ranuras DIMM */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[0.42 + i * 0.085, 0.72, 0.01]}>
          <mesh position={[0, 0, 0.035]} material={m.plastic}>
            <boxGeometry args={[0.05, 1.38, 0.07]} />
          </mesh>
          <mesh position={[0, 0.7, 0.05]} material={m.shroudGloss}>
            <boxGeometry args={[0.05, 0.05, 0.08]} />
          </mesh>
        </group>
      ))}
      {/* Conector ATX de 24 pines */}
      <mesh position={[1.12, 0.4, 0.07]} material={m.plastic}>
        <boxGeometry args={[0.1, 0.55, 0.14]} />
      </mesh>
      {/* Ranura PCIe x16 reforzada */}
      <group position={[-0.25, PCIE_Y, 0.01]}>
        <mesh position={[0, 0, 0.05]} material={m.steel}>
          <boxGeometry args={[1.0, 0.1, 0.1]} />
        </mesh>
        <mesh position={[0, 0, 0.1]} material={m.plastic}>
          <boxGeometry args={[0.96, 0.03, 0.01]} />
        </mesh>
      </group>
      <mesh position={[-0.42, -1.05, 0.04]} material={m.plastic}>
        <boxGeometry args={[0.65, 0.08, 0.06]} />
      </mesh>
      {/* Disipador M.2 inferior y del chipset */}
      <group position={[-0.1, -1.32, 0.01]}>
        <FinBlock m={m} size={[0.95, 0.24, 0.1]} fins={8} />
      </group>
      <group position={[0.75, -1.0, 0.01]}>
        <mesh position={[0, 0, 0.06]} material={m.gunmetal}>
          <boxGeometry args={[0.55, 0.5, 0.12]} />
        </mesh>
        <mesh position={[0, 0, 0.122]} material={m.shroud}>
          <boxGeometry args={[0.4, 0.34, 0.01]} />
        </mesh>
      </group>
      {/* Conectores SATA y del panel frontal */}
      <Instances limit={6} material={m.plastic}>
        <boxGeometry args={[0.07, 0.05, 0.08]} />
        {Array.from({ length: 6 }).map((_, i) => (
          <Instance key={i} position={[1.15, -0.7 - (i % 3) * 0.08, 0.05 + Math.floor(i / 3) * 0.08]} />
        ))}
      </Instances>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Procesador (sustrato + IHS con muescas, estilo AM5)                 */
/* ------------------------------------------------------------------ */
export function Cpu({ m }: { m: Pbr }) {
  const ihs = useMemo(() => {
    const s = 0.4;
    const n = 0.05;
    const shape = new THREE.Shape();
    shape.moveTo(-s / 2, -s / 2);
    shape.lineTo(s / 2, -s / 2);
    shape.lineTo(s / 2, -0.09);
    shape.lineTo(s / 2 - n, -0.09);
    shape.lineTo(s / 2 - n, 0.09);
    shape.lineTo(s / 2, 0.09);
    shape.lineTo(s / 2, s / 2);
    shape.lineTo(-s / 2, s / 2);
    shape.lineTo(-s / 2, 0.09);
    shape.lineTo(-s / 2 + n, 0.09);
    shape.lineTo(-s / 2 + n, -0.09);
    shape.lineTo(-s / 2, -0.09);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3 });
  }, []);
  return (
    <group>
      <mesh material={m.pcb}>
        <boxGeometry args={[0.45, 0.45, 0.012]} />
      </mesh>
      <mesh geometry={ihs} position={[0, 0, 0.006]} material={m.silver} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Enfriamiento líquido 360 mm                                         */
/* ------------------------------------------------------------------ */
export function AioPump({ m }: { m: Pbr }) {
  return (
    <group>
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} material={m.paintedSteel}>
        <cylinderGeometry args={[0.3, 0.32, 0.24, 64]} />
      </mesh>
      <mesh position={[0, 0, 0.245]} rotation={[Math.PI / 2, 0, 0]} material={m.anodized}>
        <cylinderGeometry args={[0.27, 0.3, 0.02, 64]} />
      </mesh>
      <mesh position={[0, 0, 0.256]} material={m.shroudGloss}>
        <circleGeometry args={[0.24, 64]} />
      </mesh>
      <mesh position={[0, 0, 0.258]} material={m.lightbar}>
        <torusGeometry args={[0.245, 0.006, 8, 96]} />
      </mesh>
      {/* Codos de las mangueras */}
      {[0.1, -0.1].map((y) => (
        <mesh key={y} position={[0.29, y, 0.16]} rotation={[0, 0, Math.PI / 2]} material={m.gunmetal}>
          <cylinderGeometry args={[0.045, 0.045, 0.1, 24]} />
        </mesh>
      ))}
    </group>
  );
}

export function Radiator360({ m, fanSpeed = 5 }: { m: Pbr; fanSpeed?: number }) {
  // Radiador 394 × 120 × 27 mm con tres ventiladores de 120 mm debajo
  return (
    <group>
      <mesh material={m.paintedSteel}>
        <boxGeometry args={[3.94, 0.27, 1.2]} />
      </mesh>
      <Instances limit={80} material={m.anodized}>
        <boxGeometry args={[0.012, 0.25, 1.1]} />
        {Array.from({ length: 80 }).map((_, i) => (
          <Instance key={i} position={[-1.78 + i * 0.045, -0.01, 0]} />
        ))}
      </Instances>
      {[-1.25, 0, 1.25].map((x) => (
        <group key={x} position={[x, -0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={m.plastic}>
            <boxGeometry args={[1.2, 1.2, 0.25]} />
          </mesh>
          <group position={[0, 0, 0.13]}>
            <RealFan m={m} radius={0.56} blades={9} speed={fanSpeed} ringLight />
          </group>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Memoria DDR5 con disipador y difusor de luz                         */
/* ------------------------------------------------------------------ */
export function RamStick({ m }: { m: Pbr }) {
  return (
    <group>
      <mesh position={[0, 0, 0.12]} material={m.pcb}>
        <boxGeometry args={[0.012, 1.33, 0.24]} />
      </mesh>
      <mesh position={[0, 0, 0.2]} material={m.gunmetal}>
        <boxGeometry args={[0.07, 1.36, 0.34]} />
      </mesh>
      <mesh position={[0.036, 0.1, 0.2]} material={m.shroud}>
        <boxGeometry args={[0.003, 0.9, 0.22]} />
      </mesh>
      <mesh position={[0, 0, 0.395]} material={m.lightWarm}>
        <boxGeometry args={[0.05, 1.3, 0.05]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Fuente de poder ATX (150 × 86 × 160 mm)                             */
/* ------------------------------------------------------------------ */
export function Psu({ m }: { m: Pbr }) {
  return (
    <group>
      <mesh material={m.paintedSteel} castShadow>
        <boxGeometry args={[1.6, 0.86, 1.5]} />
      </mesh>
      {/* Rejilla del ventilador (cara superior) */}
      <mesh position={[0, 0.432, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.mesh}>
        <circleGeometry args={[0.62, 64]} />
      </mesh>
      <group position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <RealFan m={m} radius={0.6} blades={7} speed={4} />
      </group>
      {/* Etiqueta lateral */}
      <mesh position={[0, 0, 0.752]} material={m.gunmetal}>
        <planeGeometry args={[1.2, 0.5]} />
      </mesh>
      {/* Conectores modulares */}
      <Instances limit={6} material={m.plastic}>
        <boxGeometry args={[0.02, 0.12, 0.18]} />
        {Array.from({ length: 6 }).map((_, i) => (
          <Instance key={i} position={[0.81, 0.2 - Math.floor(i / 3) * 0.2, -0.4 + (i % 3) * 0.28]} />
        ))}
      </Instances>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* SSD M.2 con disipador                                               */
/* ------------------------------------------------------------------ */
export function M2Heatsink({ m }: { m: Pbr }) {
  return (
    <group>
      <FinBlock m={m} size={[0.95, 0.24, 0.1]} fins={10} />
      <mesh position={[0, -0.11, 0.1]} material={m.lightbar}>
        <boxGeometry args={[0.7, 0.008, 0.008]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Gabinete mid-tower con cristal templado                             */
/* ------------------------------------------------------------------ */
export const CASE = { x0: -2.3, x1: 2.3, y0: -2.35, y1: 2.85, z0: -1.15, z1: 1.15 };

export function PcCase({ m, fanSpeed = 4 }: { m: Pbr; fanSpeed?: number }) {
  const { x0, x1, y0, y1, z0, z1 } = CASE;
  const W = x1 - x0;
  const H = y1 - y0;
  const D = z1 - z0;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const t = 0.04;
  return (
    <group>
      {/* Panel trasero (bandeja de la tarjeta madre) */}
      <mesh position={[cx, cy, z0]} material={m.paintedSteel} receiveShadow>
        <boxGeometry args={[W, H, t]} />
      </mesh>
      {/* Techo con malla, piso */}
      <mesh position={[cx, y1, 0]} material={m.mesh}>
        <boxGeometry args={[W, t, D]} />
      </mesh>
      <mesh position={[cx, y1 + 0.02, 0]} material={m.paintedSteel}>
        <boxGeometry args={[W + 0.04, 0.012, D + 0.04]} />
      </mesh>
      <mesh position={[cx, y0, 0]} material={m.paintedSteel}>
        <boxGeometry args={[W, t, D]} />
      </mesh>
      {/* Panel frontal de malla */}
      <mesh position={[x1 + 0.06, cy, 0]} material={m.mesh}>
        <boxGeometry args={[0.03, H, D]} />
      </mesh>
      <mesh position={[x1 + 0.1, cy, 0]} material={m.shroud}>
        <boxGeometry args={[0.05, H + 0.04, D + 0.04]} />
      </mesh>
      {/* Panel trasero con ranuras de expansión */}
      <mesh position={[x0, cy, 0]} material={m.paintedSteel}>
        <boxGeometry args={[t, H, D]} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[x0 - 0.01, 0.35 - i * 0.2, -0.3]} material={m.steel}>
          <boxGeometry args={[0.01, 0.12, 0.6]} />
        </mesh>
      ))}
      {/* Cubierta de la fuente */}
      <mesh position={[cx, -1.38, 0]} material={m.paintedSteel}>
        <boxGeometry args={[W, 0.03, D]} />
      </mesh>
      <mesh position={[cx, (y0 - 1.38) / 2, z1 - 0.02]} material={m.mesh}>
        <boxGeometry args={[W, -1.38 - y0, 0.02]} />
      </mesh>
      {/* Cristal templado con borde serigrafiado */}
      <mesh position={[cx, cy, z1 + 0.02]} material={m.glass}>
        <boxGeometry args={[W, H, 0.04]} />
      </mesh>
      {[
        [cx, y1 - 0.06, W, 0.12],
        [cx, y0 + 0.06, W, 0.12],
        [x0 + 0.06, cy, 0.12, H],
        [x1 - 0.06, cy, 0.12, H],
      ].map(([px, py, w, h], i) => (
        <mesh key={i} position={[px, py, z1 + 0.045]} material={m.shroudGloss}>
          <boxGeometry args={[w, h, 0.004]} />
        </mesh>
      ))}
      {/* Ventiladores frontales (entrada) y trasero (salida) */}
      {[1.55, 0.3, -0.95].map((y) => (
        <group key={y} position={[x1 - 0.15, y, 0.05]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh material={m.plastic}>
            <boxGeometry args={[1.2, 1.2, 0.25]} />
          </mesh>
          <group position={[0, 0, 0.13]}>
            <RealFan m={m} radius={0.56} blades={9} speed={fanSpeed} ringLight />
          </group>
        </group>
      ))}
      <group position={[x0 + 0.15, 2.0, -0.35]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={m.plastic}>
          <boxGeometry args={[1.2, 1.2, 0.25]} />
        </mesh>
        <group position={[0, 0, 0.13]}>
          <RealFan m={m} radius={0.56} blades={9} speed={fanSpeed} ringLight />
        </group>
      </group>
      {/* Patas */}
      {[x0 + 0.5, x1 - 0.5].map((x) => (
        <mesh key={x} position={[x, y0 - 0.08, 0]} material={m.rubber}>
          <boxGeometry args={[0.6, 0.12, D - 0.3]} />
        </mesh>
      ))}
    </group>
  );
}
