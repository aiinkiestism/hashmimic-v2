'use client'

import { useTexture } from "@react-three/drei";
import { Vector3Tuple } from "three";
import { openExternal } from "@/lib/external";

interface IconLinkProps {
  src: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  url: string;
}

export function IconLink({ src, position, size, url }: IconLinkProps) {
  const texture = useTexture(src);
  return (
    <mesh position={position} onClick={() => openExternal(url)}>
      <boxGeometry args={size} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
