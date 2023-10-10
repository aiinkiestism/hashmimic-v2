'use client'

import {NextUIProvider} from '@nextui-org/react'

export function AppNextUIProvider({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}