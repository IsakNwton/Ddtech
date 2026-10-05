"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const BRAND = "#4d7cff";

/** Reflejos de estudio fotográfico: RoomEnvironment + softboxes */
function StudioEnvironment({ intensity = 0.55 }: { intensity?: number }) {
  const get = useThree((s) => s.get);
  useEffect(() => {
    // Se obtiene la escena dentro del efecto: es un objeto de three.js, no estado de React
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    return () => {
      env.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [get, intensity]);
  return null;
}

export function StudioLights({ env = 0.55, keyLight = 2.2 }: { env?: number; keyLight?: number }) {
  return (
    <>
      <StudioEnvironment intensity={env} />
      {/* Softboxes adicionales para recortes de luz en aristas */}
      <Environment resolution={256} frames={1} environmentIntensity={0.35}>
        <Lightformer form="rect" intensity={4} position={[0, 5, 3]} scale={[10, 3, 1]} rotation-x={Math.PI / 2.3} />
        <Lightformer form="rect" intensity={2} color="#9fb4ff" position={[-6, 1, 2]} scale={[3, 8, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4} color="#ffd9c2" position={[6, 0, 2]} scale={[3, 8, 1]} rotation-y={-Math.PI / 2} />
      </Environment>
      <ambientLight intensity={0.08} />
      <directionalLight position={[3, 6, 5]} intensity={keyLight} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <spotLight position={[-5, 2, 4]} angle={0.5} penumbra={1} intensity={22} color="#8fa8ff" />
      <spotLight position={[5, -1, -4]} angle={0.6} penumbra={1} intensity={18} color="#b9a7ff" />
    </>
  );
}

/**
 * Lienzo WebGL: solo renderiza cuando está en pantalla y ajusta la resolución
 * según el rendimiento del dispositivo.
 */
export function Stage({
  children,
  className,
  camera,
  bloom = 0.6,
  env,
  keyLight,
}: {
  children: ReactNode;
  className?: string;
  camera: { position: [number, number, number]; fov: number };
  bloom?: number;
  env?: number;
  keyLight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const [hq, setHq] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <Canvas
        shadows
        flat
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
        camera={camera}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setHq(false);
          }}
          onIncline={() => setDpr(1.75)}
        />
        <color attach="background" args={["#060709"]} />
        <fog attach="fog" args={["#060709", 10, 22]} />
        <StudioLights env={env} keyLight={keyLight} />
        {children}
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <N8AO aoRadius={0.35} distanceFalloff={0.6} intensity={hq ? 2.2 : 1.4} quality={hq ? "medium" : "performance"} halfRes={!hq} />
          <Bloom mipmapBlur luminanceThreshold={1.1} luminanceSmoothing={0.15} intensity={bloom} radius={0.6} />
          <ToneMapping mode={ToneMappingMode.AGX} />
          <Vignette offset={0.3} darkness={0.7} />
          <SMAA />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
