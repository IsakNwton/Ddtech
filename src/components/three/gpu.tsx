"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RealFan } from "./fan";
import type { Pbr } from "./pbr";

/**
 * Tarjeta gráfica de tres ventiladores con proporciones reales (≈304 × 137 × 61 mm,
 * 1 unidad = 100 mm): cubierta facetada, disipador de aletas, heatpipes niquelados,
 * backplate con ventilación flow-through, PCB, conector 12V-2x6, bracket con puertos
 * y conector PCIe con contactos dorados. Diseño genérico (no replica una marca).
 */

const FAN_X = [-0.92, 0.06, 1.0];
const FAN_R = 0.47;

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function hexPath(cx: number, cy: number, r: number) {
  const p = new THREE.Path();
  for (let a = 0; a < 6; a++) {
    const ang = (Math.PI / 3) * a + Math.PI / 6;
    const x = cx + Math.cos(ang) * r;
    const y = cy + Math.sin(ang) * r;
    if (a === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }
  p.closePath();
  return p;
}

function outline() {
  const s = new THREE.Shape();
  s.moveTo(-1.47, 0.5);
  s.lineTo(-1.34, 0.65);
  s.lineTo(0.92, 0.65);
  s.lineTo(1.1, 0.52);
  s.lineTo(1.52, 0.52);
  s.lineTo(1.52, -0.5);
  s.lineTo(1.39, -0.65);
  s.lineTo(-1.3, -0.65);
  s.lineTo(-1.47, -0.48);
  s.closePath();
  return s;
}

function Fins({ m }: { m: Pbr }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 196;
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const d = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      d.position.set(-1.42 + (i / (count - 1)) * 2.9, -0.01, -0.1);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} material={m.fin}>
      <boxGeometry args={[0.0045, 1.2, 0.3]} />
    </instancedMesh>
  );
}

