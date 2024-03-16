'use client'

import { MainText3Ds } from "@/components";
import { useTexture } from "@react-three/drei";
import { useWindowSize } from "react-use";
import { Fragment } from "react";
import TwitterIcon from "/public/twitter.svg"
import LinkedInIcon from "/public/linkedin.png"
import GithubIcon from "/public/github-white.png"
import SpotifyIcon from "/public/spotify-icon.png"
import AppleMusicIcon from "/public/apple-music-icon.png"
import YoutubeIcon from "/public/youtube-icon.png"
import Web3BioIcon from "/public/web3-bio.png"
import { Vector3Tuple } from "three";

export default function Who() {
  const { width } = useWindowSize();

  const geometrySize: Vector3Tuple = [width < 1025 ? 0.7 / 2 : 0.7, width < 1025 ? 0.7 / 2 : 0.7, 0.1];
  const meshPosition = (x: number, y: number, z: number): Vector3Tuple => [width < 1025 ? x / 2 : x, width < 1025 ? y / 1.6 + 0.2 : y, z];

  const onClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <MainText3Ds.who.Title />
      {MainText3Ds.who.Descriptions.map((description, i) => (
        <Fragment key={i}>
          {description()}
        </Fragment>
      ))}
      <group position={[0, -1, 0]}>
        <mesh position={meshPosition(-1.5, 0.5, 0)} onClick={() => onClick("https://twitter.com/hashmimic")}>
          <boxGeometry args={geometrySize} />
          {/* @ts-ignore */}
          <meshBasicMaterial attach="material" map={useTexture(TwitterIcon.src)} />
        </mesh>
        <mesh position={meshPosition(-0.5, 0.5, 0)} onClick={() => onClick("https://www.linkedin.com/in/keishi-s-665542190/")}>
          <boxGeometry args={geometrySize} />
          {/* @ts-ignore */}
          <meshBasicMaterial attach="material" map={useTexture(LinkedInIcon.src)} />
        </mesh>
        <mesh position={meshPosition(0.5, 0.5, 0)} onClick={() => onClick("https://github.com/aiinkiestism")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(GithubIcon.src)} />
        </mesh>
        <mesh position={meshPosition(1.5, 0.5, 0)} onClick={() => onClick("https://web3.bio/hashmimic.eth")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(Web3BioIcon.src)} />
        </mesh>
        <mesh position={meshPosition(-1.5, -0.5, 0)} onClick={() => onClick("https://open.spotify.com/artist/7M2UIn786SiNFD3VK7nxFn")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(SpotifyIcon.src)} />
        </mesh>
        <mesh position={meshPosition(0, -0.5, 0)} onClick={() => onClick("https://music.apple.com/jp/artist/hashmimic/1699465976")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(AppleMusicIcon.src)} />
        </mesh>
        <mesh position={meshPosition(1.5, -0.5, 0)} onClick={() => onClick("https://www.youtube.com/@hashmimic")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(YoutubeIcon.src)} />
        </mesh>
      </group>
    </>
  )
}