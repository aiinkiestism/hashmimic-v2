'use client'

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface GlyphIconProps {
  glyph: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
}

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

  // Deep navy card background (matches the other dark-bg icons).
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

  // Soft halo so the icon glows against the watercolor page bg.
  const cx = TEX_SIZE / 2;
  const halo = ctx.createRadialGradient(cx, cx, 0, cx, cx, TEX_SIZE * 0.6);
  halo.addColorStop(0, "rgba(255, 195, 0, 0.24)");
  halo.addColorStop(0.55, "rgba(242, 26, 176, 0.10)");
  halo.addColorStop(1, "rgba(10, 10, 20, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

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

  return (
    <mesh position={position} onClick={() => openExternal(url)}>
      <boxGeometry args={size} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
