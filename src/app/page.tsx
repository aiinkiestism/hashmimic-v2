'use client'

import { useRouter } from 'next/navigation'
import { AppBg, FontProps, HomeText3D } from '@/components'

export default function Home() {
  const router = useRouter()

  return (
    <AppBg>
      <HomeText3D position={[-5.15, -0.15, -0.6]} size={[0.1, 0.125, 0.08]} text='©' font={FontProps.HOME_TITLE} materialConfigProp={'title'} />
      <HomeText3D position={[0.65, -0.15, -0.6]} size={[0.28, 0.3, 0.16]} text='Hashmimic' font={FontProps.HOME_TITLE} materialConfigProp={'title'} />
      <HomeText3D position={[0.75, 2.0, 0.08]} size={[0.1, 0.125, 0.08]} text='Who?' font={FontProps.DANCING} materialConfigProp={'subTitle'} onClick={() => router.push('/who')} />
      <HomeText3D position={[-2.15, -1.75, 0.08]} size={[0.1, 0.125, 0.08]} text='Music' font={FontProps.DANCING} materialConfigProp={'subTitle'} onClick={() => router.push('/music')} />
      <HomeText3D position={[3.0, -2.5, 0.08]} size={[0.1, 0.125, 0.08]} text='Web3 & Tech' font={FontProps.DANCING} materialConfigProp={'subTitle'} onClick={() => router.push('/web3-n-tech')} />
    </AppBg>
  );
}
