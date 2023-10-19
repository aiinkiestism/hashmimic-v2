import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useMemo, RefObject } from "react";
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
uniform vec3 u_mouse;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * 4.0) * 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`

const fragmentShader = `
varying vec2 vUv;
uniform vec3 u_mouse;

vec3 colorA = vec3(0.912,0.191,0.652);
vec3 colorB = vec3(0,0,0);

void main() {
  // "Normalizing" with an arbitrary value
  // We'll see a cleaner technique later :)   
  vec2 normalizedPixel = gl_FragCoord.xy/600.0;
  vec3 color = mix(colorA, colorB, normalizedPixel.x);

  gl_FragColor = vec4(color,1.0);
}

`;

export const Cursor = () => {
  const cursorRef: RefObject<THREE.Mesh> = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => {
    const u_resolution = { value: new THREE.Vector2() };
    const u_mouse = { value: new THREE.Vector2() };

    u_resolution.value.x = viewport.width;
    u_resolution.value.y = viewport.height;

    return { u_resolution, u_mouse };
  }, [viewport]);

  useFrame(({ mouse }: { mouse: THREE.Vector2 }) => {
    const x = (mouse.x * viewport.width) * 1.5 / 2;
    const y = (mouse.y * viewport.height) * 1.5 / 2;
    const z = -2;

    uniforms.u_mouse.value.x = x;
    uniforms.u_mouse.value.y = y;

    cursorRef.current?.position.set(x, y, z);
  });

  return (
    <mesh ref={cursorRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};
