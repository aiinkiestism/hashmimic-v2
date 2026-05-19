'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface CoinShellProps {
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
  children: React.ReactNode;
}

const HOVER_SCALE = 1.12;
const REST_SCALE = 1.0;
const HOVER_LERP_PER_SEC = 12;
// One full revolution every ~6 seconds — slow enough that the icon is the
// dominant visual most of the time, fast enough to feel alive.
const SPIN_SPEED = 1.05;
const FLOAT_AMPLITUDE = 0.06;
const FLOAT_FREQ = 1.5;
const COIN_THICKNESS_RATIO = 0.14;
const FACE_OFFSET_EPSILON = 0.005;
const RADIAL_SEGMENTS = 48;

export function CoinShell({ position, size, url, children }: CoinShellProps) {
  const radius = size[0] / 2;
  const thickness = size[0] * COIN_THICKNESS_RATIO;
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Per-coin phase so adjacent coins in a row don't bob in lockstep.
  const phaseOffset = useMemo(
    () => position[0] * 1.3 + position[1] * 0.7,
    [position],
  );

  const coinMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f7d779"), // warm gold
        metalness: 0.9,
        roughness: 0.28,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.0,
      }),
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Idle Y rotation — the coin slowly turns so both faces become visible.
    groupRef.current.rotation.y += delta * SPIN_SPEED * 0.1;
    // Subtle vertical bob around the coin's home y.
    const t = state.clock.elapsedTime;
    groupRef.current.position.y =
      position[1] + Math.sin(t * FLOAT_FREQ + phaseOffset) * FLOAT_AMPLITUDE;
    // Hover scale lerp toward target.
    const target = hovered ? HOVER_SCALE : REST_SCALE;
    const k = Math.min(1, delta * HOVER_LERP_PER_SEC);
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), k);
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
      {/* Disc body. Default cylinder axis is Y; rotating around X by 90°
          stands it on edge so the round faces become ±Z and the coin reads
          as facing the camera at rest. */}
      <mesh material={coinMaterial} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[radius, radius, thickness, RADIAL_SEGMENTS]}
        />
      </mesh>

      {/* Children duplicated on both faces. Front sub-group at +Z, back at
          -Z rotated 180° around Y so its plane normal points -Z. The Y-flip
          mirrors asymmetric icons on the back, but for the slow-rotation
          read this is fine — and beats having the icon disappear entirely
          half the time. */}
      <group position={[0, 0, thickness / 2 + FACE_OFFSET_EPSILON]}>
        {children}
      </group>
      <group
        position={[0, 0, -thickness / 2 - FACE_OFFSET_EPSILON]}
        rotation={[0, Math.PI, 0]}
      >
        {children}
      </group>
    </group>
  );
}
