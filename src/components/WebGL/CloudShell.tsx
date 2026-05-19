'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface CloudShellProps {
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
  children: React.ReactNode;
}

// "Cloud pearl" — a single translucent puff wrapping the icon. Sparkle
// comes from the surface itself (iridescence + clearcoat + an emissive
// noise map that drifts across the surface as the cloud rotates) rather
// than any separate orbiting geometry. The base colour is a cream/gold
// neutral so the iridescent shifts and bright emissive pixels read
// distinctly against the warm pink/red/violet smoke clouds in the BG.
const HOVER_SCALE = 1.08;
const REST_SCALE = 1.0;
const HOVER_LERP_PER_SEC = 12;
const FLOAT_AMPLITUDE = 0.04;
const FLOAT_FREQ = 1.1;

const CLOUD_DETAIL = 2;
const CLOUD_RADIUS_FRACTION = 1.18;
const CLOUD_NOISE_AMPLITUDE = 0.13;
const CLOUD_OPACITY = 0.5;
// Body is a saturated peach-gold so the cloud has clear hue identity;
// the bloom postprocessor turns the emissive into a soft neon glow on
// top, dialled down so the colour reads instead of washing to white.
const CLOUD_COLOR = "#ffc878";
const CLOUD_EMISSIVE = "#ff8830";
const CLOUD_EMISSIVE_BASE = 0.55;
const CLOUD_EMISSIVE_AMP = 0.12;
const CLOUD_EMISSIVE_FREQ = 1.4;
const CLOUD_ROT_X_PER_SEC = 0.04;
const CLOUD_ROT_Y_PER_SEC = 0.09;
const PULSE_FREQ = 0.8;
const PULSE_AMP = 0.025;

// Sparkle texture — canvas-painted random bright dots that get applied as
// an emissiveMap. The dots are PART of the cloud's surface, not separate
// floating meshes, so they move with the cloud and animate via texture
// offset drift. Each tile gets its own pattern via Math.random in useMemo.
const SPARKLE_TEX_SIZE = 512;
const SPARKLE_DOT_COUNT = 220;
const SPARKLE_DOT_COLORS = ["#ffffff", "#fff0c0", "#ffe080", "#ffd0a0", "#ffc080", "#ffb070"];
const SPARKLE_BASE_GRAY = "#303030";
const SPARKLE_DRIFT_U_PER_SEC = 0.025;
const SPARKLE_DRIFT_V_PER_SEC = 0.018;

function makeSparkleTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SPARKLE_TEX_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  // Gray base (not black) so the emissive map drives uniform neon glow
  // across the whole cloud surface, with the bright dots layered on top
  // as sharper sparkle points.
  ctx.fillStyle = SPARKLE_BASE_GRAY;
  ctx.fillRect(0, 0, SPARKLE_TEX_SIZE, SPARKLE_TEX_SIZE);
  for (let i = 0; i < SPARKLE_DOT_COUNT; i++) {
    const x = Math.random() * SPARKLE_TEX_SIZE;
    const y = Math.random() * SPARKLE_TEX_SIZE;
    const r = Math.random() * 1.4 + 0.4;
    ctx.fillStyle =
      SPARKLE_DOT_COLORS[Math.floor(Math.random() * SPARKLE_DOT_COLORS.length)];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Build a one-shot displaced icosahedron. Combining a few orthogonal
// sin/cos waves yields organic puff shapes far cheaper than running noise
// per frame, and the rotation parallax creates an illusion of surface
// morph without us paying the per-frame vertex-buffer rewrite cost.
function makeCloudGeometry(radius: number): THREE.BufferGeometry {
  const geom = new THREE.IcosahedronGeometry(radius, CLOUD_DETAIL);
  const positions = geom.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const n =
      Math.sin(x * 3.1 + 1.2) * 0.4 +
      Math.cos(y * 2.7 + 0.8) * 0.4 +
      Math.sin(z * 3.3 + 0.3) * 0.4;
    const k = 1 + n * CLOUD_NOISE_AMPLITUDE;
    positions.setXYZ(i, x * k, y * k, z * k);
  }
  geom.computeVertexNormals();
  return geom;
}

export function CloudShell({ position, size, url, children }: CloudShellProps) {
  const halfSize = size[0] / 2;
  const cloudRadius = halfSize * CLOUD_RADIUS_FRACTION;

  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Group>(null);
  const cloudMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const phaseOffset = position[0] * 1.3 + position[1] * 0.7;

  const cloudGeometry = useMemo(() => makeCloudGeometry(cloudRadius), [cloudRadius]);
  const sparkleTex = useMemo(() => makeSparkleTexture(), []);

  const cloudMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(CLOUD_COLOR),
        transparent: true,
        opacity: CLOUD_OPACITY,
        // Reduced from a fully-matte cloud so iridescence + clearcoat +
        // sparkle highlights are actually visible. Fully rough scatters
        // everything into a flat tone.
        roughness: 0.45,
        metalness: 0.15,
        // Iridescence shifts colour across the cloud as it rotates.
        iridescence: 1.0,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [150, 700],
        // Clearcoat + envMap intensity kept modest so the silhouette
        // doesn't catch the white Lightformers as a stark white rim —
        // we want the emissive colour to define the cloud's edge glow,
        // not raw environment reflection.
        clearcoat: 0.4,
        clearcoatRoughness: 0.25,
        // emissive + emissiveMap = bright sparkle pixels scattered over
        // the cloud surface. The map is canvas-painted random dots; the
        // base colour is a warm pale gold so where the map is dark the
        // surface still has a subtle ambient glow.
        emissive: new THREE.Color(CLOUD_EMISSIVE),
        emissiveIntensity: CLOUD_EMISSIVE_BASE,
        emissiveMap: sparkleTex,
        side: THREE.DoubleSide,
        depthWrite: false,
        envMapIntensity: 0.7,
      }),
    [sparkleTex],
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

    if (pulseRef.current) {
      const s = 1 + Math.sin(t * PULSE_FREQ + phaseOffset) * PULSE_AMP;
      pulseRef.current.scale.set(s, s, s);
    }

    if (cloudMeshRef.current) {
      cloudMeshRef.current.rotation.x += delta * CLOUD_ROT_X_PER_SEC;
      cloudMeshRef.current.rotation.y += delta * CLOUD_ROT_Y_PER_SEC;
      // Pulse emissive intensity for breath-on/breath-off brightness.
      const mat = cloudMeshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity =
        CLOUD_EMISSIVE_BASE +
        Math.sin(t * CLOUD_EMISSIVE_FREQ + phaseOffset) * CLOUD_EMISSIVE_AMP;
    }

    // Drift the sparkle UVs so glints move across the surface in addition
    // to the rotation parallax — gives the surface a constant scintillation.
    if (sparkleTex) {
      sparkleTex.offset.x += delta * SPARKLE_DRIFT_U_PER_SEC;
      sparkleTex.offset.y += delta * SPARKLE_DRIFT_V_PER_SEC;
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
      {/* The icon — caller-provided, camera-facing, opaque (alphaTest). */}
      {children}

      {/* Single cloud body. Rotation flows the lumpy displacement; the
          pulse group gives a slow breathing scale; emissive sparkle map
          drifts across the surface for active "shimmer". */}
      <group ref={pulseRef}>
        <mesh ref={cloudMeshRef} geometry={cloudGeometry} material={cloudMaterial} />
      </group>
    </group>
  );
}
