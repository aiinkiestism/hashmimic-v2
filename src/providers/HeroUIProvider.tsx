"use client";

import { HeroUIProvider } from "@heroui/react";

export function AppHeroUIProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
