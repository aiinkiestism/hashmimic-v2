'use client'

import { NavigationProvider } from "@/lib/navigation-context";
import { CursorOverlay } from "./WebGL/CursorOverlay";
import { NavigationLoadingIndicator } from "./NavigationLoadingIndicator";

// The "THREE.Clock: This module has been deprecated" filter lives in
// <ThreeConsoleFilter/> (mounted at the root layout), which routes three's own
// logs through its setConsoleFunction hook. See src/components/ThreeConsoleFilter.tsx.

export function NavigationLayer({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      {children}
      <CursorOverlay />
      <NavigationLoadingIndicator />
    </NavigationProvider>
  );
}
