'use client'

import { Center, Text3D, MeshTransmissionMaterial } from "@react-three/drei";
import { Vector3Tuple } from "three";
import * as THREE from 'three'
import { HOME_TRANSMISSION_MATERIAL_CONFIG, FontProps } from "./config";
import { useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from "react";
import { useWindowSize } from "react-use";
import type { Route } from 'next'

interface Text3DProps {
  rawPosition: Vector3Tuple;
  text: string;
  size: Vector3Tuple;
  font: FontProps;
  materialConfigProp: string;
  path?: Route<string> | null;
}

const MainText3D: React.FC<Text3DProps> = React.memo((props) => {
  const { text, size, rawPosition, font, materialConfigProp, path } = props;
  const texture = useLoader(RGBELoader, process.env.NEXT_PUBLIC_HOME_FONT_TEXTURE ?? '');
  const router = useRouter();
  const { width } = useWindowSize();

  const responsiveSize: Vector3Tuple = useMemo(() => (
    [width < 1025 ? size[0] / 3 : size[0], width < 1025 ? size[1] / 3 : size[1], size[2]]
  ), [width, size]);

  const responsivePosition: Vector3Tuple = useMemo(() => (
    [width < 1025 ? rawPosition[0] / 3 : rawPosition[0], width < 1025 ? rawPosition[1] / 1.8 : rawPosition[1], rawPosition[2]]
  ), [width, rawPosition]);

  const handleClick = useCallback(() => {
    if (path) router.push(path);
  }, [path, router]);

  return (
    <group>
      <Center scale={responsiveSize ? responsiveSize : size} position={responsivePosition ? responsivePosition : rawPosition} front top {...props} onClick={handleClick}>
        <Text3D
          castShadow
          bevelEnabled
          font={font}
          scale={5}
          letterSpacing={-0.03}
          height={0.25}
          bevelSize={0.01}
          bevelSegments={2.5}
          curveSegments={32}
          bevelThickness={0.01}
        >
          {text}
          <MeshTransmissionMaterial {...HOME_TRANSMISSION_MATERIAL_CONFIG[materialConfigProp]} background={texture} />
        </Text3D>
      </Center>
    </group>
  );
});
MainText3D.displayName = 'MainText3D';

export const MainText3Ds = {
  home: {
    Copyright: () => ( <MainText3D rawPosition={[-5.15, -0.15, -0.6]} size={[0.1, 0.125, 0.08]} text='©' font={FontProps.HOME_TITLE} materialConfigProp={'title'} /> ),
    BrandName: () => ( <MainText3D rawPosition={[0.65, -0.15, -0.6]} size={[0.28, 0.3, 0.16]} text='Hashmimic' font={FontProps.HOME_TITLE} materialConfigProp={'title'} /> ),
    WhoLink: () => ( <MainText3D rawPosition={[0.75, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Who?' font={FontProps.DANCING} materialConfigProp={'subTitle'} path={'/who'} /> ),
    MusicLink: () => ( <MainText3D rawPosition={[-2.15, -1.75, 0.08]} size={[0.1, 0.125, 0.08]} text='Music' font={FontProps.DANCING} materialConfigProp={'subTitle'} path={'/music'} /> ),
    Web3NTechLink: () => ( <MainText3D rawPosition={[3.0, -2.5, 0.08]} size={[0.1, 0.125, 0.08]} text='Web3 & Tech' font={FontProps.DANCING} materialConfigProp={'subTitle'} path={'/web3-n-tech'} /> ),
  },
  who: {
    Title: () => ( <MainText3D rawPosition={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Who?' font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
    Descriptions: [
      () => <MainText3D rawPosition={[0, 1.0, 0.08]} size={[0.075, 0.1, 0.06]} text='Hashmimic is an' font={FontProps.DANCING} materialConfigProp={'subTitle'} />,
      () => <MainText3D rawPosition={[0, 0.5, 0.08]} size={[0.075, 0.1, 0.06]} text='indie hacker  &  musician.' font={FontProps.DANCING} materialConfigProp={'subTitle'} />,
    ]
  },
  music: {
    Title: () => ( <MainText3D rawPosition={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Music' font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
    Description: () => ( <MainText3D rawPosition={[0, 1.0, 0.0]} size={[0.075, 0.1, 0.06]} text="Listen now." font={FontProps.DANCING} materialConfigProp={'subTitle'} />)
  },
  web3NTech: {
    Title: () => ( <MainText3D rawPosition={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Web3 & Tech' font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
    Description: () => ( <MainText3D rawPosition={[0, 0, 0.08]} size={[0.075, 0.1, 0.06]} text="Hashmimic Projects Below." font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
  }
}

const _MainText3DComponents = Object.values(MainText3Ds).flatMap((category) => {
  return Object.values(category).map((component) => {
    if (typeof component === 'function') {
      const obj = new THREE.Object3D();
      obj.add(React.createElement(component) as unknown as THREE.Object3D);
      return obj;
    } else if (Array.isArray(component)) {
      return component.map((subComponent) => {
        const obj = new THREE.Object3D();
        obj.add(React.createElement(subComponent) as unknown as THREE.Object3D);
        return obj;
      });
    }
    return null;
  });
});

export const MainText3DComponents = _MainText3DComponents.flat() as unknown as THREE.Object3D[];

