'use client'

import { useTexture } from "@react-three/drei";
import { Vector3Tuple } from "three";

import { AppBg, GlyphIcon, IconLink, MainText3Ds } from "@/components";
import { useIsMobile } from "@/lib/responsive";
import { proxyThumbnail, type PortfolioProject } from "@/lib/unchainedx-portfolio";

const STUDIO_ICON = {
  unchainedx: "/unchainedx-icon.png",
  devfriendsdao: "/devfriendsdao-icon.svg",
} as const;

// Glyph used as the default project tile when an upstream entry has no
// thumbnail — Hashmimic's `#` rendered with the page's Dancing Script face.
const DEFAULT_GLYPH = "#";

[STUDIO_ICON.unchainedx, STUDIO_ICON.devfriendsdao].forEach(
  (src) => useTexture.preload(src),
);

interface Web3NTechClientProps {
  projects: PortfolioProject[];
}

// Single horizontal row of icons (studios first, then live projects), like
// the Music page's social-platform row. Wraps to additional rows below only
// when the count overflows what fits horizontally on a typical viewport.
const ICON_ROW_BASE_Y = -0.5;
const ICON_X_STEP = 1.0;
const ICON_ROW_STEP = 1.0;
const MAX_PER_ROW = 5;

export function Web3NTechClient({ projects }: Web3NTechClientProps) {
  const { isMobile } = useIsMobile();

  const geometrySize: Vector3Tuple = [
    isMobile ? 0.7 / 2 : 0.7,
    isMobile ? 0.7 / 2 : 0.7,
    0.1,
  ];

  // Match the responsive scaling Who? uses so titles, descriptions, and the
  // icon grid stay consistent across pages on small screens.
  const meshPosition = (x: number, y: number, z: number): Vector3Tuple => [
    isMobile ? x / 2 : x,
    isMobile ? y / 1.6 : y,
    z,
  ];

  // Item discriminator: a textured tile (real logo / thumbnail) vs a glyph
  // tile (Dancing Script `#` rendered live for thumbnail-less projects).
  type Item =
    | { kind: "texture"; src: string; url: string; key: string }
    | { kind: "glyph"; glyph: string; url: string; key: string };

  const items: Item[] = [
    { kind: "texture", src: STUDIO_ICON.unchainedx, url: "https://unchainedx.io/", key: "studio:unchainedx" },
    { kind: "texture", src: STUDIO_ICON.devfriendsdao, url: "https://devfriendsdao.com/", key: "studio:devfriendsdao" },
    ...projects.map((p): Item =>
      p.thumbnail
        ? { kind: "texture", src: proxyThumbnail(p.thumbnail), url: p.url, key: `project:${p.url}` }
        : { kind: "glyph", glyph: DEFAULT_GLYPH, url: p.url, key: `project:${p.url}` },
    ),
  ];

  return (
    <AppBg>
      <MainText3Ds.web3NTech.Title />
      <MainText3Ds.web3NTech.Description />

      {items.map((item, i) => {
        const row = Math.floor(i / MAX_PER_ROW);
        const col = i % MAX_PER_ROW;
        const inRow = Math.min(items.length - row * MAX_PER_ROW, MAX_PER_ROW);
        const x = (col - (inRow - 1) / 2) * ICON_X_STEP;
        const y = ICON_ROW_BASE_Y - row * ICON_ROW_STEP;
        const position = meshPosition(x, y, 0);

        if (item.kind === "glyph") {
          return (
            <GlyphIcon
              key={item.key}
              glyph={item.glyph}
              position={position}
              size={geometrySize}
              url={item.url}
            />
          );
        }
        return (
          <IconLink
            key={item.key}
            src={item.src}
            position={position}
            size={geometrySize}
            url={item.url}
          />
        );
      })}
    </AppBg>
  );
}
