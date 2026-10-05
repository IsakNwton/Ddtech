"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Piezas 3D procedurales (sin modelos externos): ligeras, nítidas a cualquier
 * resolución y fáciles de recolorear con el acento de marca.
 */

export const BRAND = "#4d7cff";
export const BRAND_2 = "#7c5cff";

export function useMaterials() {
  return useMemo(
    () => ({
      shroud: new THREE.MeshPhysicalMaterial({ color: "#0e0f13", metalness: 0.55, roughness: 0.36, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.55 }),
      graphite: new THREE.MeshPhysicalMaterial({ color: "#1b1d23", metalness: 0.8, roughness: 0.42, clearcoat: 0.6, envMapIntensity: 0.7 }),
      darkMetal: new THREE.MeshStandardMaterial({ color: "#0c0d10", metalness: 0.7, roughness: 0.55 }),
      silver: new THREE.MeshStandardMaterial({ color: "#c9ced6", metalness: 1, roughness: 0.22 }),
      aluminum: new THREE.MeshStandardMaterial({ color: "#6f7680", metalness: 1, roughness: 0.4, envMapIntensity: 0.6 }),
      gold: new THREE.MeshStandardMaterial({ color: "#d4a74a", metalness: 1, roughness: 0.28 }),
      copper: new THREE.MeshStandardMaterial({ color: "#c27a4a", metalness: 1, roughness: 0.3 }),
      pcb: new THREE.MeshStandardMaterial({ color: "#090b0e", metalness: 0.4, roughness: 0.75, envMapIntensity: 0.35 }),
      blade: new THREE.MeshPhysicalMaterial({ color: "#0b0c0f", metalness: 0.3, roughness: 0.5, clearcoat: 0.6, envMapIntensity: 0.45, side: THREE.DoubleSide }),
      rubber: new THREE.MeshStandardMaterial({ color: "#07080a", metalness: 0, roughness: 0.9 }),
      glow: new THREE.MeshStandardMaterial({ color: BRAND, emissive: BRAND, emissiveIntensity: 4, toneMapped: false }),
      glow2: new THREE.MeshStandardMaterial({ color: BRAND_2, emissive: BRAND_2, emissiveIntensity: 3.2, toneMapped: false }),
      white: new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#dfe7ff", emissiveIntensity: 2.4, toneMapped: false }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0,
        roughness: 0.04,
        transparent: true,
        opacity: 0.035,
        clearcoat: 1,
        envMapIntensity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    }),
    [],
  );
}

export type Materials = ReturnType<typeof useMaterials>;

