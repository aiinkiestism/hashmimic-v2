'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface MarbleShellProps {
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
  children: React.ReactNode;
}

// Visual specs for the glass marble. Tuned so the shell shares material
// language with the title text's MeshTransmissionMaterial: high transmission,
// near-mirror clearcoat, slight warm-pink tint via attenuation that picks up
// the watercolor background. The inner icon plane lives inside this group
// and is sized smaller than the sphere so it's fully "embedded" in glass.
const HOVER_SCALE = 1.12;
const REST_SCALE = 1.0;
const HOVER_LERP_PER_SEC = 12;
const SPHERE_WIDTH_SEGMENTS = 32;
const SPHERE_HEIGHT_SEGMENTS = 16;

export function MarbleShell({ position, size, url, children }: MarbleShellProps) {
  const radius = size[0] / 2;
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 1.0,
        thickness: 0.4,
        roughness: 0.08,
        ior: 1.5,
        // Keep clearcoat low — the page's <Environment> Lightformers are big
        // bright white panels, and a mirror-like clearcoat coupled with high
        // envMapIntensity blew the shell out to a featureless white disc.
        clearcoat: 0.2,
        clearcoatRoughness: 0.1,
        metalness: 0.0,
        color: 0xffffff,
        attenuationColor: new THREE.Color("#ffe9f3"),
        attenuationDistance: 1.2,
        envMapIntensity: 0.6,
      }),
    [],
  );

  // Cheap hover swell. Doesn't change cursor (the custom CursorOverlay does
  // that elsewhere) — just communicates "this is a touchable object".
  useFrame((_, delta) => {
    if (!groupRef.current) return;
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
      {/* Inner contents (the icon plane) — drawn first so the transmissive
          shell can sample them in the framebuffer for refraction. */}
      {children}

      {/* Outer glass shell. */}
      <mesh material={glassMaterial}>
        <sphereGeometry args={[radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS]} />
      </mesh>
    </group>
  );
}
