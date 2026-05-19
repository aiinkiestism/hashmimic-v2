'use client'

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { CloudShell } from "./CloudShell";

interface GlyphIconProps {
  glyph: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
}

// Matches IconLink's INNER_FRACTION so glyph and icon tiles render at
// the same visual size as the central sigil. Large + camera-facing means
// the glyph is unambiguously readable; halo rings frame around it.
const INNER_FRACTION = 0.75;

// Renders a single glyph (e.g. `#`) with the page's loaded Dancing Script
// web font into a canvas, then uses that canvas as a Three.js texture.
//
// We can't get the same look from a static SVG because Three.js loads
// textures via <img>, which triggers the browser's "SVG-as-image"
// sandbox — external/web fonts are not resolved inside that sandbox, so
// `font-family: 'Dancing Script'` falls through to the system `cursive`
// generic (Apple Chancery on Mac), which renders heavily slanted. By
// drawing on a canvas in the live document instead, we use the real
// Dancing Script face that next/font/google has already loaded.
const TEX_SIZE = 512;
const FONT_SPEC = "700 380px 'Dancing Script', cursive";

function drawGlyph(ctx: CanvasRenderingContext2D, glyph: string) {
  ctx.clearRect(0, 0, TEX_SIZE, TEX_SIZE);
  // No background fill — the CloudShell already provides the dark
  // iridescent core orb behind the glyph. Keeping alpha=0 elsewhere lets
  // the inner orb show through the icon plane's alphaTest discards.

  const cx = TEX_SIZE / 2;

  // Brand-palette diagonal gradient on the glyph fill.
  const grad = ctx.createLinearGradient(0, 0, TEX_SIZE, TEX_SIZE);
  grad.addColorStop(0, "#ffc300");
  grad.addColorStop(0.33, "#ff4500");
  grad.addColorStop(0.66, "#F21AB0");
  grad.addColorStop(1, "#9E46C0");

  ctx.fillStyle = grad;
  ctx.font = FONT_SPEC;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, cx, cx);
}

export function GlyphIcon({ glyph, position, size, url }: GlyphIconProps) {
  // Build the texture during render via useMemo. SSR returns null (no
  // `document`); on hydration the client run produces the real texture.
  const texture = useMemo<THREE.CanvasTexture | null>(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = TEX_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    drawGlyph(ctx, glyph);
    return tex;
  }, [glyph]);

  // Redraw with the actual Dancing Script face once it has loaded. Until
  // then the initial render uses whatever fallback the browser chose.
  useEffect(() => {
    if (!texture || typeof document === "undefined" || !document.fonts) return;
    let cancelled = false;
    document.fonts.load(FONT_SPEC).then(() => {
      if (cancelled) return;
      const ctx = (texture.image as HTMLCanvasElement).getContext("2d");
      if (!ctx) return;
      drawGlyph(ctx, glyph);
      texture.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [texture, glyph]);

  // Dispose the GPU texture when the component unmounts or the glyph
  // changes (which produces a fresh memoised texture).
  useEffect(() => {
    if (!texture) return;
    return () => {
      texture.dispose();
    };
  }, [texture]);

  if (!texture) return null;

  const innerSize = size[0] * INNER_FRACTION;

  return (
    <CloudShell position={position} size={size} url={url}>
      {/* alphaTest discards everything outside the glyph silhouette so the
          backdrop additive halo shows through cleanly, while keeping the
          glyph itself in the opaque pass for crisp legibility. */}
      <mesh>
        <planeGeometry args={[innerSize, innerSize]} />
        <meshBasicMaterial map={texture} alphaTest={0.1} toneMapped={false} />
      </mesh>
    </CloudShell>
  );
}