/* ------------------------------------------------------------------ */
/* Ventilador                                                          */
/* ------------------------------------------------------------------ */
export function Fan({
  radius = 0.42,
  blades = 11,
  speed = 6,
  m,
  ring = false,
  ringMaterial,
}: {
  radius?: number;
  blades?: number;
  speed?: number;
  m: Materials;
  ring?: boolean;
  ringMaterial?: THREE.Material;
}) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (rotor.current) rotor.current.rotation.z -= dt * speed;
  });
  const bladeGeo = useMemo(() => {
    const r = radius;
    const s = new THREE.Shape();
    s.moveTo(r * 0.24, -r * 0.06);
    s.bezierCurveTo(r * 0.45, -r * 0.32, r * 0.78, -r * 0.4, r * 0.95, -r * 0.18);
    s.bezierCurveTo(r * 0.88, r * 0.02, r * 0.6, r * 0.12, r * 0.26, r * 0.12);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: r * 0.02, bevelEnabled: true, bevelThickness: r * 0.01, bevelSize: r * 0.01, bevelSegments: 2, curveSegments: 16 });
    return g;
  }, [radius]);

  return (
    <group>
      {/* Marco */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={m.darkMetal}>
        <cylinderGeometry args={[radius * 1.02, radius * 1.02, radius * 0.18, 48, 1, true]} />
      </mesh>
      <mesh material={m.graphite}>
        <torusGeometry args={[radius * 1.02, radius * 0.035, 12, 64]} />
      </mesh>
      {ring && (
        <mesh position={[0, 0, radius * 0.03]} material={ringMaterial ?? m.glow}>
          <torusGeometry args={[radius * 0.97, radius * 0.018, 8, 96]} />
        </mesh>
      )}
      {/* Rotor */}
      <group ref={rotor}>
        {Array.from({ length: blades }).map((_, i) => (
          <mesh key={i} geometry={bladeGeo} material={m.blade} rotation={[0, 0.32, (i / blades) * Math.PI * 2]} position={[0, 0, -radius * 0.02]} />
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, radius * 0.02]} material={m.graphite}>
          <cylinderGeometry args={[radius * 0.26, radius * 0.28, radius * 0.16, 40]} />
        </mesh>
        <mesh position={[0, 0, radius * 0.11]} material={m.silver}>
          <circleGeometry args={[radius * 0.15, 40]} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Tarjeta gráfica                                                     */
/* ------------------------------------------------------------------ */
const L = 3.2;
const Hh = 1.25;
const D = 0.36;

export function GpuModel({ m, fanSpeed = 6 }: { m: Materials; fanSpeed?: number }) {
  const shroudGeo = useMemo(() => {
    const x0 = -L / 2;
    const x1 = L / 2;
    const y0 = -Hh / 2;
    const y1 = Hh / 2;
    const s = new THREE.Shape();
    s.moveTo(x0 + 0.2, y1);
    s.lineTo(x1 - 0.42, y1);
    s.lineTo(x1, y1 - 0.34);
    s.lineTo(x1, y0 + 0.12);
    s.lineTo(x1 - 0.12, y0);
    s.lineTo(x0 + 0.12, y0);
    s.lineTo(x0, y0 + 0.12);
    s.lineTo(x0, y1 - 0.2);
    s.closePath();
    for (const cx of [-1.02, 0, 1.02]) {
      const h = new THREE.Path();
      h.absarc(cx, -0.01, 0.47, 0, Math.PI * 2, false);
      s.holes.push(h);
    }
    const g = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 4, curveSegments: 48 });
    g.translate(0, 0, -D / 2);
    return g;
  }, []);

  const fins = useMemo(() => Array.from({ length: 58 }, (_, i) => -L / 2 + 0.12 + i * ((L - 0.24) / 57)), []);

  return (
    <group>
      {/* Cuerpo */}
      <mesh geometry={shroudGeo} material={m.shroud} castShadow />
      {/* Disipador visible a través de los huecos */}
      <group position={[0, -0.01, -0.06]}>
        {fins.map((x) => (
          <mesh key={x} position={[x, 0, 0]} material={m.aluminum}>
            <boxGeometry args={[0.012, Hh * 0.86, 0.22]} />
          </mesh>
        ))}
        {/* Heatpipes */}
        {[-0.28, -0.1, 0.08, 0.26].map((y) => (
          <mesh key={y} position={[0, y, 0.06]} rotation={[0, 0, Math.PI / 2]} material={m.copper}>
            <cylinderGeometry args={[0.03, 0.03, L * 0.92, 16]} />
          </mesh>
        ))}
      </group>
      {/* Ventiladores */}
      {[-1.02, 0, 1.02].map((x, i) => (
        <group key={x} position={[x, -0.01, D / 2 - 0.02]}>
          <Fan m={m} speed={fanSpeed * (i % 2 ? -1 : 1)} ring={i === 2} />
        </group>
      ))}
      {/* Acentos luminosos */}
      <mesh position={[-0.35, Hh / 2 - 0.08, D / 2 + 0.04]} material={m.glow}>
        <boxGeometry args={[1.9, 0.018, 0.01]} />
      </mesh>
      <mesh position={[0.95, -Hh / 2 + 0.08, D / 2 + 0.04]} material={m.glow2}>
        <boxGeometry args={[1.0, 0.018, 0.01]} />
      </mesh>
      {/* Tira RGB superior */}
      <mesh position={[-0.2, Hh / 2 + 0.035, D / 2 - 0.02]} material={m.glow}>
        <boxGeometry args={[2.3, 0.02, 0.035]} />
      </mesh>
      {/* Backplate */}
      <mesh position={[0, 0, -D / 2 - 0.06]} material={m.graphite} castShadow>
        <boxGeometry args={[L - 0.02, Hh - 0.02, 0.04]} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0.4 + i * 0.12, 0.25, -D / 2 - 0.085]} material={m.darkMetal}>
          <boxGeometry args={[0.05, 0.5, 0.01]} />
        </mesh>
      ))}
      {/* Conector de energía */}
      <mesh position={[0.55, Hh / 2 + 0.05, -0.02]} material={m.rubber}>
        <boxGeometry args={[0.28, 0.08, 0.14]} />
      </mesh>
      {/* Bracket */}
      <group position={[-L / 2 - 0.06, 0.06, -0.08]}>
        <mesh material={m.silver}>
          <boxGeometry args={[0.04, Hh + 0.32, 0.56]} />
        </mesh>
        {[-0.45, -0.2, 0.05, 0.3].map((y) => (
          <mesh key={y} position={[0.025, y, 0.08]} material={m.rubber}>
            <boxGeometry args={[0.012, 0.16, 0.22]} />
          </mesh>
        ))}
      </group>
      {/* Conector PCIe */}
      <mesh position={[-0.55, -Hh / 2 - 0.09, -0.12]} material={m.pcb}>
        <boxGeometry args={[1.5, 0.12, 0.05]} />
      </mesh>
      <mesh position={[-0.55, -Hh / 2 - 0.14, -0.12]} material={m.gold}>
        <boxGeometry args={[1.42, 0.06, 0.056]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Memoria RAM                                                         */
/* ------------------------------------------------------------------ */
export function RamStick({ m, glow }: { m: Materials; glow?: THREE.Material }) {
  return (
    <group>
      <mesh material={m.pcb} position={[0, -0.32, 0]}>
        <boxGeometry args={[0.03, 0.12, 1.3]} />
      </mesh>
      <mesh material={m.graphite} castShadow>
        <boxGeometry args={[0.06, 0.55, 1.32]} />
      </mesh>
      <mesh material={glow ?? m.glow} position={[0, 0.29, 0]}>
        <boxGeometry args={[0.05, 0.04, 1.26]} />
      </mesh>
    </group>
  );
}
