"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function AshField({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rnd = mulberry32(0xdeadbeef);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (rnd() - 0.5) * 14;
      a[i * 3 + 1] = (rnd() - 0.5) * 10;
      a[i * 3 + 2] = (rnd() - 0.5) * 8;
    }
    return a;
  }, [count]);

  const colors = useMemo(() => {
    const rnd = mulberry32(0xbeefdead);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const blood = rnd() > 0.92 ? 1 : 0;
      c[i * 3] = blood ? 0.64 : 0.93;
      c[i * 3 + 1] = blood ? 0.07 : 0.91;
      c[i * 3 + 2] = blood ? 0.12 : 0.91;
    }
    return c;
  }, [count]);

  useFrame((_, dt) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += dt * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.018}
        transparent
        opacity={0.45}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <AshField />
      </Canvas>
    </div>
  );
}
