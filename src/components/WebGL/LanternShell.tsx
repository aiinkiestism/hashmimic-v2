'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface LanternShellProps {
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
  children: React.ReactNode;
}

// "Lantern beam" tile — vertical composition that breaks out of the
// strictly horizontal row metaphor without changing the layout: each link
// becomes a transparent hex lantern with the icon inside, casting a
// flickering pillar of light upward. Five layers:
//   1. Core glow behind the icon (additive sphere)
//   2. Icon plane, camera-facing, opaque
//   3. Hex-prism lantern body, transmissive
//   4. Beam: open truncated cone above the lantern, additive blend with
//      flicker animation
//   5. Dust motes drifting upward through the beam
const HOVER_SCALE = 1.08;
const REST_SCALE = 1.0;
const HOVER_LERP_PER_SEC = 12;
const FLOAT_AMPLITUDE = 0.03;
const FLOAT_FREQ = 1.1;

const LANTERN_HEIGHT_FRACTION = 1.15;
const LANTERN_RADIUS_FRACTION = 0.85;
const LANTERN_SIDES = 6;

const BEAM_BASE_RADIUS_FRACTION = 0.28;
const BEAM_TIP_RADIUS_FRACTION = 0.05;
const BEAM_HEIGHT_FRACTION = 1.6;
const BEAM_SPIN_PER_SEC = 0.3;
const BEAM_OPACITY_BASE = 0.3;

const CORE_GLOW_RADIUS_FRACTION = 0.25;
const CORE_PULSE_FREQ = 3.0;
const CORE_PULSE_AMP = 0.08;

const DUST_COUNT = 4;
const DUST_RADIUS = 0.022;

export function LanternShell({ position, size, url, children }: LanternShellProps) {
  const halfSize = size[0] / 2;
  const lanternHeight = halfSize * LANTERN_HEIGHT_FRACTION;
  const lanternHalfHeight = lanternHeight / 2;
  const lanternRadius = halfSize * LANTERN_RADIUS_FRACTION;
  const beamBaseRadius = halfSize * BEAM_BASE_RADIUS_FRACTION;
  const beamTipRadius = halfSize * BEAM_TIP_RADIUS_FRACTION;
  const beamHeight = halfSize * BEAM_HEIGHT_FRACTION;
  const beamCenterY = lanternHalfHeight + beamHeight / 2;
  const beamBaseY = lanternHalfHeight;
  const beamTopY = lanternHalfHeight + beamHeight;
  const coreGlowRadius = halfSize * CORE_GLOW_RADIUS_FRACTION;

  const groupRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);
  const dustRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [hovered, setHovered] = useState(false);

  const phaseOffset = position[0] * 1.3 + position[1] * 0.7;

  const lanternMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        thickness: 0.15,
        roughness: 0.08,
        ior: 1.3,
        clearcoat: 0.35,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.0,
      }),
    [],
  );

  const beamMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffb145"),
        transparent: true,
        opacity: BEAM_OPACITY_BASE,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const coreGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffd76b"),
        transparent: true,
        opacity: 0.85,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
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

    // Beam: candle-flame flicker via two-band sine sum + slow rotation so
    // the cone's seam catches light differently as it turns.
    if (beamRef.current) {
      const flicker =
        BEAM_OPACITY_BASE +
        Math.sin(t * 4 + phaseOffset) * 0.06 +
        Math.sin(t * 7.3 + phaseOffset * 2) * 0.04;
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0.1,
        flicker,
      );
      beamRef.current.rotation.y += delta * BEAM_SPIN_PER_SEC;
    }

    if (coreGlowRef.current) {
      const pulse = 1 + Math.sin(t * CORE_PULSE_FREQ + phaseOffset) * CORE_PULSE_AMP;
      coreGlowRef.current.scale.setScalar(pulse);
    }

    // Dust motes cycle from beam base to tip; radius narrows with the cone
    // and opacity fades at both ends so they appear to materialise inside
    // the beam and dissolve out the top.
    dustRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const speed = 0.25 + (i % 3) * 0.06;
      const phase = i * 1.7 + phaseOffset;
      // ((x % 1) + 1) % 1 — guard against negative modulo if phase pushes x < 0
      const cyclePos = (((t * speed + phase) % 1) + 1) % 1;
      mesh.position.y = beamBaseY + cyclePos * (beamTopY - beamBaseY);
      // Local beam radius linearly interpolated along the cone.
      const radiusAtY =
        beamBaseRadius + (beamTipRadius - beamBaseRadius) * cyclePos;
      const r = radiusAtY * 0.65;
      mesh.position.x = Math.cos(t * 0.5 + phase * 3) * r;
      mesh.position.z = Math.sin(t * 0.6 + phase * 2) * r;
      const fade = Math.sin(cyclePos * Math.PI);
      (mesh.material as THREE.MeshBasicMaterial).opacity = fade * 0.9;
      mesh.scale.setScalar(0.6 + Math.sin(t * 2 + phase) * 0.2);
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
      {/* Core glow behind the icon — bleeds warm light through the icon's
          transparent regions and through the lantern walls. */}
      <mesh
        ref={coreGlowRef}
        position={[0, 0, -0.05]}
        material={coreGlowMaterial}
      >
        <sphereGeometry args={[coreGlowRadius, 16, 12]} />
      </mesh>

      {/* The icon — caller-provided, camera-facing, opaque (alphaTest).
          Held inside the lantern at z=0. */}
      {children}

      {/* Lantern body — transparent hex prism. The cylinderGeometry's
          default orientation puts a face on +Z (toward camera) for an
          even-sided polygon, so we leave rotation default. */}
      <mesh material={lanternMaterial}>
        <cylinderGeometry
          args={[lanternRadius, lanternRadius, lanternHeight, LANTERN_SIDES]}
        />
      </mesh>

      {/* Beam — open truncated cone, narrow at top, additive. */}
      <mesh
        ref={beamRef}
        position={[0, beamCenterY, 0]}
        material={beamMaterial}
      >
        <cylinderGeometry
          args={[beamTipRadius, beamBaseRadius, beamHeight, 16, 1, true]}
        />
      </mesh>

      {/* Dust motes drifting upward through the beam. */}
      {Array.from({ length: DUST_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            dustRefs.current[i] = m;
          }}
        >
          <sphereGeometry args={[DUST_RADIUS, 8, 6]} />
          <meshBasicMaterial
            color="#ffc77b"
            transparent
            opacity={0.7}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
