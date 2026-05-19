'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface JewelShellProps {
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
  children: React.ReactNode;
}

const HOVER_SCALE = 1.12;
const REST_SCALE = 1.0;
const HOVER_LERP_PER_SEC = 12;
const SPIN_Y_PER_SEC = 0.35;
const SPIN_X_PER_SEC = 0.14;
const FLOAT_AMPLITUDE = 0.05;
const FLOAT_FREQ = 1.3;
// Icosahedron at detail 0 has 20 triangular faces — clearly faceted but
// closer to spherical than an octahedron, which leaves enough inscribed
// volume to hold the icon plane without its corners poking through.
const GEM_DETAIL = 0;
const GEM_RADIUS_SCALE = 1.0;

export function JewelShell({ position, size, url, children }: JewelShellProps) {
  const radius = (size[0] / 2) * GEM_RADIUS_SCALE;
  const groupRef = useRef<THREE.Group>(null);
  const gemRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Per-instance phase so adjacent jewels don't bob/glint in lockstep.
  const phaseOffset = useMemo(
    () => position[0] * 1.3 + position[1] * 0.7,
    [position],
  );

  const jewelMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 1.0,
        thickness: 0.5,
        // Higher IOR pushes the refraction toward diamond-like distortion.
        ior: 1.7,
        roughness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.05,
        // Iridescence + iridescenceThicknessRange give the thin-film
        // rainbow shift across facets as the gem rotates.
        iridescence: 1.0,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [100, 800],
        envMapIntensity: 0.9,
        color: 0xffffff,
        attenuationColor: new THREE.Color("#ffd9f3"),
        attenuationDistance: 1.2,
      }),
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current || !gemRef.current) return;
    // Gem rotates on its own inner group so the icon at the center stays
    // oriented toward the camera while the facets glint around it.
    gemRef.current.rotation.y += delta * SPIN_Y_PER_SEC;
    gemRef.current.rotation.x += delta * SPIN_X_PER_SEC;
    // Vertical float around the home y.
    const t = state.clock.elapsedTime;
    groupRef.current.position.y =
      position[1] + Math.sin(t * FLOAT_FREQ + phaseOffset) * FLOAT_AMPLITUDE;
    // Hover swell.
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
      {/* Inner token. Stays camera-facing (not inside the rotating gem
          group) so the icon is always readable. Caller renders it in the
          opaque pass (alphaTest, no transparent) so the jewel's
          transmission pass can sample it from the framebuffer. */}
      {children}

      {/* Rotating faceted gem hull. */}
      <group ref={gemRef}>
        <mesh material={jewelMaterial}>
          <icosahedronGeometry args={[radius, GEM_DETAIL]} />
        </mesh>
      </group>
    </group>
  );
}
