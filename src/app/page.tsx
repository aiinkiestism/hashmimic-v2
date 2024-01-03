'use client'

import Link from "next/link";
import { AppCanvas, Clouds, HomeText3D, Cursor, FontProps } from '@/components'
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense } from "react";

export default function Home() {

  return (
    <>
      <AppCanvas>
        <Suspense fallback={null}>
          <Cursor />
          <Clouds />
          <HomeText3D position={[-5.15, -0.15, -0.6]} size={[0.1, 0.125, 0.08]} text='©' font={FontProps.HOME_TITLE} materialConfigProp={'title'} />
          <HomeText3D position={[0.65, -0.15, -0.6]} size={[0.28, 0.3, 0.16]} text='Hashmimic' font={FontProps.HOME_TITLE} materialConfigProp={'title'} />
          <HomeText3D position={[0.75, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Who?' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
          <HomeText3D position={[-2.15, -1.75, 0.08]} size={[0.1, 0.125, 0.08]} text='Music' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
          <HomeText3D position={[3.0, -2.5, 0.08]} size={[0.1, 0.125, 0.08]} text='Web3 and Tech' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
        </Suspense>
        <directionalLight position={[0, 5, 2.5]} intensity={2} />
        <directionalLight
          castShadow
          position={[-5, 5, 2.5]}
          intensity={2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Environment resolution={32}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
            <Lightformer type="ring" intensity={1} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
          </group>
        </Environment>
      </AppCanvas>
    </>
  );
}
