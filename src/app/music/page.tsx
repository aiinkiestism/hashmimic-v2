'use client'

import { AppBg, FontProps, HomeText3D } from "@/components";

export default function Music() {
  return (
    <AppBg>
      <HomeText3D position={[0, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Music' font={FontProps.DANCING} materialConfigProp={'subTitle'} />
      {/* streaming app links */}
      {/* some music links with artwork and links in spotify & apple music & amazon music */}
    </AppBg>
  )
}