'use client'

import { AppBg, MainText3Ds, ResponsiveCamera } from '@/components'

export default function Home() {
  return (
    <AppBg>
      <ResponsiveCamera />
      <MainText3Ds.home.Copyright />
      <MainText3Ds.home.BrandName />
      <MainText3Ds.home.WhoLink />
      <MainText3Ds.home.MusicLink />
      <MainText3Ds.home.PortfolioLink />
    </AppBg>
  );
}
