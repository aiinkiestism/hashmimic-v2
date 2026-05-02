'use client'

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";

const NAV_EVENT = "hashmimic:navigate";
const CURSOR_EVENT = "hashmimic:cursor-hidden";
// Minimum visible duration so the indicator doesn't blink-and-disappear when
// the destination route is statically prerendered (resolves in <50ms).
const NAV_MIN_DISPLAY_MS = 700;
// Safety: forcibly dismiss after this even if pathname never changes (same-page nav).
const NAV_MAX_DISPLAY_MS = 4000;

interface NavigationState {
  isNavigating: boolean;
  cursorHidden: boolean;
}

const NavigationContext = createContext<NavigationState>({
  isNavigating: false,
  cursorHidden: false,
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navStartRef = useRef<number>(0);
  const initialPathRef = useRef(pathname);

  // Listen for navigation events fired from inside the r3f canvas.
  // We use window events instead of context because context does not always
  // propagate into r3f's separate reconciler tree.
  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent<{ path: Route<string> }>).detail.path;
      navStartRef.current = Date.now();
      setIsNavigating(true);
      router.push(path);
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
      // Safety net: if pathname never changes (same page nav), still dismiss.
      dismissTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, NAV_MAX_DISPLAY_MS);
    };
    window.addEventListener(NAV_EVENT, handler);
    return () => window.removeEventListener(NAV_EVENT, handler);
  }, [router]);

  // Dismiss the loading state once the pathname actually changes — but
  // not before NAV_MIN_DISPLAY_MS, so the indicator stays visible long enough
  // to be perceived even on instant static-route transitions.
  useEffect(() => {
    if (pathname === initialPathRef.current) return;
    initialPathRef.current = pathname;
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    const elapsed = Date.now() - navStartRef.current;
    const remaining = Math.max(0, NAV_MIN_DISPLAY_MS - elapsed);
    dismissTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, remaining);
  }, [pathname]);

  // Cursor hide/show events from DOM regions (e.g. Spotify iframe wrapper).
  useEffect(() => {
    const handler = (e: Event) => {
      const hidden = (e as CustomEvent<{ hidden: boolean }>).detail.hidden;
      setCursorHidden(hidden);
    };
    window.addEventListener(CURSOR_EVENT, handler);
    return () => window.removeEventListener(CURSOR_EVENT, handler);
  }, []);

  return (
    <NavigationContext.Provider value={{ isNavigating, cursorHidden }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationState() {
  return useContext(NavigationContext);
}

export function dispatchNavigate(path: Route<string>) {
  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: { path } }));
}

export function dispatchCursorHidden(hidden: boolean) {
  window.dispatchEvent(new CustomEvent(CURSOR_EVENT, { detail: { hidden } }));
}
