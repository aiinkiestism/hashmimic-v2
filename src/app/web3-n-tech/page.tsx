'use client'

import { AppBg, FontProps, HomeText3D } from "@/components";

export default function Web3NTech() {
  return (
    <AppBg>
      <HomeText3D position={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Web3 & Tech' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
      <HomeText3D position={[0, 1.0, 0.08]} size={[0.075, 0.1, 0.06]} text="Hashmimic Projects Below." font={FontProps.DANCING} materialConfigProp={'subTitle'} />
      {/* need to brainstorming IA more */}
      {/* project images & links */}
    </AppBg>
  )
}