import { AppHeroUIProvider } from "@/providers";
import { NavigationLayer, ThreeConsoleFilter } from "@/components";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import AnimatedCursor from "react-animated-cursor"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script" });

export const metadata: Metadata = {
  metadataBase: new URL("https://hashmimic.com"),
  title: {
    default: "Hashmimic.com",
    template: "%s | Hashmimic",
  },
  description: "Hashmimic is an indie hacker and musician.",
  openGraph: {
    title: "Hashmimic.com",
    description: "Hashmimic is an indie hacker and musician.",
    url: "https://hashmimic.com",
    siteName: "Hashmimic",
    locale: "en_US",
    type: "website",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Hashmimic" },
      { url: "/og/home-sq.png", width: 1200, height: 1200, alt: "Hashmimic" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hashmimic.com",
    description: "Hashmimic is an indie hacker and musician.",
    creator: "@hashmimic",
    images: ["/og/home.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${dancingScript.variable} ${inter.className}`}
        suppressHydrationWarning
      >
        <ThreeConsoleFilter />
        <AppHeroUIProvider>
          {/* NavigationLayer lives at the root so it spans every route —
              including /not-found — without being torn down on cross-route
              transitions. Putting it inside (base)/layout.tsx caused the
              cursor canvas + loading shader to unmount/remount when going
              from /not-found → /, racing the WebGPU init against the old
              renderer's teardown and surfacing as
              "Cannot read properties of null (reading 'addEventListener')". */}
          <NavigationLayer>{children}</NavigationLayer>
        </AppHeroUIProvider>
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
