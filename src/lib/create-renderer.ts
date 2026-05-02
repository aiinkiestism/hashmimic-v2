'use client'

import { WebGPURenderer } from 'three/webgpu'

// Single renderer factory used by every <Canvas> in the app.
// - Primary: WebGPU via three's WebGPURenderer
// - Fallback: WebGL2 (the same WebGPURenderer auto-switches its backend when
//   `forceWebGL` is true). This keeps a single material/shader path (TSL) for
//   both renderers — no separate WebGL ShaderMaterial branch to maintain.
//
// `props` is typed loosely because r3f's `gl` callback hands us a
// DefaultGLProps shape whose `powerPreference` ("default") is wider than
// WebGPURenderer's enum. We forward what we want and override the rest.
export async function createRenderer(props: any = {}) {
  const supportsWebGPU =
    typeof navigator !== 'undefined' && 'gpu' in navigator

  const renderer = new WebGPURenderer({
    canvas: props.canvas,
    powerPreference: 'high-performance',
    antialias: false,
    alpha: true, // transparent clear color so each Canvas overlays cleanly on the page
    forceWebGL: !supportsWebGPU,
  })
  await renderer.init()
  return renderer
}
