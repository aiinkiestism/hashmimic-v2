import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — Hashmimic",
  description: "Hashmimic's project portfolio.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
