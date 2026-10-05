"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BRAND, BRAND_2 } from "./parts";

/** Estudio de luz sin descargas externas: el entorno se genera con Lightformers */
export function StudioLights() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={3} color={BRAND} position={[-5, 0.5, 1]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} color={BRAND_2} position={[5, -0.5, 1]} scale={[2, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={2.5} position={[0, 0, 6]} scale={3} />
        <Lightformer form="rect" intensity={1.2} position={[0, -3, -2]} scale={[10, 1, 1]} rotation-x={-Math.PI / 2} />
      </Environment>
      <ambientLight intensity={0.15} />
      <spotLight position={[3, 6, 6]} angle={0.45} penumbra={1} intensity={90} color="#ffffff" />
      <pointLight position={[-4, -1, 3]} intensity={26} color={BRAND} />
      <pointLight position={[4, 1, -2]} intensity={18} color={BRAND_2} />
    </>
  );
}

/**
 * Lienzo WebGL que solo renderiza cuando está en pantalla y ajusta la resolución
 * según el rendimiento del dispositivo.
 */
export function Stage({
  children,
  className,
  camera,
  bloom = 0.9,
}: {
  children: ReactNode;
  className?: string;
  camera: { position: [number, number, number]; fov: number };
  bloom?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);

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
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
        camera={camera}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
        <color attach="background" args={["#060709"]} />
        <fog attach="fog" args={["#060709", 9, 20]} />
        <StudioLights />
        {children}
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.2} intensity={bloom} radius={0.75} />
          <Vignette offset={0.25} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
