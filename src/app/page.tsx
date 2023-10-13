'use client'

import Link from "next/link";
import * as THREE from 'three'
import { Canvas, useFrame, useLoader, extend, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState, forwardRef, useLayoutEffect } from "react";
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
import { Cloud, Sparkles } from '@react-three/drei'

export default function Home() {

  return (
    <>
      <Canvas style={{ background: '#fff', width: '100%', height: '100vh', position: 'fixed' }}>
        <Cloud
          position={[0, 0, 0]}
          opacity={0.08}
          speed={0.2}
          width={12}
          depth={2.8}
          segments={80}
          />
      </Canvas>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
      </main>
    </>
  );
}
