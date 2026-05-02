import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who? — Hashmimic",
  description: "About Hashmimic — indie hacker and musician.",
};

export default function WhoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
