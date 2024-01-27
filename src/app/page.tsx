'use client'

import { AppBg, MainText3Ds } from '@/components'

export default function Home() {

  return (
    <AppBg>
      <MainText3Ds.home.Copyright />
      <MainText3Ds.home.BrandName />
      <MainText3Ds.home.WhoLink />
      <MainText3Ds.home.MusicLink />
      <MainText3Ds.home.Web3NTechLink />
    </AppBg>
  );
}
