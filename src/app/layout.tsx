import { AppNextUIProvider } from "@/providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hashmimic.com",
  description: "Hashmimic is an indie hacker and musician."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppNextUIProvider>{children}</AppNextUIProvider>
      </body>
    </html>
  );
}
