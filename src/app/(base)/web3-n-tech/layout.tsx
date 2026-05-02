import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web3 & Tech — Hashmimic",
  description: "Hashmimic's web3 and tech projects.",
};

export default function Web3NTechLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
