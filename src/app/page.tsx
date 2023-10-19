'use client'

import Link from "next/link";
import { AppCanvas, Clouds, AppText3D } from '@/components'
import { Environment, Lightformer, Cloud } from "@react-three/drei";
import { RefObject, useEffect, useRef, useState } from "react";
import { useFrame, useThree, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshLineMaterial } from 'meshline';

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 10.0;
  }
`;

const fragmentShader = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

const Cursor = () => {
  const cursorRef: RefObject<THREE.Points> = useRef<THREE.Points>(null);
  const { viewport } = useThree()

  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    cursorRef.current?.position.set(x, y, 0)
  })
  
  return (
    <points ref={cursorRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={1}
          // @ts-ignore
          array={[0, 0, 0]}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        args={[{ vertexShader, fragmentShader, transparent: true }]}
      />
    </points>
  );
};

export default function Home() {

  return (
    <>
      <AppCanvas>
        {/* <Cursor /> */}
        <Clouds />
        <AppText3D position={[0, 0, -14]} text='Hashmimic' />
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
            <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
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
