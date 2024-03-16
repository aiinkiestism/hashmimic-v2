'use client'

import { MainText3Ds } from "@/components";
import { useTexture } from "@react-three/drei";
import { Fragment } from "react";
import TwitterIcon from "/public/twitter.svg"
import LinkedInIcon from "/public/linkedin.png"
import GithubIcon from "/public/github-white.png"
import SpotifyIcon from "/public/spotify-icon.png"
import AppleMusicIcon from "/public/apple-music-icon.png"
import YoutubeIcon from "/public/youtube-icon.png"
import Web3BioIcon from "/public/web3-bio.png"

export default function Who() {
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
        <mesh position={[-1.5, 0.5, 0]} onClick={() => onClick("https://twitter.com/hashmimic")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          {/* @ts-ignore */}
          <meshBasicMaterial attach="material" map={useTexture(TwitterIcon.src)} />
        </mesh>
        <mesh position={[-0.5, 0.5, 0]} onClick={() => onClick("https://www.linkedin.com/in/keishi-s-665542190/")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          {/* @ts-ignore */}
          <meshBasicMaterial attach="material" map={useTexture(LinkedInIcon.src)} />
        </mesh>
        <mesh position={[0.5, 0.5, 0]} onClick={() => onClick("https://github.com/aiinkiestism")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(GithubIcon.src)} />
        </mesh>
        <mesh position={[1.5, 0.5, 0]} onClick={() => onClick("https://web3.bio/hashmimic.eth")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(Web3BioIcon.src)} />
        </mesh>
        <mesh position={[-1.5, -0.5, 0]} onClick={() => onClick("https://open.spotify.com/artist/7M2UIn786SiNFD3VK7nxFn")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(SpotifyIcon.src)} />
        </mesh>
        <mesh position={[0, -0.5, 0]} onClick={() => onClick("https://music.apple.com/jp/artist/hashmimic/1699465976")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(AppleMusicIcon.src)} />
        </mesh>
        <mesh position={[1.5, -0.5, 0]} onClick={() => onClick("https://www.youtube.com/@hashmimic")}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshBasicMaterial attach="material" map={useTexture(YoutubeIcon.src)} />
        </mesh>
      </group>
    </>
  )
}