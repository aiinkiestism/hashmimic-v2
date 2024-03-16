'use client'

import { useTexture } from "@react-three/drei";
import { useWindowSize } from "react-use";
import { MainText3Ds } from "@/components";
import Web3BioIcon from "/public/web3-bio.png"
import { Vector3Tuple } from "three";

export default function Web3NTech() {
  const { width } = useWindowSize();

  const geometrySize: Vector3Tuple = [width < 1025 ? 0.7 / 2 : 0.7, width < 1025 ? 0.7 / 2 : 0.7, 0.1];

  const onClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <MainText3Ds.web3NTech.Title />
      <mesh position={[0, 0.68, 0]} onClick={() => onClick("https://web3.bio/hashmimic.eth")}>
        <boxGeometry args={geometrySize} />
        <meshBasicMaterial attach="material" map={useTexture(Web3BioIcon.src)} />
      </mesh>
      <MainText3Ds.web3NTech.Description />
      {/* need to brainstorming IA more */}
      {/* project images & links */}
    </>
  )
}