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

/** Generate a soft circular sprite so points don't render as squares. */
function createSoftPointTexture(size = 128): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(0.75, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function EmberField({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const rnd = mulberry32(0xdeadbeef);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // dome-like depth distribution, thicker at edges
      const r = Math.sqrt(rnd()) * 7.5;
      const theta = rnd() * Math.PI * 2;
      a[i * 3] = Math.cos(theta) * r;
      a[i * 3 + 1] = (rnd() - 0.5) * 9;
      a[i * 3 + 2] = Math.sin(theta) * r - (rnd() * 2 + 0.5);
    }
    return a;
  }, [count]);

  const colors = useMemo(() => {
    const rnd = mulberry32(0xbeefdead);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const roll = rnd();
      if (roll > 0.97) {
        // rare bright ember
        c[i * 3] = 1.0;
        c[i * 3 + 1] = 0.28;
        c[i * 3 + 2] = 0.22;
      } else if (roll > 0.85) {
        // deep crimson dust
        c[i * 3] = 0.64;
        c[i * 3 + 1] = 0.07;
        c[i * 3 + 2] = 0.12;
      } else {
        // bone dust, slightly warm
        const v = 0.78 + rnd() * 0.2;
        c[i * 3] = v;
        c[i * 3 + 1] = v * 0.96;
        c[i * 3 + 2] = v * 0.9;
      }
    }
    return c;
  }, [count]);

  const sizes = useMemo(() => {
    const rnd = mulberry32(0x1badc0de);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = 0.02 + Math.pow(rnd(), 2.4) * 0.08;
    }
    return s;
  }, [count]);

  const sprite = useMemo(() => createSoftPointTexture(128), []);

  useFrame((state, dt) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += dt * 0.01;
    // gentle parallax tied to pointer
    const { x, y } = state.pointer;
    p.rotation.x += (y * 0.08 - p.rotation.x) * 0.02;
    p.position.x += (x * 0.15 - p.position.x) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        map={sprite}
        alphaMap={sprite}
        size={0.09}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
      />
    </points>
  );
}

/** Slow drifting radial vignette — adds depth behind the embers. */
function Halo() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.z += dt * 0.02;
  });
  return (
    <mesh ref={ref} position={[0, 0, -4]}>
      <planeGeometry args={[24, 14]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - 0.5;
            float d = length(p);
            float vignette = smoothstep(0.75, 0.15, d);
            vec3 col = mix(vec3(0.04, 0.005, 0.01), vec3(0.015, 0.0, 0.0), d);
            gl_FragColor = vec4(col, vignette * 0.85);
          }
        `}
      />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Halo />
        <EmberField />
      </Canvas>
    </div>
  );
}
