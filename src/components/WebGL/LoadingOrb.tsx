'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import * as THREE from 'three'
import {
  positionLocal,
  normalLocal,
  normalView,
  vec3,
  vec4,
  mix,
  abs,
  sub,
  pow,
  sin,
  add,
  time,
  mx_noise_float,
  mx_fractal_noise_float,
} from 'three/tsl'
import { createRenderer } from '@/lib/create-renderer'

// Brand palette (mirrors what's used in the main scene's Clouds + transmission text)
const C_YELLOW = vec3(1.0, 0.76, 0.0) // #ffc300
const C_ORANGE = vec3(1.0, 0.27, 0.0) // #ff4500
const C_PINK = vec3(0.95, 0.1, 0.69) // #F21AB0
const C_VIOLET = vec3(0.62, 0.27, 0.75) // #9E46C0

// "Ferrofluid" loading orb:
//  - Near-black metallic body (SDF-ish multi-octave noise displacement)
//  - Iridescent fresnel rim that cycles through the site's palette over time
//  - Very slow rotation; the morph is what drives the motion
//  - Built entirely with TSL nodes → runs on WebGPU (and WebGL2 fallback)
function Ferrofluid() {
  const meshRef = useRef<THREE.Mesh>(null)
  const elapsedRef = useRef(0)

  const material = useMemo(() => {
    // ----- Displacement -----
    const tFast = time.mul(0.45)
    const tSlow = time.mul(0.18)
    const fineDetail = mx_fractal_noise_float(
      positionLocal.mul(2.2).add(vec3(tFast)),
      5,
      2.0,
      0.55,
    ).mul(0.18)
    const lowSwell = mx_noise_float(
      positionLocal.mul(0.65).add(vec3(tSlow)),
    ).mul(0.22)
    const displacement = fineDetail.add(lowSwell)
    const newPosition = positionLocal.add(normalLocal.mul(displacement))

    // ----- Body color: very dark, slightly warm-blue tinted -----
    const baseColor = vec3(0.02, 0.02, 0.035)

    // ----- Iridescent rim via view-space fresnel -----
    const fresnel = pow(sub(1.0, abs(normalView.z)), 2.4)

    // ----- Hue cycling through 4 brand colors over time -----
    const tHue = time.mul(0.55)
    const w1 = sin(tHue).mul(0.5).add(0.5)
    const w2 = sin(tHue.add(1.57)).mul(0.5).add(0.5)
    const phaseA = mix(C_YELLOW, C_ORANGE, w1)
    const phaseB = mix(C_PINK, C_VIOLET, w2)
    const blend = sin(tHue.mul(0.4)).mul(0.5).add(0.5)
    const rimHue = mix(phaseA, phaseB, blend)

    // ----- Subtle iridescent shimmer driven by surface normal + time -----
    const shimmer = mx_noise_float(
      normalLocal.mul(3.0).add(vec3(time.mul(1.2))),
    )
      .mul(0.18)
      .add(1.0)
    const rimColor = rimHue.mul(shimmer)

    // ----- Composite: base + fresnel × hue (additive feel) -----
    const rimContribution = rimColor.mul(fresnel).mul(1.85)
    const finalColor = add(baseColor, rimContribution)

    const mat = new MeshBasicNodeMaterial({ transparent: true })
    mat.positionNode = newPosition
    mat.colorNode = vec4(finalColor, 0.98)
    return mat
  }, [])

  useFrame((_, delta) => {
    elapsedRef.current += delta
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.18
      meshRef.current.rotation.x = Math.sin(elapsedRef.current * 0.22) * 0.18
    }
  })

  return (
    <mesh ref={meshRef} material={material}>
      <icosahedronGeometry args={[1, 48]} />
    </mesh>
  )
}

export function LoadingOrb({ size = 140 }: { size?: number }) {
  return (
    <Canvas
      gl={createRenderer}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 2.6], fov: 38 }}
      style={{ width: size, height: size, pointerEvents: 'none' }}
    >
      <Ferrofluid />
    </Canvas>
  )
}
