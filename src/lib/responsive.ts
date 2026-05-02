import { useSyncExternalStore } from "react";
import { useWindowSize } from "react-use";

export const MOBILE_BREAKPOINT = 1025;

export function useIsMobile() {
  const { width } = useWindowSize();
  return { width, isMobile: width < MOBILE_BREAKPOINT };
}

// Returns false on the server / first render, true after hydration.
// Lets us gate browser-only output (Canvas, etc.) without tripping the
// React 19 "set-state-in-effect" rule and without causing SSR/hydration
// mismatches.
const noopSubscribe = () => () => {};
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
