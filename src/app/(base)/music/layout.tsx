import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music — Hashmimic",
  description: "Listen to Hashmimic's music on Spotify, Apple Music, Amazon Music, and YouTube.",
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
