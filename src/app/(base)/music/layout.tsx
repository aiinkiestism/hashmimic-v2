import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music — Hashmimic",
  description: "Listen to Hashmimic's music on Spotify, Apple Music, Amazon Music, and YouTube.",
  openGraph: {
    images: [
      { url: "/og/music.png", width: 1200, height: 630, alt: "Hashmimic — Music" },
      { url: "/og/music-sq.png", width: 1200, height: 1200, alt: "Hashmimic — Music" },
    ],
  },
  twitter: { images: ["/og/music.png"] },
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
