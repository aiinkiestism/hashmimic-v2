'use client'

import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useIsMobile } from '@/lib/responsive'

// Keep the home brand name ("©Hashmimic" + the three nav links) in frame at
// any viewport aspect. The scene uses R3F's default perspective camera
// (fov 75, position z 5), which frames the wide desktop layout. A perspective
// camera's *vertical* FOV is fixed, so as the viewport narrows toward square
// the horizontal FOV shrinks and clips the brand name on both sides — visible
// on square OG captures and on narrow/portrait desktop windows.
//
// We dolly the camera straight back just enough to keep a fixed world
// half-width (MIN_HALF_WIDTH) horizontally visible. We only ever pull *back*,
// never push in, so wide desktop framing (aspect ≳ 1.54) is byte-for-byte
// unchanged. Mobile is left alone: MainText3D already scales the brand to 1/3
// there, so the default z 5 keeps it in frame.
const BASE_Z = 5
const DEFAULT_FOV = 75
// World units that must stay visible left-of-center / right-of-center. The
// brand "Hashmimic" reaches ≈ x 5.5 and the © sits at x −5.15, so ~5.9 keeps
// both in frame with a small margin.
const MIN_HALF_WIDTH = 5.9

export function ResponsiveCamera() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const { isMobile } = useIsMobile()

  useEffect(() => {
    const aspect = size.width / size.height
    const fov = 'fov' in camera ? (camera.fov as number) : DEFAULT_FOV
    const halfFovTan = Math.tan(((fov * Math.PI) / 180) / 2)
    const requiredZ = MIN_HALF_WIDTH / (halfFovTan * aspect)
    camera.position.z = isMobile ? BASE_Z : Math.max(BASE_Z, requiredZ)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, isMobile])

  return null
}
