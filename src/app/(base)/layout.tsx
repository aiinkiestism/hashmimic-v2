'use client'

import { AppBg } from '@/components'
import { Suspense } from 'react'

export default function BaseLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <AppBg>
      <Suspense fallback={null}>
        <group>
          {children}
        </group>
      </Suspense>
    </AppBg>
  );
}