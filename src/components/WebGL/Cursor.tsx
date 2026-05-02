'use client'

import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { MeshBasicNodeMaterial } from "three/webgpu";
import * as THREE from "three";
import {
  positionLocal,
  normalLocal,
  uv,
  vec3,
  vec4,
  abs,
  sub,
  time,
  mx_noise_float,
} from "three/tsl";

const BASE_INTENSITY = 0.2;
const SIZE = 0.4;

export const Cursor = () => {
  const cursorRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  // Track mouse via window events instead of r3f's pointer state, so the cursor
  // keeps moving even when the pointer is over a drei <Html> overlay (iframe etc.)
  // that captures pointer events from the canvas.
  const ndcMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      ndcMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndcMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // TSL node material — equivalent of the previous custom GLSL ShaderMaterial.
  // Compiles to WGSL on WebGPU and to GLSL on the WebGL2 fallback automatically.
  // `time` is a built-in TSL node updated by the renderer each frame, so we
  // no longer need a JS-side clock uniform (which triggered THREE.Clock deprecation).
  const material = useMemo(() => {
    const tScaled = time.mul(0.8);
    const noiseInput = positionLocal.add(vec3(tScaled));
    const displacement = mx_noise_float(noiseInput);

    const newPosition = positionLocal.add(
      normalLocal.mul(displacement.mul(BASE_INTENSITY)),
    );

    const distort = displacement.mul(BASE_INTENSITY).mul(2.0);
    const uvCentered = abs(uv().sub(0.5)).mul(2.0);
    const r = uvCentered.x.mul(sub(1.0, distort));
    const g = uvCentered.y.mul(sub(1.0, distort));
    const finalColor = vec4(vec3(r, g, 0.7), 0.8);

    const mat = new MeshBasicNodeMaterial({ transparent: true });
    mat.positionNode = newPosition;
    mat.colorNode = finalColor;
    return mat;
  }, []);

  useFrame(() => {
    const x = (ndcMouse.current.x * viewport.width) / 2;
    const y = (ndcMouse.current.y * viewport.height) / 2;
    cursorRef.current?.position.set(x, y, 0.1);
  });

  return (
    <mesh ref={cursorRef} material={material}>
      <icosahedronGeometry args={[SIZE, 8]} />
    </mesh>
  );
};
