'use client'

import { AppBg, FontProps, HomeText3D } from "@/components";

export default function Who() {
  return (
    <AppBg>
      <HomeText3D position={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Who?' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
      <HomeText3D position={[0, 1.0, 0.08]} size={[0.075, 0.1, 0.06]} text='Hashmimic is an' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
      <HomeText3D position={[0, 0.5, 0.08]} size={[0.075, 0.1, 0.06]} text='indie hacker  &  musician.' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
      {/* links */}
    </AppBg>
  )
}