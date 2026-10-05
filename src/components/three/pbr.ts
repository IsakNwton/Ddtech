"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { brushedRoughness, goldFingers, grainNormal, hubDecal, pcbMap, perforatedAlpha } from "./textures";

/** Materiales físicos realistas, compartidos por todos los modelos */
export function usePbr() {
  return useMemo(() => {
    const brushed = brushedRoughness();
    const grain = grainNormal();
    return {
      shroud: new THREE.MeshPhysicalMaterial({
        color: "#0e0f12",
        metalness: 0.05,
        roughness: 0.62,
        normalMap: grain,
        normalScale: new THREE.Vector2(0.18, 0.18),
        clearcoat: 0.25,
        clearcoatRoughness: 0.55,
      }),
      shroudGloss: new THREE.MeshPhysicalMaterial({ color: "#111217", metalness: 0.2, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 }),
      gunmetal: new THREE.MeshPhysicalMaterial({
        color: "#5a606a",
        metalness: 1,
        roughness: 0.34,
        roughnessMap: brushed,
        anisotropy: 0.8,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
      }),
      anodized: new THREE.MeshPhysicalMaterial({ color: "#26292f", metalness: 1, roughness: 0.42, roughnessMap: brushed, anisotropy: 0.6 }),
      silver: new THREE.MeshPhysicalMaterial({ color: "#c9cdd3", metalness: 1, roughness: 0.26, roughnessMap: brushed, anisotropy: 0.7 }),
      fin: new THREE.MeshStandardMaterial({ color: "#8e939a", metalness: 1, roughness: 0.48 }),
      nickel: new THREE.MeshStandardMaterial({ color: "#e2e5ea", metalness: 1, roughness: 0.12 }),
      copper: new THREE.MeshStandardMaterial({ color: "#c6825a", metalness: 1, roughness: 0.2 }),
      steel: new THREE.MeshPhysicalMaterial({ color: "#b4b9c0", metalness: 1, roughness: 0.3, roughnessMap: brushed, anisotropy: 0.5 }),
      pcb: new THREE.MeshStandardMaterial({ map: pcbMap(), roughness: 0.55, metalness: 0.25 }),
      fingers: new THREE.MeshStandardMaterial({ map: goldFingers(), roughness: 0.25, metalness: 0.85 }),
      blade: new THREE.MeshPhysicalMaterial({ color: "#0b0c0e", metalness: 0, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25, side: THREE.DoubleSide }),
      hub: new THREE.MeshPhysicalMaterial({ map: hubDecal(), metalness: 0.2, roughness: 0.35, clearcoat: 0.8 }),
      plastic: new THREE.MeshStandardMaterial({ color: "#09090b", roughness: 0.72, metalness: 0 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#050506", roughness: 0.9, metalness: 0 }),
      paintedSteel: new THREE.MeshPhysicalMaterial({
        color: "#0c0d10",
        metalness: 0.6,
        roughness: 0.48,
        normalMap: grain,
        normalScale: new THREE.Vector2(0.12, 0.12),
        clearcoat: 0.3,
      }),
      mesh: new THREE.MeshStandardMaterial({
        color: "#0c0d10",
        metalness: 0.7,
        roughness: 0.45,
        alphaMap: (() => {
          const t = perforatedAlpha(22).clone();
          t.repeat.set(3, 6);
          t.needsUpdate = true;
          return t;
        })(),
        alphaTest: 0.5,
        side: THREE.DoubleSide,
      }),
      // Cristal templado ligeramente ahumado: reflejos de estudio sin pasada de transmisión
      glass: new THREE.MeshPhysicalMaterial({
        color: "#1c2027",
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        opacity: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.6,
        depthWrite: false,
      }),
      lightbar: new THREE.MeshStandardMaterial({ color: "#e4ecff", emissive: "#a9c0ff", emissiveIntensity: 2.6, toneMapped: false }),
      lightWarm: new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#d9c7ff", emissiveIntensity: 2.2, toneMapped: false }),
      capacitor: new THREE.MeshStandardMaterial({ color: "#2b2e33", metalness: 0.9, roughness: 0.35 }),
      chip: new THREE.MeshStandardMaterial({ color: "#16171a", metalness: 0.3, roughness: 0.4 }),
    };
  }, []);
}

export type Pbr = ReturnType<typeof usePbr>;
