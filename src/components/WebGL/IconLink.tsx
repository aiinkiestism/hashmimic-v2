'use client'

import { useTexture } from "@react-three/drei";
import { Vector3Tuple } from "three";
import { CloudShell } from "./CloudShell";

interface IconLinkProps {
  src: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
}

// Icon dominates the CloudShell — there's no gem wrapping it, just halo
// rings around the perimeter, so the icon is the readable centrepiece.
// planeGeometry (square) keeps the full PNG/SVG visible without cropping.
const INNER_FRACTION = 0.75;

export function IconLink({ src, position, size, url }: IconLinkProps) {
  const texture = useTexture(src);
  const innerSize = size[0] * INNER_FRACTION;

  return (
    <CloudShell position={position} size={size} url={url}>
      {/* alphaTest keeps the icon in the opaque render queue so the halo
          rings' transmission passes see it in the framebuffer, and so the
          additive background sprite glows around the icon's transparent
          edges instead of being completely occluded by the plane. */}
      <mesh>
        <planeGeometry args={[innerSize, innerSize]} />
        <meshBasicMaterial map={texture} alphaTest={0.1} toneMapped={false} />
      </mesh>
    </CloudShell>
  );
}
