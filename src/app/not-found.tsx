'use client'

import { AppBg, MainText3Ds } from "@/components";

// Root-level 404. NavigationLayer is provided by the root layout, so the
// 3D "Back to home" link can dispatch router navigation without this page
// needing its own provider.
export default function NotFound() {
  return (
    <AppBg>
      <MainText3Ds.notFound.Title />
      <MainText3Ds.notFound.Description />
      <MainText3Ds.notFound.HomeLink />
    </AppBg>
  );
}
