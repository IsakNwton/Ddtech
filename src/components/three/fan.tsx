"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Pbr } from "./pbr";

/**
 * Aspa con perfil real: barrido hacia adelante, torsión (más ángulo en la raíz)
 * y curvatura (camber). Superficie paramétrica con normales suaves.
 */
function bladeGeometry(rIn: number, rOut: number, segU = 16, segV = 12) {
  const pos: number[] = [];
  const idx: number[] = [];
  for (let iu = 0; iu <= segU; iu++) {
    const u = iu / segU;
    const r = rIn + (rOut - rIn) * u;
    const chord = THREE.MathUtils.lerp(0.5, 0.62, u); // más ancha hacia la punta
    const sweep = 0.42 * u * u; // barrido
    const depth = THREE.MathUtils.lerp(0.085, 0.04, u) * (rOut / 0.46); // torsión
    for (let iv = 0; iv <= segV; iv++) {
      const v = iv / segV;
      const theta = sweep + (v - 0.5) * chord;
      const camber = Math.sin(v * Math.PI) * 0.012 * (rOut / 0.46);
      pos.push(r * Math.cos(theta), r * Math.sin(theta), (v - 0.5) * depth + camber);
    }
  }
  const row = segV + 1;
  for (let iu = 0; iu < segU; iu++)
    for (let iv = 0; iv < segV; iv++) {
      const a = iu * row + iv;
      const b = a + row;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function hubGeometry(r: number) {
  // Perfil del domo del rotor (revolución)
  const pts = [
    new THREE.Vector2(0, 0.055),
    new THREE.Vector2(r * 0.55, 0.05),
    new THREE.Vector2(r * 0.85, 0.035),
    new THREE.Vector2(r, 0.012),
    new THREE.Vector2(r * 1.02, -0.04),
  ].map((p) => new THREE.Vector2(p.x, p.y * (r / 0.13)));
  const g = new THREE.LatheGeometry(pts, 64);
  g.rotateX(Math.PI / 2);
  return g;
}

export function RealFan({ m, radius = 0.46, blades = 11, speed = 7, ringLight = false }: { m: Pbr; radius?: number; blades?: number; speed?: number; ringLight?: boolean }) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (rotor.current) rotor.current.rotation.z -= dt * speed;
  });
  const hubR = radius * 0.28;
  const blade = useMemo(() => bladeGeometry(hubR * 0.92, radius * 0.965), [hubR, radius]);
  const hub = useMemo(() => hubGeometry(hubR), [hubR]);
  return (
    <group>
      {/* Labio del alojamiento */}
      <mesh material={m.shroudGloss}>
        <torusGeometry args={[radius * 1.02, radius * 0.028, 16, 96]} />
      </mesh>
      {ringLight && (
        <mesh position={[0, 0, -0.005]} material={m.lightbar}>
          <torusGeometry args={[radius * 1.0, radius * 0.008, 8, 128]} />
        </mesh>
      )}
      {/* Montante trasero (cruceta del motor) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0, -0.06]} rotation={[0, 0, (i * Math.PI * 2) / 3 + 0.3]} material={m.plastic}>
          <boxGeometry args={[radius * 2, radius * 0.06, 0.012]} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]} material={m.plastic}>
        <cylinderGeometry args={[hubR * 0.9, hubR * 0.9, 0.02, 48]} />
      </mesh>
      {/* Rotor */}
      <group ref={rotor}>
        {Array.from({ length: blades }).map((_, i) => (
          <mesh key={i} geometry={blade} material={m.blade} rotation={[0, 0, (i / blades) * Math.PI * 2]} />
        ))}
        {/* Anillo de puntas */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.blade}>
          <cylinderGeometry args={[radius * 0.975, radius * 0.975, radius * 0.07, 96, 1, true]} />
        </mesh>
        <mesh geometry={hub} material={m.shroudGloss} />
        <mesh position={[0, 0, (hubR / 0.13) * 0.056]} material={m.hub}>
          <circleGeometry args={[hubR * 0.6, 48]} />
        </mesh>
      </group>
    </group>
  );
}
