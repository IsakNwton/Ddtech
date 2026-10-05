"use client";

import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { CUSTOM_MODELS, CustomModel } from "./custom-model";
import * as THREE from "three";
import { RealGpu } from "./gpu";
import { usePbr } from "./pbr";
import { BRAND, Stage } from "./stage";

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4);

function HeroGpu() {
  const m = usePbr();
  const group = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const { viewport, size } = useThree();
  const wide = size.width >= 1024;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const intro = ease((state.clock.elapsedTime - start.current) / 2.2);
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));

    // Intro: la tarjeta gira y se acerca; luego sigue al cursor y al scroll
    const px = state.pointer.x;
    const py = state.pointer.y;
    const targetY = -0.55 + px * 0.35 + (1 - intro) * -2.6 + scroll * 1.2;
    const targetX = 0.32 - py * 0.18 + (1 - intro) * 0.6 - scroll * 0.4;
    const targetZ = -0.08 + px * 0.05;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 5, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetZ, 5, dt);
    const s = (wide ? 0.86 : 0.5) * (0.7 + intro * 0.3);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 6, dt));
    const baseX = wide ? viewport.width * 0.2 : 0;
    const baseY = wide ? -0.05 : 1.3;
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + (1 - intro) * -0.8 + scroll * 0.9, 5, dt);
  });

  return (
    <group ref={group} rotation={[0.8, -3, 0]} scale={0.5}>
      <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.55}>
        {CUSTOM_MODELS.gpu ? (
          <Suspense fallback={<RealGpu m={m} fanSpeed={6} />}>
            <CustomModel url={CUSTOM_MODELS.gpu} size={3.1} />
          </Suspense>
        ) : (
          <RealGpu m={m} fanSpeed={6} />
        )}
      </Float>
    </group>
  );
}

export default function HeroScene({ className }: { className?: string }) {
  return (
    <Stage className={className} camera={{ position: [0, 0.2, 6.4], fov: 34 }} bloom={0.5}>
      <HeroGpu />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.55} scale={12} blur={2.8} far={4} color="#000" />
      <Sparkles count={40} scale={[11, 5, 5]} size={1.6} speed={0.2} opacity={0.35} color={BRAND} />
    </Stage>
  );
}
