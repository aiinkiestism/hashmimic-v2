'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import {
  uv,
  vec2,
  vec3,
  vec4,
  mix,
  time,
  sin,
  length,
  smoothstep,
  sub,
  add,
  mx_noise_float,
  mx_fractal_noise_float,
} from 'three/tsl'
import { createRenderer } from '@/lib/create-renderer'

// Brand palette
const C_DEEP = vec3(0.04, 0.04, 0.09)
const C_VIOLET = vec3(0.62, 0.27, 0.75)
const C_PINK = vec3(0.95, 0.1, 0.69)
const C_RED = vec3(0.79, 0.15, 0.21)
const C_ORANGE = vec3(1.0, 0.27, 0.0)
const C_YELLOW = vec3(1.0, 0.76, 0.0)

// Full-screen procedural veil. Built as a single fragment-only TSL pass on a
// plane sized to the camera's visible area at z=0 (via useThree().viewport),
// so the geometry always covers the whole canvas regardless of resolution.
function Veil() {
  const { viewport } = useThree()

  const material = useMemo(() => {
    const u = uv()

    // Domain warp: shift sample coordinates by a low-frequency noise field
    // so the color streamers feel fluid rather than grid-aligned.
    const warpT = time.mul(0.12)
    const warpX = mx_noise_float(vec3(u.mul(2.0), warpT)).mul(0.42)
    const warpY = mx_noise_float(vec3(u.mul(2.0).add(vec2(7.3, 2.1)), warpT)).mul(0.42)
    const uw = vec2(add(u.x, warpX), add(u.y, warpY))

    // Multi-octave flow noise sampled at the warped coords + time.
    const flow = mx_fractal_noise_float(
      vec3(uw.mul(3.2), time.mul(0.18)),
      5,
      2.0,
      0.55,
    )
    const f01 = flow.mul(0.5).add(0.5)

    // Stage map → palette ramp, skewed toward the dark end so violet/red
    // dominate and the bright orange/yellow only flicker at narrow peaks.
    const s1 = mix(C_DEEP, C_VIOLET, smoothstep(0.0, 0.45, f01))
    const s2 = mix(s1, C_PINK, smoothstep(0.55, 0.7, f01))
    const s3 = mix(s2, C_RED, smoothstep(0.7, 0.82, f01))
    const s4 = mix(s3, C_ORANGE, smoothstep(0.86, 0.94, f01))
    const colored = mix(s4, C_YELLOW, smoothstep(0.96, 1.0, f01))

    // Subtle horizontal scanlines for that "shader takeover" feel.
    const scan = sin(u.y.mul(800)).mul(0.06)
    const scanned = colored.sub(vec3(scan))

    // Radial vignette darkens edges; keeps focus loosely centered.
    const dist = length(u.sub(0.5))
    const vignette = sub(1.0, smoothstep(0.2, 0.9, dist))
      .mul(0.85)
      .add(0.12)
    const vignetted = scanned.mul(vignette)

    // Pull overall brightness down so it reads as a deep veil, not a wallpaper.
    const tinted = vignetted.mul(0.42)

    const mat = new MeshBasicNodeMaterial({ transparent: true })
    mat.colorNode = vec4(tinted, 0.94)
    mat.depthTest = false
    mat.depthWrite = false
    return mat
  }, [])

  return (
    <mesh material={material} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

export function LoadingShader() {
  return (
    <Canvas
      gl={createRenderer}
      dpr={[1, 1.5]}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Veil />
    </Canvas>
  )
}
