'use client'

import { useTexture, Html } from "@react-three/drei";
import { useWindowSize } from "react-use";
import { MainText3Ds } from "@/components";
import SpotifyIcon from "/public/spotify-icon.png"
import AppleMusicIcon from "/public/apple-music-icon.png"
import AmazonMusicIcon from "/public/amazon-music-icon.png"
import YoutubeIcon from "/public/youtube-icon.png"
import { Vector3Tuple } from "three";

export default function Music() {
  const { width } = useWindowSize();

  const geometrySize: Vector3Tuple = [width < 1025 ? 0.7 / 2 : 0.7, width < 1025 ? 0.7 / 2 : 0.7, 0.1];
  const meshPosition = (x: number, y: number, z: number): Vector3Tuple => [width < 1025 ? x / 2 : x, width < 1025 ? y / 1.6 + 0.2 : y, z];

  const onClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <MainText3Ds.music.Title />
      <MainText3Ds.music.Description />
      <group position={[0, -0.1, 0]}>
        <mesh position={meshPosition(-1.5, 0, 0)} onClick={() => onClick("https://open.spotify.com/artist/7M2UIn786SiNFD3VK7nxFn")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(SpotifyIcon.src)} />
        </mesh>
        <mesh position={meshPosition(-0.5, 0, 0)} onClick={() => onClick("https://music.apple.com/jp/artist/hashmimic/1699465976")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(AppleMusicIcon.src)} />
        </mesh>
        <mesh position={meshPosition(0.5, 0, 0)} onClick={() => onClick("https://music.amazon.com/artists/B0CCX8VWC7/hashmimic")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(AmazonMusicIcon.src)} />
        </mesh>
        <mesh position={meshPosition(1.5, 0, 0)} onClick={() => onClick("https://www.youtube.com/@hashmimic")}>
          <boxGeometry args={geometrySize} />
          <meshBasicMaterial attach="material" map={useTexture(YoutubeIcon.src)} />
        </mesh>
      </group>
      <Html position={[0, width < 1025 ? -1.0 : -1.6, 0]} center>
        <p style={{ color: 'transparent' }}>aldf;alkjdsf;alkjsdf;ljsdf;lajk;ldjkf;ldskjf;ala;ldkfja;ldjsfkalkajsf;dlakjd;flkaj;sld</p>
        <iframe style={{ borderRadius: "12px", textAlign: 'center', margin: '0 auto' }} src="https://open.spotify.com/embed/artist/7M2UIn786SiNFD3VK7nxFn?utm_source=generator" width={width < 1025 ? "60%" : "100%"} height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
      </Html>
    </>
  )
}