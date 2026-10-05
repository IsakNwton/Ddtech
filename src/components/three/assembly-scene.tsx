"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Fan, GpuModel, useMaterials, type Materials } from "./parts";
import { Stage } from "./stage";

/**
 * PC que se ensambla con el scroll: cada pieza viaja desde su posición "explotada"
 * hasta su lugar en el gabinete dentro de su propia ventana de progreso.
 */

export const ASSEMBLY_STEPS = 8;
const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

function Part({
  progress,
  index,
  offset,
  spin = [0.6, 1.2, 0.4],
  children,
  position,
  rotation,
}: {
  progress: { current: number };
  index: number;
  offset: [number, number, number];
  spin?: [number, number, number];
  children: ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const local = smooth((progress.current * ASSEMBLY_STEPS - index) / 0.85);
    const k = 1 - local;
    const t = state.clock.elapsedTime;
    const o = 0.62; // explosión contenida: las piezas flotan dentro del encuadre
    g.position.set(
      position[0] + offset[0] * o * k + Math.sin(t * 0.8 + index) * 0.06 * k,
      position[1] + offset[1] * o * k + Math.cos(t * 0.7 + index) * 0.06 * k,
      position[2] + offset[2] * o * k,
    );
    const r = rotation ?? [0, 0, 0];
    g.rotation.set(r[0] + spin[0] * k, r[1] + spin[1] * k, r[2] + spin[2] * k);
  });
  return <group ref={ref}>{children}</group>;
}

function CaseShell({ m }: { m: Materials }) {
  const W = 3.1;
  const H = 3.5;
  const Dz = 1.7;
  return (
    <group>
      {/* Panel trasero, superior, inferior, frontal y trasero (I/O) */}
      <mesh position={[0, 0, -Dz / 2]} material={m.graphite}>
        <boxGeometry args={[W, H, 0.04]} />
      </mesh>
      <mesh position={[0, H / 2, 0]} material={m.shroud}>
        <boxGeometry args={[W + 0.04, 0.06, Dz]} />
      </mesh>
      <mesh position={[0, -H / 2, 0]} material={m.shroud}>
        <boxGeometry args={[W + 0.04, 0.08, Dz]} />
      </mesh>
      <mesh position={[-W / 2, 0, 0]} material={m.shroud}>
        <boxGeometry args={[0.05, H, Dz]} />
      </mesh>
      <mesh position={[W / 2, 0, 0]} material={m.shroud}>
        <boxGeometry args={[0.05, H, Dz]} />
      </mesh>
      {/* Cubierta de la fuente */}
      <mesh position={[0, -H / 2 + 0.55, 0.05]} material={m.graphite}>
        <boxGeometry args={[W - 0.06, 0.05, Dz - 0.1]} />
      </mesh>
      {/* Cristal templado */}
      <mesh position={[0, 0, Dz / 2]} material={m.glass}>
        <boxGeometry args={[W, H, 0.02]} />
      </mesh>
      {/* Perfiles luminosos */}
      <mesh position={[-W / 2 + 0.03, 0, Dz / 2 - 0.03]} material={m.glow}>
        <boxGeometry args={[0.02, H - 0.2, 0.02]} />
      </mesh>
      <mesh position={[0, H / 2 - 0.03, Dz / 2 - 0.03]} material={m.glow2}>
        <boxGeometry args={[W - 0.2, 0.02, 0.02]} />
      </mesh>
      {/* Patas */}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, -H / 2 - 0.08, 0]} material={m.rubber}>
          <boxGeometry args={[0.4, 0.08, Dz - 0.2]} />
        </mesh>
      ))}
      {/* Ventiladores frontales */}
      {[0.95, 0, -0.95].map((y) => (
        <group key={y} position={[-W / 2 + 0.12, y + 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Fan m={m} radius={0.38} speed={5} ring />
        </group>
      ))}
    </group>
  );
}

