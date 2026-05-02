'use client'

import { Canvas } from '@react-three/fiber'
import { Cursor } from './Cursor'
import { useIsMobile, useIsHydrated } from '@/lib/responsive'
import { useNavigationState } from '@/lib/navigation-context'
import { createRenderer } from '@/lib/create-renderer'

// The blob cursor lives in its own fixed-position canvas above everything.
// Reasons:
//  1. With pointer-events: none and a z-index above any drei <Html> iframe,
//     the cursor remains visually on top of all DOM overlays (e.g. Spotify embed).
//  2. The cursor tracks window mouse events directly (see Cursor.tsx), so it
//     keeps moving even when the pointer is captured by an iframe.
//  3. Decoupling from the main scene canvas avoids click-eating: this overlay
//     is pointer-events: none, so clicks pass through to the 3D content below.
//  4. visibility is toggled via NavigationContext when the pointer enters DOM
//     regions where window-level mousemove cannot fire (e.g. Spotify iframe),
//     letting the OS cursor take over there instead of leaving a stuck blob.
//
// We always render the wrapper div on both server and client (gating only the
// Canvas itself on a post-mount flag) so neighboring siblings don't shift
// position between SSR and hydration. `suppressHydrationWarning` covers the
// remaining inline-style differences when the wrapper turns interactive.
export function CursorOverlay() {
  const { isMobile } = useIsMobile()
  const { cursorHidden } = useNavigationState()
  const hydrated = useIsHydrated()

  const showCanvas = hydrated && !isMobile

  return (
    <div
      suppressHydrationWarning
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        visibility: cursorHidden ? 'hidden' : 'visible',
      }}
    >
      {showCanvas && (
        <Canvas
          dpr={[1, 1.5]}
          gl={createRenderer}
          style={{
            background: 'transparent',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
          }}
        >
          <Cursor />
        </Canvas>
      )}
    </div>
  )
}
