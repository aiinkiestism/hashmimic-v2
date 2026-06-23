import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — Hashmimic",
  description: "Hashmimic's project portfolio.",
  openGraph: {
    images: [
      { url: "/og/portfolio.png", width: 1200, height: 630, alt: "Hashmimic — Portfolio" },
      { url: "/og/portfolio-sq.png", width: 1200, height: 1200, alt: "Hashmimic — Portfolio" },
    ],
  },
  twitter: { images: ["/og/portfolio.png"] },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
