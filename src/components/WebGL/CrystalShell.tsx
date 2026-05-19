'use client'

import { Edges, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface CrystalShellProps {
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
  children: React.ReactNode;
}

// Memory-crystal tile: a faceted icosahedron shell with neon-trim edges
// and brand-colour motes orbiting outside, wrapping a clearly legible icon
// at the centre. The transmission params are dialled WAY down from the
// title text's settings — just enough chromatic aberration and distortion
// to feel like glass, never enough to fracture the icon underneath. The
// composition is icon-forward: the gem frames and shimmers around the
// icon rather than masking it.
const HOVER_SCALE = 1.1;
const REST_SCALE = 1.0;
const HOVER_LERP_PER_SEC = 12;
const FLOAT_AMPLITUDE = 0.04;
const FLOAT_FREQ = 1.2;
const PARTICLE_COUNT = 6;

const SHELL_ROT_X_PER_SEC = 0.04;
const SHELL_ROT_Y_PER_SEC = -0.06;

const PARTICLE_ORBIT_FRACTION = 1.05;
const PARTICLE_RADIUS = 0.022;
const PARTICLE_COLORS = [
  "#ffc300",
  "#ff4500",
  "#F21AB0",
  "#9E46C0",
  "#ffc300",
  "#ff4500",
];

export function CrystalShell({ position, size, url, children }: CrystalShellProps) {
  const shellRadius = size[0] / 2;
  const particleOrbitRadius = shellRadius * PARTICLE_ORBIT_FRACTION;

  const groupRef = useRef<THREE.Group>(null);
  const shellGroupRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [hovered, setHovered] = useState(false);

  // Per-tile phase so float/orbits on adjacent tiles aren't locked-step.
  const phaseOffset = position[0] * 1.3 + position[1] * 0.7;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * FLOAT_FREQ + phaseOffset) * FLOAT_AMPLITUDE;
      const target = hovered ? HOVER_SCALE : REST_SCALE;
      const k = Math.min(1, delta * HOVER_LERP_PER_SEC);
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), k);
    }

    if (shellGroupRef.current) {
      shellGroupRef.current.rotation.x += delta * SHELL_ROT_X_PER_SEC;
      shellGroupRef.current.rotation.y += delta * SHELL_ROT_Y_PER_SEC;
    }

    // Motes orbit on a tilted ellipse with per-particle wobble.
    particleRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const speedFactor = 0.35 + (i % 3) * 0.08;
      const angle = t * speedFactor + (i / PARTICLE_COUNT) * Math.PI * 2;
      const r = particleOrbitRadius * (1 + Math.sin(t * 0.6 + i) * 0.05);
      mesh.position.x = Math.cos(angle) * r;
      mesh.position.y = Math.sin(angle) * r * 0.55;
      mesh.position.z = Math.sin(angle * 1.4 + i) * r * 0.35;
    });
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={() => openExternal(url)}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Caller-provided icon. Opaque (alphaTest) so the transmission pass
          picks it up; kept at z=0 (the gem's centre) and large enough to
          fill the icosahedron's inscribed area — this is the readable
          surface the rest of the layers frame. */}
      {children}

      {/* Outer crystal + emissive edge trim. Transmission is intentionally
          almost clear (low aberration, low distortion, IOR close to 1.25)
          so the icon underneath stays sharp. The faceted icosahedron and
          the neon edges supply the "crystal" identity. */}
      <group ref={shellGroupRef}>
        <mesh>
          <icosahedronGeometry args={[shellRadius, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={1}
            resolution={128}
            thickness={0.15}
            chromaticAberration={0.4}
            anisotropy={0.2}
            roughness={0.05}
            clearcoat={0.4}
            clearcoatRoughness={0.1}
            distortion={0.08}
            distortionScale={1}
            temporalDistortion={0.04}
            ior={1.25}
            transmission={0.9}
            color="#ffffff"
            envMapIntensity={1.0}
            reflectivity={0.05}
          />
          <Edges threshold={5} scale={1.005}>
            <lineBasicMaterial
              color="#ff4500"
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </Edges>
        </mesh>
      </group>

      {/* Brand-colour motes orbiting outside the shell. */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            particleRefs.current[i] = m;
          }}
        >
          <sphereGeometry args={[PARTICLE_RADIUS, 10, 8]} />
          <meshBasicMaterial
            color={PARTICLE_COLORS[i % PARTICLE_COLORS.length]}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
