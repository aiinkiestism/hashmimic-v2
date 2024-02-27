'use client'

import { Center, Text3D, MeshTransmissionMaterial } from "@react-three/drei";
import { Vector3Tuple } from "three";
import * as THREE from 'three'
import { HOME_TRANSMISSION_MATERIAL_CONFIG, FontProps } from "./config";
import { useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";
import { useRouter } from 'next/navigation'
import React from "react";

interface Text3DProps {
  position: Vector3Tuple;
  text: string;
  size: Vector3Tuple;
  font: FontProps;
  materialConfigProp: string;
  path?: any;  // TODO: provide type
}

export const MainText3D: React.FC<Text3DProps> = (props) => {
  const { text, size, font, materialConfigProp, path } = props;
  const texture = useLoader(RGBELoader, process.env.NEXT_PUBLIC_HOME_FONT_TEXTURE ?? '');
  const router = useRouter();

  const handleClick = () => {
    if (path) router.push(path);
  };

  return (
    <group>
      <Center scale={size} front top {...props} onClick={handleClick}>
        <Text3D
          castShadow
          bevelEnabled
          font={font}
          scale={5}
          letterSpacing={-0.03}
          height={0.25}
          bevelSize={0.01}
          bevelSegments={10}
          curveSegments={128}
          bevelThickness={0.01}
        >
          {text}
          <MeshTransmissionMaterial {...HOME_TRANSMISSION_MATERIAL_CONFIG[materialConfigProp]} background={texture} />
        </Text3D>
      </Center>
    </group>
  );
};

export const MainText3Ds = {
  home: {
    Copyright: () => ( <MainText3D position={[-5.15, -0.15, -0.6]} size={[0.1, 0.125, 0.08]} text='©' font={FontProps.HOME_TITLE} materialConfigProp={'title'} /> ),
    BrandName: () => ( <MainText3D position={[0.65, -0.15, -0.6]} size={[0.28, 0.3, 0.16]} text='Hashmimic' font={FontProps.HOME_TITLE} materialConfigProp={'title'} /> ),
    WhoLink: () => ( <MainText3D position={[0.75, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Who?' font={FontProps.DANCING} materialConfigProp={'subTitle'} path={'/who'} /> ),
    MusicLink: () => ( <MainText3D position={[-2.15, -1.75, 0.08]} size={[0.1, 0.125, 0.08]} text='Music' font={FontProps.DANCING} materialConfigProp={'subTitle'} path={'/music'} /> ),
    Web3NTechLink: () => ( <MainText3D position={[3.0, -2.5, 0.08]} size={[0.1, 0.125, 0.08]} text='Web3 & Tech' font={FontProps.DANCING} materialConfigProp={'subTitle'} path={'/web3-n-tech'} /> ),
  },
  who: {
    Title: () => ( <MainText3D position={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Who?' font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
    Descriptions: [
      () => <MainText3D position={[0, 1.0, 0.08]} size={[0.075, 0.1, 0.06]} text='Hashmimic is an' font={FontProps.DANCING} materialConfigProp={'subTitle'} />,
      () => <MainText3D position={[0, 0.5, 0.08]} size={[0.075, 0.1, 0.06]} text='indie hacker  &  musician.' font={FontProps.DANCING} materialConfigProp={'subTitle'} />,
    ]
  },
  music: {
    Title: () => ( <MainText3D position={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Music' font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
    Description: () => ( <MainText3D position={[0, 1.0, 0.0]} size={[0.075, 0.1, 0.06]} text="Listen now." font={FontProps.DANCING} materialConfigProp={'subTitle'} />)
  },
  web3NTech: {
    Title: () => ( <MainText3D position={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Web3 & Tech' font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
    Description: () => ( <MainText3D position={[0, 1.0, 0.08]} size={[0.075, 0.1, 0.06]} text="Hashmimic Projects Below." font={FontProps.DANCING} materialConfigProp={'subTitle'} /> ),
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

