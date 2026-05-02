'use client'

import { useTexture } from "@react-three/drei";
import { Fragment } from "react";
import { Vector3Tuple } from "three";

import { AppBg, IconLink, MainText3Ds } from "@/components";
import { useIsMobile } from "@/lib/responsive";

const ICON = {
  twitter: "/twitter.svg",
  linkedin: "/linkedin.png",
  github: "/github-white.png",
  spotify: "/spotify-icon.png",
  appleMusic: "/apple-music-icon.png",
  youtube: "/youtube-icon.png",
  web3Bio: "/web3-bio.png",
} as const;

Object.values(ICON).forEach((src) => useTexture.preload(src));

export default function Who() {
  const { isMobile } = useIsMobile();

  const geometrySize: Vector3Tuple = [isMobile ? 0.7 / 2 : 0.7, isMobile ? 0.7 / 2 : 0.7, 0.1];
  const meshPosition = (x: number, y: number, z: number): Vector3Tuple => [
    isMobile ? x / 2 : x,
    isMobile ? y / 1.6 + 0.2 : y,
    z,
  ];

  return (
    <AppBg>
      <MainText3Ds.who.Title />
      {MainText3Ds.who.Descriptions.map((Description, i) => (
        <Fragment key={i}>
          <Description />
        </Fragment>
      ))}
      <group position={[0, -1, 0]}>
        <IconLink src={ICON.twitter} position={meshPosition(-1.5, 0.5, 0)} size={geometrySize} url="https://twitter.com/hashmimic" />
        <IconLink src={ICON.linkedin} position={meshPosition(-0.5, 0.5, 0)} size={geometrySize} url="https://www.linkedin.com/in/keishi-s-665542190/" />
        <IconLink src={ICON.github} position={meshPosition(0.5, 0.5, 0)} size={geometrySize} url="https://github.com/aiinkiestism" />
        <IconLink src={ICON.web3Bio} position={meshPosition(1.5, 0.5, 0)} size={geometrySize} url="https://web3.bio/hashmimic.eth" />
        <IconLink src={ICON.spotify} position={meshPosition(-1.5, -0.5, 0)} size={geometrySize} url="https://open.spotify.com/artist/7M2UIn786SiNFD3VK7nxFn" />
        <IconLink src={ICON.appleMusic} position={meshPosition(0, -0.5, 0)} size={geometrySize} url="https://music.apple.com/jp/artist/hashmimic/1699465976" />
        <IconLink src={ICON.youtube} position={meshPosition(1.5, -0.5, 0)} size={geometrySize} url="https://www.youtube.com/@hashmimic" />
      </group>
    </AppBg>
  );
}
