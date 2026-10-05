"use client";

import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { RealGpu } from "./gpu";
import { usePbr } from "./pbr";
import { AioPump, ATX, Cpu, M2Heatsink, Motherboard, PcCase, Psu, RamStick, Radiator360, SOCKET, PCIE_Y } from "./pc-parts";
import { Stage } from "./stage";

/**
 * PC realista que se ensambla con el scroll: cada pieza viaja desde su posición
 * "explotada" hasta su lugar dentro de un gabinete mid-tower a escala real.
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
  spin = [0.5, 1, 0.3],
  children,
  position,
  rotation,
}: {
  progress: RefObject<number>;
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
    const o = 0.62;
    g.position.set(
      position[0] + offset[0] * o * k + Math.sin(t * 0.8 + index) * 0.08 * k,
      position[1] + offset[1] * o * k + Math.cos(t * 0.7 + index) * 0.08 * k,
      position[2] + offset[2] * o * k,
    );
    const r = rotation ?? [0, 0, 0];
    g.rotation.set(r[0] + spin[0] * k, r[1] + spin[1] * k, r[2] + spin[2] * k);
  });
  return <group ref={ref}>{children}</group>;
}

// Posiciones de montaje (mm reales / 100)
const MB = { x: -2.15 + ATX.w / 2, y: 2.6 - ATX.h / 2, z: -1.09 };
const SOCK = { x: MB.x + SOCKET.x, y: MB.y + SOCKET.y };

function Tubes() {
  const m = usePbr();
  const geos = useMemo(
    () =>
      [-0.1, 0.1].map((dy, i) =>
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(SOCK.x + 0.36, SOCK.y + dy, -0.87),
            new THREE.Vector3(SOCK.x + 0.8, SOCK.y + dy + 0.1, -0.7 + i * 0.05),
            new THREE.Vector3(0.6, 2.05 + dy, -0.25 + i * 0.1),
            new THREE.Vector3(1.55, 2.38, 0.05 + i * 0.2),
          ]),
          64,
          0.045,
          16,
          false,
        ),
      ),
    [],
  );
  return (
    <>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} material={m.rubber} />
      ))}
    </>
  );
}

function Build({ progress }: { progress: MotionValue<number> }) {
  const m = usePbr();
  const p = useRef(0);
  const rig = useRef<THREE.Group>(null);
  const { size } = useThree();
  const wide = size.width >= 1024;

  useFrame((state, dt) => {
    // Se sobrepasa ligeramente el 100 % para que el ensamblaje termine antes del final del scroll
    p.current = THREE.MathUtils.damp(p.current, Math.min(1, progress.get() * 1.12), 6, dt);
    const g = rig.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = THREE.MathUtils.lerp(-0.9, -0.38, p.current) + Math.sin(t * 0.25) * 0.04 + state.pointer.x * 0.07;
    g.rotation.x = THREE.MathUtils.lerp(0.26, 0.1, p.current) - state.pointer.y * 0.04;
    const s = THREE.MathUtils.lerp(0.5, 0.56, p.current) * (wide ? 1 : 0.7);
    g.scale.setScalar(s);
    g.position.x = THREE.MathUtils.damp(g.position.x, wide ? 0.6 : 0, 4, dt);
    g.position.y = wide ? -0.15 : 0.1;
  });

  return (
    <group ref={rig}>
      {/* Iluminación interior del gabinete */}
      <pointLight position={[0.4, 1.6, 0.6]} intensity={5.5} distance={7} color="#c9d6ff" />
      <pointLight position={[1.4, -0.6, 0.3]} intensity={5} distance={5} color="#d8c9ff" />
      <Part progress={p} index={0} position={[MB.x, MB.y, MB.z]} offset={[0, 0.5, 4]} spin={[0.3, -0.7, 0.15]}>
        <Motherboard m={m} />
      </Part>
      <Part progress={p} index={1} position={[SOCK.x, SOCK.y, -1.05]} offset={[0.6, 1.6, 4]} spin={[1.1, 0.6, 0.8]}>
        <Cpu m={m} />
      </Part>
      <Part progress={p} index={2} position={[0, 0, 0]} offset={[-0.4, 2.2, 3.2]} spin={[0.2, 0.4, 0]}>
        <group position={[SOCK.x, SOCK.y, -1.03]}>
          <AioPump m={m} />
        </group>
        <group position={[-0.2, 2.62, 0.15]}>
          <Radiator360 m={m} />
        </group>
        <Tubes />
      </Part>
      <Part progress={p} index={3} position={[MB.x + 0.42, MB.y + 0.72, -1.07]} offset={[2.6, 1.2, 3]} spin={[0, 1.4, 0.8]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[i * 0.085, 0, 0]}>
            <RamStick m={m} />
          </group>
        ))}
      </Part>
      <Part progress={p} index={4} position={[MB.x, MB.y + 0.08, -1.07]} offset={[-2.6, 0.2, 3.5]} spin={[0.5, 1, 1.1]}>
        <M2Heatsink m={m} />
      </Part>
      <Part progress={p} index={5} position={[-0.715, MB.y + PCIE_Y - 0.262, -0.355]} rotation={[Math.PI / 2, 0, 0]} offset={[3.6, -0.4, 3]} spin={[0.4, 1.4, 0.5]}>
        <RealGpu m={m} fanSpeed={5} />
      </Part>
      <Part progress={p} index={6} position={[-1.3, -1.86, -0.25]} offset={[3, -1.6, 2.6]} spin={[0.5, -0.9, 0.3]}>
        <Psu m={m} />
      </Part>
      <Part progress={p} index={7} position={[0, 0, 0]} offset={[0, -8, 0]} spin={[0, 0.7, 0]}>
        <PcCase m={m} />
      </Part>
    </group>
  );
}

export default function AssemblyScene({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  return (
    <Stage className={className} camera={{ position: [0, 0.4, 8.6], fov: 36 }} bloom={0.55} env={1.1} keyLight={3.6}>
      <Build progress={progress} />
      <ContactShadows position={[0, -1.75, 0]} opacity={0.55} scale={14} blur={3} far={5} color="#000" />
    </Stage>
  );
}
