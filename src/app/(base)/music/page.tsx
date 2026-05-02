'use client'

import { useTexture, Html } from "@react-three/drei";
import { Vector3Tuple } from "three";

import { AppBg, IconLink, MainText3Ds } from "@/components";
import { useIsMobile } from "@/lib/responsive";
import { dispatchCursorHidden } from "@/lib/navigation-context";

const ICON = {
  spotify: "/spotify-icon.png",
  appleMusic: "/apple-music-icon.png",
  amazonMusic: "/amazon-music-icon.png",
  youtube: "/youtube-icon.png",
} as const;

Object.values(ICON).forEach((src) => useTexture.preload(src));

export default function Music() {
  const { isMobile } = useIsMobile();

  const geometrySize: Vector3Tuple = [isMobile ? 0.7 / 2 : 0.7, isMobile ? 0.7 / 2 : 0.7, 0.1];
  const meshPosition = (x: number, y: number, z: number): Vector3Tuple => [
    isMobile ? x / 2 : x,
    isMobile ? y / 1.6 + 0.2 : y,
    z,
  ];

  return (
    <AppBg>
      <MainText3Ds.music.Title />
      <MainText3Ds.music.Description />
      <group position={[0, -0.1, 0]}>
        <IconLink src={ICON.spotify} position={meshPosition(-1.5, 0, 0)} size={geometrySize} url="https://open.spotify.com/artist/7M2UIn786SiNFD3VK7nxFn" />
        <IconLink src={ICON.appleMusic} position={meshPosition(-0.5, 0, 0)} size={geometrySize} url="https://music.apple.com/jp/artist/hashmimic/1699465976" />
        <IconLink src={ICON.amazonMusic} position={meshPosition(0.5, 0, 0)} size={geometrySize} url="https://music.amazon.com/artists/B0CCX8VWC7/hashmimic" />
        <IconLink src={ICON.youtube} position={meshPosition(1.5, 0, 0)} size={geometrySize} url="https://www.youtube.com/@hashmimic" />
      </group>
      <Html position={[0, isMobile ? -1.0 : -1.6, 0]} center>
        <div
          style={{ width: isMobile ? "240px" : "640px", cursor: "auto" }}
          onPointerEnter={() => dispatchCursorHidden(true)}
          onPointerLeave={() => dispatchCursorHidden(false)}
        >
          <iframe
            style={{ borderRadius: "12px", display: "block", margin: "0 auto" }}
            src="https://open.spotify.com/embed/artist/7M2UIn786SiNFD3VK7nxFn?utm_source=generator"
            width={isMobile ? "60%" : "100%"}
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify embed: hashmimic"
          />
        </div>
      </Html>
    </AppBg>
  );
}
