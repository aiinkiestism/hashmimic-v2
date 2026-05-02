'use client'

import { Canvas } from '@react-three/fiber'

// Main scene Canvas stays on the legacy WebGLRenderer because drei's
// MeshTransmissionMaterial is implemented as a custom ShaderMaterial that
// the new node-based pipeline (used by WebGPURenderer) reports as
// "Material 'ShaderMaterial' is not compatible". Until drei publishes a
// node-material variant of MTM, we keep this canvas on WebGL.
//
// CursorOverlay and LoadingOrb still default to WebGPU (with WebGL2
// fallback) because they use TSL node materials, not legacy ShaderMaterial.
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
    </Canvas>
  )
}
