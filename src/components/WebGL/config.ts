import type { ComponentProps } from "react";
import type { MeshTransmissionMaterial } from "@react-three/drei";

export enum FontProps {
  HOME_TITLE = '/home_center.json',
  DANCING = '/DancingScript_Regular.json',
  RUBIK_LINES = '/RubikLines_Regular.json',
  RUBIK_GLITCH = '/RubikGlitch_Regular.json'
}

type TransmissionMaterialProps = ComponentProps<typeof MeshTransmissionMaterial>;

export type MaterialConfigKey = "title" | "subTitle";

export const HOME_TRANSMISSION_MATERIAL_CONFIG: Record<MaterialConfigKey, TransmissionMaterialProps> = {
  title: {
    backside: true,
    samples: 6,
    resolution: 512,
    clearcoat: 0,
    clearcoatRoughness: 0.0,
    thickness: 0.35,
    chromaticAberration: 5,
    anisotropy: 0.3,
    roughness: 0.0,
    distortion: 0.5,
    distortionScale: 1,
    temporalDistortion: 0.4,
    ior: 0.83,
    transmission: 0.6,
    color: '#ffc300',
    envMapIntensity: 1,
    reflectivity: 0.05,
    emissive: '#fff',
    emissiveIntensity: -0.075,
  },
  subTitle: {
    backside: true,
    samples: 6,
    resolution: 512,
    clearcoat: 0,
    clearcoatRoughness: 0.0,
    thickness: 0.35,
    chromaticAberration: 5,
    anisotropy: 0.3,
    roughness: 0.0,
    distortion: 0.5,
    distortionScale: 1,
    temporalDistortion: 0.4,
    ior: 0.83,
    transmission: 0.6,
    color: '#ff4500',
    envMapIntensity: 1,
    reflectivity: 0.05,
    emissive: '#ff4500',
    emissiveIntensity: 0.15,
  },
};
