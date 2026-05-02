import { AppHeroUIProvider } from "@/providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import AnimatedCursor from "react-animated-cursor"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script" });

// Inline filter for the upstream "THREE.Clock: This module has been deprecated"
// log emitted by three@0.184 inside the Clock constructor (each <Canvas> in
// @react-three/fiber 9 instantiates a Clock for `state.clock`). It needs to
// run BEFORE any THREE module is evaluated, which means before any client
// component module loads — hence as a synchronous head script rather than
// from a "use client" file. Covers warn/log/info/error so the dev terminal
// "[browser]" forwarder doesn't surface it via a different channel.
const SUPPRESS_THREE_CLOCK_WARN = `
(function(){
  if (window.__hashmimicWarnFilter) return;
  window.__hashmimicWarnFilter = true;
  var match = "THREE.Clock: This module has been deprecated";
  ["warn","log","info","error"].forEach(function(m){
    var orig = console[m].bind(console);
    console[m] = function(){
      var first = arguments[0];
      if (typeof first === "string" && first.indexOf(match) !== -1) return;
      orig.apply(null, arguments);
    };
  });
})();
`;

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Hashmimic.com",
    description: "Hashmimic is an indie hacker and musician.",
    creator: "@hashmimic",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: SUPPRESS_THREE_CLOCK_WARN }} />
      </head>
      <body
        className={`${inter.variable} ${dancingScript.variable} ${inter.className}`}
        suppressHydrationWarning
      >
        <AppHeroUIProvider>{children}</AppHeroUIProvider>
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
