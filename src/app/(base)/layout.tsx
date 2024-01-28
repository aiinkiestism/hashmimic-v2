'use client'

import { AppBg } from '@/components'

export default function BaseLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <AppBg>
      <group>
        {children}
      </group>
    </AppBg>
  );
}