export function RealGpu({ m, fanSpeed = 7 }: { m: Pbr; fanSpeed?: number }) {
  const geo = useMemo(() => {
    // Placa frontal con huecos para ventiladores
    const front = outline();
    for (const x of FAN_X) {
      const h = new THREE.Path();
      h.absarc(x, -0.01, FAN_R + 0.015, 0, Math.PI * 2, true);
      front.holes.push(h);
    }
    const shroud = new THREE.ExtrudeGeometry(front, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 4, curveSegments: 72 });
    shroud.translate(0, 0, 0.1);

    // Pared lateral de la cubierta (marco hueco)
    const wallShape = outline();
    const inner = new THREE.Path();
    inner.moveTo(-1.43, 0.49);
    inner.lineTo(-1.32, 0.62);
    inner.lineTo(0.9, 0.62);
    inner.lineTo(1.08, 0.49);
    inner.lineTo(1.49, 0.49);
    inner.lineTo(1.49, -0.48);
    inner.lineTo(1.37, -0.62);
    inner.lineTo(-1.28, -0.62);
    inner.lineTo(-1.43, -0.46);
    inner.closePath();
    wallShape.holes.push(inner);
    const wall = new THREE.ExtrudeGeometry(wallShape, { depth: 0.07, bevelEnabled: false });
    wall.translate(0, 0, 0.035);

    // Molduras metálicas
    const trimTop = new THREE.Shape();
    trimTop.moveTo(-1.3, 0.6);
    trimTop.lineTo(0.88, 0.6);
    trimTop.lineTo(1.0, 0.505);
    trimTop.lineTo(-1.18, 0.505);
    trimTop.closePath();
    const trimTopG = new THREE.ExtrudeGeometry(trimTop, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 });
    trimTopG.translate(0, 0, 0.162);

    const trimBot = new THREE.Shape();
    trimBot.moveTo(0.3, -0.505);
    trimBot.lineTo(1.4, -0.505);
    trimBot.lineTo(1.4, -0.555);
    trimBot.lineTo(1.33, -0.6);
    trimBot.lineTo(0.42, -0.6);
    trimBot.closePath();
    const trimBotG = new THREE.ExtrudeGeometry(trimBot, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 });
    trimBotG.translate(0, 0, 0.162);

    // Backplate con ventilación hexagonal sobre el tercer ventilador (flow-through)
    const bp = roundedRect(3.0, 1.3, 0.05);
    for (let row = 0; row < 11; row++)
      for (let col = 0; col < 9; col++) {
        const cx = 0.66 + col * 0.088 + (row % 2 ? 0.044 : 0);
        const cy = -0.43 + row * 0.077;
        if (cx < 1.42) bp.holes.push(hexPath(cx, cy, 0.034));
      }
    const backplate = new THREE.ExtrudeGeometry(bp, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 12 });
    backplate.translate(0, 0, -0.3);

    // Bracket de E/S (forma en plano Z-Y, extruida a lo largo de X)
    const br = new THREE.Shape();
    br.moveTo(-0.3, -0.6);
    br.lineTo(0.32, -0.6);
    br.lineTo(0.32, 0.72);
    br.lineTo(-0.3, 0.72);
    br.closePath();
    const ports: [number, number, number, number][] = [
      [-0.2, -0.36, 0.16, 0.062],
      [-0.2, -0.16, 0.16, 0.062],
      [-0.2, 0.04, 0.16, 0.062],
      [-0.2, 0.25, 0.15, 0.052],
    ];
    for (const [zc, yc, w, h] of ports) {
      const p = new THREE.Path();
      p.moveTo(zc - w / 2, yc - h / 2);
      p.lineTo(zc + w / 2, yc - h / 2);
      p.lineTo(zc + w / 2, yc + h / 2 - 0.015);
      p.lineTo(zc + w / 2 - 0.015, yc + h / 2);
      p.lineTo(zc - w / 2, yc + h / 2);
      p.closePath();
      br.holes.push(p);
    }
    for (let row = 0; row < 12; row++)
      for (let col = 0; col < 4; col++) {
        const zc = 0.02 + col * 0.075 + (row % 2 ? 0.037 : 0);
        const yc = -0.5 + row * 0.1;
        if (zc < 0.29) br.holes.push(hexPath(zc, yc, 0.03));
      }
    const bracket = new THREE.ExtrudeGeometry(br, { depth: 0.012, bevelEnabled: false, curveSegments: 6 });
    bracket.rotateY(-Math.PI / 2);

    // Heatpipes en U que asoman por el borde superior
    const pipes = [-1.26, -1.16, -1.06, -0.96, -0.86].map((x, i) => {
      const z = i % 2 ? -0.06 : -0.17;
      const span = 0.5 + i * 0.05;
      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, 0.5, z),
        new THREE.Vector3(x, 0.66, z),
        new THREE.Vector3(x + 0.05, 0.73, z),
        new THREE.Vector3(x + span - 0.05, 0.73, z),
        new THREE.Vector3(x + span, 0.66, z),
        new THREE.Vector3(x + span, 0.5, z),
      ]);
      return new THREE.TubeGeometry(path, 48, 0.026, 16, false);
    });

    return { shroud, wall, trimTopG, trimBotG, backplate, bracket, pipes };
  }, []);

  return (
    <group>
      {/* Cubierta */}
      <mesh geometry={geo.shroud} material={m.shroud} castShadow />
      <mesh geometry={geo.wall} material={m.shroud} />
      <mesh geometry={geo.trimTopG} material={m.gunmetal} />
      <mesh geometry={geo.trimBotG} material={m.gunmetal} />
      {/* Barra de luz superior (difusor) */}
      <mesh position={[-0.25, 0.652, 0.075]} material={m.lightbar}>
        <boxGeometry args={[1.7, 0.01, 0.03]} />
      </mesh>

      {/* Ventiladores */}
      {FAN_X.map((x, i) => (
        <group key={x} position={[x, -0.01, 0.105]}>
          <RealFan m={m} radius={FAN_R} speed={fanSpeed * (i === 1 ? -1 : 1)} />
        </group>
      ))}

      {/* Disipador y heatpipes */}
      <Fins m={m} />
      {[-0.32, -0.16, 0, 0.16, 0.3].map((y) => (
        <mesh key={y} position={[0.05, y, -0.12]} rotation={[0, 0, Math.PI / 2]} material={m.nickel}>
          <cylinderGeometry args={[0.026, 0.026, 2.8, 16]} />
        </mesh>
      ))}
      {geo.pipes.map((g, i) => (
        <mesh key={i} geometry={g} material={m.nickel} />
      ))}
      {/* Placa base del disipador (contacto con la GPU) */}
      <mesh position={[-0.35, 0, -0.235]} material={m.copper}>
        <boxGeometry args={[0.7, 0.62, 0.025]} />
      </mesh>

      {/* PCB */}
      <mesh position={[-0.05, 0, -0.262]} material={m.pcb}>
        <boxGeometry args={[2.9, 1.24, 0.016]} />
      </mesh>
      {/* Backplate */}
      <mesh geometry={geo.backplate} material={m.anodized} castShadow />
      {[
        [-1.35, 0.55],
        [-1.35, -0.55],
        [0.45, 0.55],
        [0.45, -0.55],
        [-0.55, 0.3],
        [-0.15, 0.3],
        [-0.55, -0.3],
        [-0.15, -0.3],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.305]} rotation={[Math.PI / 2, 0, 0]} material={m.silver}>
          <cylinderGeometry args={[0.022, 0.022, 0.01, 6]} />
        </mesh>
      ))}

      {/* Conector 12V-2x6 */}
      <group position={[0.42, 0.665, -0.2]}>
        <mesh material={m.plastic}>
          <boxGeometry args={[0.22, 0.09, 0.085]} />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-0.085 + (i % 6) * 0.034, 0.046, i < 6 ? -0.018 : 0.018]} material={m.rubber}>
            <boxGeometry args={[0.022, 0.004, 0.022]} />
          </mesh>
        ))}
      </group>

      {/* Bracket y puertos */}
      <group position={[-1.545, 0.0, -0.03]}>
        <mesh geometry={geo.bracket} material={m.steel} />
        {[-0.36, -0.16, 0.04, 0.25].map((y) => (
          <mesh key={y} position={[0.04, y, -0.2]} material={m.plastic}>
            <boxGeometry args={[0.07, 0.05, 0.14]} />
          </mesh>
        ))}
        {/* Pestaña superior */}
        <mesh position={[0.04, 0.715, 0.01]} material={m.steel}>
          <boxGeometry args={[0.08, 0.012, 0.62]} />
        </mesh>
      </group>

      {/* Conector PCIe */}
      <mesh position={[-0.6, -0.665, -0.262]} material={m.fingers}>
        <boxGeometry args={[0.92, 0.095, 0.018]} />
      </mesh>
    </group>
  );
}
