'use client'

import { useTexture, Html } from "@react-three/drei";
import { MainText3Ds } from "@/components";
import SpotifyIcon from "/public/spotify-icon.png"
import AppleMusicIcon from "/public/apple-music-icon.png"
import AmazonMusicIcon from "/public/amazon-music-icon.png"
import YoutubeIcon from "/public/youtube-icon.png"
import { useRef } from "react";

export default function Music() {
  const iframeRef = useRef();
  const onClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <MainText3Ds.music.Title />
      <MainText3Ds.music.Description />
      <group position={[0, 0.2, 0]}>
        <mesh position={[-1.5, 0, 0]} onClick={() => onClick("https://open.spotify.com/artist/7M2UIn786SiNFD3VK7nxFn")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(SpotifyIcon.src)} />
        </mesh>
        <mesh position={[-0.5, 0, 0]} onClick={() => onClick("https://music.apple.com/jp/artist/hashmimic/1699465976")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(AppleMusicIcon.src)} />
        </mesh>
        <mesh position={[0.5, 0, 0]} onClick={() => onClick("https://music.amazon.com/artists/B0CCX8VWC7/hashmimic")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(AmazonMusicIcon.src)} />
        </mesh>
        <mesh position={[1.5, 0, 0]} onClick={() => onClick("https://www.youtube.com/@hashmimic")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(YoutubeIcon.src)} />
        </mesh>
      </group>
      <Html position={[0, -1.2, 0]} center>
        <p style={{ color: 'transparent' }}>aldf;alkjdsf;alkjsdf;ljsdf;lajk;ldjkf;ldskjf;ala;ldkfja;ldjsfkalkajsf;dlakjd;flkaj;sld</p>
        <iframe style={{ borderRadius: "12px", textAlign: 'center' }} src="https://open.spotify.com/embed/artist/7M2UIn786SiNFD3VK7nxFn?utm_source=generator" width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
      </Html>
    </>
  )
}