function Build({ progress }: { progress: MotionValue<number> }) {
  const m = useMaterials();
  const p = useRef(0);
  const rig = useRef<THREE.Group>(null);
  const { size } = useThree();
  const wide = size.width >= 1024;

  useFrame((state, dt) => {
    p.current = THREE.MathUtils.damp(p.current, progress.get(), 6, dt);
    const g = rig.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = THREE.MathUtils.lerp(-0.95, -0.32, p.current) + Math.sin(t * 0.25) * 0.05 + state.pointer.x * 0.08;
    g.rotation.x = THREE.MathUtils.lerp(0.28, 0.08, p.current) - state.pointer.y * 0.04;
    const s = THREE.MathUtils.lerp(0.74, 0.82, p.current) * (wide ? 1 : 0.72);
    g.scale.setScalar(s);
    // En escritorio la PC se ubica entre la lista de pasos y la tarjeta de resultado
    g.position.x = THREE.MathUtils.damp(g.position.x, wide ? 0.55 : 0, 4, dt);
    g.position.y = wide ? 0 : 0.15;
  });

  return (
    <group ref={rig}>
      {/* 1. Tarjeta madre */}
      <Part progress={p} index={0} position={[-0.25, 0.35, -0.8]} offset={[0, 0.4, 3.2]} spin={[0.4, -0.8, 0.2]}>
        <mesh material={m.pcb}>
          <boxGeometry args={[2.1, 2.4, 0.04]} />
        </mesh>
        <mesh position={[-0.85, 0.65, 0.12]} material={m.graphite}>
          <boxGeometry args={[0.32, 1.0, 0.2]} />
        </mesh>
        <mesh position={[-0.2, 1.0, 0.1]} material={m.graphite}>
          <boxGeometry args={[1.0, 0.25, 0.16]} />
        </mesh>
        <mesh position={[0.55, -0.85, 0.06]} material={m.aluminum}>
          <boxGeometry args={[0.6, 0.45, 0.08]} />
        </mesh>
        <mesh position={[-0.05, -0.15, 0.04]} material={m.silver}>
          <boxGeometry args={[1.6, 0.06, 0.06]} />
        </mesh>
      </Part>
      {/* 2. Procesador */}
      <Part progress={p} index={1} position={[-0.3, 0.75, -0.74]} offset={[0.2, 2.6, 2.2]} spin={[1.2, 0.6, 0.8]}>
        <mesh material={m.silver}>
          <boxGeometry args={[0.42, 0.42, 0.05]} />
        </mesh>
        <mesh position={[0, 0, -0.03]} material={m.gold}>
          <boxGeometry args={[0.5, 0.5, 0.02]} />
        </mesh>
      </Part>
      {/* 3. Refrigeración líquida */}
      <Part progress={p} index={2} position={[-0.3, 0.75, -0.6]} offset={[-0.4, 3, 2.6]} spin={[0.9, 1.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.graphite}>
          <cylinderGeometry args={[0.3, 0.32, 0.22, 48]} />
        </mesh>
        <mesh position={[0, 0, 0.115]} material={m.rubber}>
          <circleGeometry args={[0.26, 48]} />
        </mesh>
        <mesh position={[0, 0, 0.12]} material={m.glow}>
          <torusGeometry args={[0.22, 0.012, 8, 64]} />
        </mesh>
        {/* Radiador y mangueras */}
        <mesh position={[0.3, 0.88, 0.45]} material={m.darkMetal}>
          <boxGeometry args={[2.3, 0.14, 0.8]} />
        </mesh>
        {[-0.45, 0.3, 1.05].map((x) => (
          <group key={x} position={[x, 0.79, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
            <Fan m={m} radius={0.34} speed={6} ring ringMaterial={m.glow2} />
          </group>
        ))}
        <mesh position={[0.22, 0.42, 0.18]} rotation={[0.4, 0, 0]} material={m.rubber}>
          <cylinderGeometry args={[0.04, 0.04, 0.85, 12]} />
        </mesh>
      </Part>
      {/* 4. Memoria RAM */}
      <Part progress={p} index={3} position={[0.42, 0.62, -0.62]} offset={[2.6, 1.4, 2]} spin={[0, 1.6, 0.9]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[i * 0.11, 0, 0]}>
            <mesh material={m.graphite}>
              <boxGeometry args={[0.055, 1.15, 0.34]} />
            </mesh>
            <mesh position={[0, 0, 0.18]} material={i % 2 ? m.glow2 : m.glow}>
              <boxGeometry args={[0.045, 1.1, 0.025]} />
            </mesh>
          </group>
        ))}
      </Part>
      {/* 5. Almacenamiento M.2 */}
      <Part progress={p} index={4} position={[-0.45, -0.05, -0.72]} offset={[-2.6, 0.6, 2.4]} spin={[0.5, 1, 1.2]}>
        <mesh material={m.aluminum}>
          <boxGeometry args={[0.85, 0.2, 0.07]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={m.glow}>
          <boxGeometry args={[0.6, 0.015, 0.01]} />
        </mesh>
      </Part>
      {/* 6. Tarjeta gráfica */}
      <Part progress={p} index={5} position={[0.05, -0.45, -0.32]} rotation={[Math.PI / 2, 0, 0]} offset={[3.4, -0.4, 2.6]} spin={[0.4, 1.6, 0.6]}>
        <group scale={0.66}>
          <GpuModel m={m} fanSpeed={5} />
        </group>
      </Part>
      {/* 7. Fuente de poder */}
      <Part progress={p} index={6} position={[0.62, -1.35, -0.1]} offset={[3, -1.6, 1.2]} spin={[0.6, -1, 0.3]}>
        <mesh material={m.shroud}>
          <boxGeometry args={[1.3, 0.62, 1.2]} />
        </mesh>
        <mesh position={[0, 0.315, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.darkMetal}>
          <circleGeometry args={[0.42, 48]} />
        </mesh>
        <mesh position={[-0.64, 0, 0]} material={m.glow2}>
          <boxGeometry args={[0.02, 0.4, 0.9]} />
        </mesh>
      </Part>
      {/* 8. Gabinete */}
      <Part progress={p} index={7} position={[0, 0, 0]} offset={[0, -6, 0]} spin={[0, 0.8, 0]}>
        <CaseShell m={m} />
      </Part>
    </group>
  );
}

export default function AssemblyScene({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  return (
    <Stage className={className} camera={{ position: [0, 0.4, 8.6], fov: 36 }} bloom={1}>
      <Build progress={progress} />
      <ContactShadows position={[0, -1.9, 0]} opacity={0.6} scale={14} blur={3} far={5} color="#000" />
    </Stage>
  );
}
