"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * Modelos GLB reales opcionales. Si DDTech obtiene modelos con licencia (escaneos del
 * fabricante, CGTrader, Sketchfab…), basta con colocarlos en /public/models y definir
 * la variable de entorno correspondiente; si no, se usa el modelo procedural.
 *
 *   NEXT_PUBLIC_GPU_MODEL=/models/gpu.glb
 */
export const CUSTOM_MODELS = {
  gpu: process.env.NEXT_PUBLIC_GPU_MODEL || null,
};

/** Carga un GLB, lo centra y lo escala para que su dimensión mayor mida `size` unidades */
export function CustomModel({ url, size }: { url: string; size: number }) {
  const { scene } = useGLTF(url, false);
  const { object, scale, offset } = useMemo(() => {
    const object = scene.clone(true);
    object.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(object);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    return { object, scale: size / Math.max(dims.x, dims.y, dims.z), offset: center.multiplyScalar(-1) };
  }, [scene, size]);
  return (
    <group scale={scale}>
      <primitive object={object} position={offset} />
    </group>
  );
}
