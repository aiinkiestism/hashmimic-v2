'use client'

import { useTexture } from "@react-three/drei";
import { MainText3Ds } from "@/components";
import Web3BioIcon from "/public/web3-bio.png"

export default function Web3NTech() {
  const onClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <MainText3Ds.web3NTech.Title />
      <mesh position={[0, 1.3, 0]} onClick={() => onClick("https://web3.bio/hashmimic.eth")}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshBasicMaterial attach="material" map={useTexture(Web3BioIcon.src)} />
      </mesh>
      <MainText3Ds.web3NTech.Description />
      {/* need to brainstorming IA more */}
      {/* project images & links */}
    </>
  )
}