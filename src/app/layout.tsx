import { AppNextUIProvider } from "@/providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnimatedCursor from "react-animated-cursor"

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
        {/* <AnimatedCursor
          innerSize={20}
          outerSize={30}
          color={'0, 0, 0'}
          outerScale={4}
          trailingSpeed={12}
          innerStyle={{ zIndex: '99999' }}
          outerStyle={{ zIndex: '99999' }}
          clickables={[
            'a',
            'input[type="text"]',
            'input[type="email"]',
            'input[type="number"]',
            'input[type="submit"]',
            'input[type="image"]',
            'label[for]',
            'select',
            'textarea',
            'button',
          ]}
        /> */}
      </body>
    </html>
  );
}
