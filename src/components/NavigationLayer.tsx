'use client'

import { NavigationProvider } from "@/lib/navigation-context";
import { CursorOverlay } from "./WebGL/CursorOverlay";
import { NavigationLoadingIndicator } from "./NavigationLoadingIndicator";

// The "THREE.Clock: This module has been deprecated" filter lives in the
// root layout's <head> as a synchronous inline script — it must run before
// any THREE module evaluates, which is earlier than this client component
// can. See src/app/layout.tsx.

export function NavigationLayer({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      {children}
      <CursorOverlay />
      <NavigationLoadingIndicator />
    </NavigationProvider>
  );
}
