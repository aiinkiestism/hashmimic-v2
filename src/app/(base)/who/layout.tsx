import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who? — Hashmimic",
  description: "About Hashmimic — indie hacker and musician.",
  openGraph: {
    images: [
      { url: "/og/who.png", width: 1200, height: 630, alt: "Hashmimic — Who?" },
      { url: "/og/who-sq.png", width: 1200, height: 1200, alt: "Hashmimic — Who?" },
    ],
  },
  twitter: { images: ["/og/who.png"] },
};

export default function WhoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
