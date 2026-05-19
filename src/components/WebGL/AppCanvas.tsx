'use client'

import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

// Main scene Canvas stays on the legacy WebGLRenderer because drei's
// MeshTransmissionMaterial is implemented as a custom ShaderMaterial that
// the new node-based pipeline (used by WebGPURenderer) reports as
// "Material 'ShaderMaterial' is not compatible". Until drei publishes a
// node-material variant of MTM, we keep this canvas on WebGL.
//
// CursorOverlay and LoadingOrb still default to WebGPU (with WebGL2
// fallback) because they use TSL node materials, not legacy ShaderMaterial.
//
// Bloom postprocessing is what makes emissive surfaces (the cloud tiles,
// title text emissive trim) actually read as glowing. Without it, even
// max-intensity emissive caps at screen white and looks "merely bright"
// rather than "neon glow with halo".
export function AppCanvas({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{
        background: 'rgba(6, 7, 19, 0.001)',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
      }}
      fallback={
        <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
          Hashmimic — indie hacker and musician. This site requires WebGL.
        </div>
      }
    >
      <ambientLight intensity={0.4} />
      {children}
      <EffectComposer>
        <Bloom
          intensity={0.65}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.15}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
