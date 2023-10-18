'use client'

import Link from "next/link";
import { AppCanvas, Clouds, AppText3D } from '@/components'
import { Environment, Lightformer, Cloud } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
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
  const cursorRef = useRef();
  const { viewport } = useThree()

  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    // @ts-ignore
    cursorRef.current?.position.set(x, y, 0)
  })
  
  return (
    // @ts-ignore
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
      {/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed left-0 top-0 flex w-full lg:static" />
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <Link
              className="text-white pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href={{ pathname: "/me" }}
            >
              me
            </Link>
          </div>
        </div>
      </main> */}
    </>
  );
}
