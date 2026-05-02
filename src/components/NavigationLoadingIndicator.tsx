'use client'

import { useRef } from "react";
import { useNavigationState } from "@/lib/navigation-context";
import { LoadingShader } from "./WebGL/LoadingShader";
import { useIsMobile } from "@/lib/responsive";

export function NavigationLoadingIndicator() {
  const { isNavigating } = useNavigationState();
  const { isMobile } = useIsMobile();

  // Keep the shader Canvas alive once we mount it the first time.
  // Reason: WebGPU device acquisition + TSL pipeline compilation takes
  // ~100–500ms on first paint. On a fast static-route nav we'd dismiss the
  // indicator before that finished — which is why the veil only "sometimes"
  // appeared. Once initialized the renderer is reused and the veil shows
  // instantly on every later nav. Visibility is then driven by parent opacity.
  // Uses a ref so the latch flips synchronously during render without
  // tripping the React 19 set-state-in-effect rule.
  const everActivatedRef = useRef(false);
  if (isNavigating) everActivatedRef.current = true;
  const shaderActivated = everActivatedRef.current;

  return (
    <div
      suppressHydrationWarning
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 99998,
        opacity: isNavigating ? 1 : 0,
        transition: "opacity 260ms ease",
      }}
    >
      {/* Mobile skips the WebGPU veil entirely (battery + tap targets). */}
      {!isMobile && shaderActivated && <LoadingShader />}

      {/* Big "LOADING" wordmark, dead-center, brand-palette flow.
          Sized so the word fits on a 320px viewport without overflow. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          overflow: "hidden",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            // Match the in-scene Who?/Music/Web3 titles, which use Dancing
            // Script (DancingScript_Regular.json). The 3D versions are
            // bevelled glyphs of the same typeface, so reusing it here keeps
            // navigation visually continuous with the destination page.
            fontFamily: "var(--font-dancing-script), cursive",
            fontSize: "clamp(32px, 7vw, 84px)",
            fontWeight: 500,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            textAlign: "center",
            background:
              "linear-gradient(90deg, #ffe066, #ffb347, #ff7a8a, #ff8ad6, #c89bff, #ff8ad6, #ffb347, #ffe066)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            animation:
              "hashmimic-text-flow 3.2s linear infinite, hashmimic-load-pulse 2.4s ease-in-out infinite",
            filter: "drop-shadow(0 0 0.5em rgba(255, 224, 102, 0.55))",
          }}
        >
          Loading...
        </div>
      </div>

      {/* Top thin gradient sweep stays as a subtle progress signal */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, #ffc300, #ff4500, #C92636, #F21AB0, #9E46C0, #ffc300)",
          backgroundSize: "200% 100%",
          animation: "hashmimic-bar 1.4s linear infinite",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes hashmimic-bar {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes hashmimic-load-pulse {
          0%, 100% { opacity: 0.78; }
          50% { opacity: 1; }
        }
        @keyframes hashmimic-text-flow {
          0% { background-position: 0% 0; }
          100% { background-position: -300% 0; }
        }
      `}</style>
    </div>
  );
}
