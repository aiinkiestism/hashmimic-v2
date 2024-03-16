import { AppCanvas, Clouds, Cursor } from '@/components'
import { Environment, Lightformer } from "@react-three/drei";
import React from 'react';
import { ReactNode, Suspense } from "react";
import { useWindowSize } from 'react-use';

interface Props {
  children: ReactNode
}

export const AppBg: React.FC<Props> = (props) => {
  const { children } = props;
  const { width } = useWindowSize();

  return (
    <>
      <AppCanvas>
        <Suspense fallback={null}>
          {width < 1025 ? null : <Cursor />}
          <Clouds />
          {children}
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
  )
}