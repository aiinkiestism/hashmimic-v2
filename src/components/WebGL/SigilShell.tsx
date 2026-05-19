'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface SigilShellProps {
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
  children: React.ReactNode;
}

// "Sigil with halo" tile. The icon is the unambiguous centre — a clear,
// camera-facing plane that the rest of the composition frames:
//   1. Background radial glow sprite (additive blend, brand palette).
//   2. The icon itself, drawn opaque at z=0.
//   3. Outer iridescent halo torus, tilted forward, rotating around Y.
//   4. Inner warm-metal counter-ring, tilted the other way, opposite spin.
// Icon dominates visually; the rings + glow only spill around the silhouette.
const HOVER_SCALE = 1.1;
const REST_SCALE = 1.0;
const HOVER_LERP_PER_SEC = 12;
const FLOAT_AMPLITUDE = 0.03;
const FLOAT_FREQ = 1.2;

const OUTER_RING_RADIUS_FRACTION = 0.95;
const OUTER_RING_TUBE_FRACTION = 0.035;
const INNER_RING_RADIUS_FRACTION = 0.72;
const INNER_RING_TUBE_FRACTION = 0.018;
const OUTER_RING_SPIN_PER_SEC = 0.45;
const INNER_RING_SPIN_PER_SEC = -0.65;
const HALO_SCALE_FACTOR = 2.6;

export function SigilShell({ position, size, url, children }: SigilShellProps) {
  const halfSize = size[0] / 2;
  const outerRingRadius = halfSize * OUTER_RING_RADIUS_FRACTION;
  const outerRingTube = halfSize * OUTER_RING_TUBE_FRACTION;
  const innerRingRadius = halfSize * INNER_RING_RADIUS_FRACTION;
  const innerRingTube = halfSize * INNER_RING_TUBE_FRACTION;
  const haloScale = halfSize * HALO_SCALE_FACTOR;

  const groupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const phaseOffset = position[0] * 1.3 + position[1] * 0.7;

  // Canvas-generated radial gradient texture for the backdrop halo. Brand
  // palette fades from gold center → orange → magenta → transparent edge.
  const haloTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const SIZE = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grad = ctx.createRadialGradient(
      SIZE / 2,
      SIZE / 2,
      0,
      SIZE / 2,
      SIZE / 2,
      SIZE / 2,
    );
    grad.addColorStop(0, "rgba(255, 195, 0, 0.55)");
    grad.addColorStop(0.35, "rgba(255, 69, 0, 0.28)");
    grad.addColorStop(0.7, "rgba(242, 26, 176, 0.12)");
    grad.addColorStop(1, "rgba(10, 10, 20, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const outerRingMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.85,
        thickness: 0.2,
        roughness: 0.05,
        ior: 1.5,
        iridescence: 1.0,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [100, 800],
        clearcoat: 0.6,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.0,
      }),
    [],
  );

  const innerRingMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ff4500"),
        metalness: 0.55,
        roughness: 0.2,
        iridescence: 0.6,
        iridescenceIOR: 1.4,
        iridescenceThicknessRange: [200, 600],
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
        envMapIntensity: 0.95,
      }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * FLOAT_FREQ + phaseOffset) * FLOAT_AMPLITUDE;
      const target = hovered ? HOVER_SCALE : REST_SCALE;
      const k = Math.min(1, delta * HOVER_LERP_PER_SEC);
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), k);
    }

    if (outerRingRef.current) {
      // Rotate around Y so the tilted torus precesses across the camera —
      // iridescence visibly shifts colour around the ring as it does so.
      outerRingRef.current.rotation.y += delta * OUTER_RING_SPIN_PER_SEC;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x += delta * INNER_RING_SPIN_PER_SEC;
      innerRingRef.current.rotation.z += delta * 0.12;
    }
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
      {/* Backdrop additive halo. Behind everything; spills out beyond the
          icon silhouette so the icon reads against a glowing penumbra. */}
      {haloTexture && (
        <sprite scale={[haloScale, haloScale, 1]} position={[0, 0, -0.08]}>
          <spriteMaterial
            map={haloTexture}
            transparent
            opacity={0.8}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* The sigil — caller-provided icon, dead-centre, large, opaque.
          This is the readable surface; everything else is frame. */}
      {children}

      {/* Outer iridescent halo torus. Initial X tilt + Y-axis spin gives a
          Saturn-rings precession; iridescence + transmission shimmer as the
          torus segments rotate through camera-facing orientations. */}
      <mesh
        ref={outerRingRef}
        rotation={[Math.PI * 0.1, 0, 0]}
        material={outerRingMaterial}
      >
        <torusGeometry args={[outerRingRadius, outerRingTube, 24, 96]} />
      </mesh>

      {/* Inner counter-rotating warm-metal ring. */}
      <mesh
        ref={innerRingRef}
        rotation={[-Math.PI * 0.18, 0, Math.PI / 6]}
        material={innerRingMaterial}
      >
        <torusGeometry args={[innerRingRadius, innerRingTube, 20, 80]} />
      </mesh>
    </group>
  );
}
