import { AppCanvas, Clouds, Cursor, MainText3Ds } from '@/components'
import { Environment, Lightformer } from "@react-three/drei";
import React from 'react';
import { ReactNode, Suspense } from "react";
import { useHover } from 'react-use';

type Element = ((state: boolean) => React.ReactElement<any>) | React.ReactElement<any>;

interface Props {
  children: ReactNode
}

export const AppBg: React.FC<Props> = (props) => {
  const { children } = props;
  // eslint-disable-next-line react/jsx-key
  const hoverableElements: Element[] = [...Object.values(MainText3Ds.home), MainText3Ds.who.Title, ...MainText3Ds.who.Descriptions, ...Object.values(MainText3Ds.music), ...Object.values(MainText3Ds.web3NTech)];

  const hovered = hoverableElements.some(el => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [_, _hovered] = useHover(el);
  return _hovered;
  });

  return (
    <>
      <AppCanvas>
        <Suspense fallback={null}>
          <Cursor hovered={hovered} />
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