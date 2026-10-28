'use client'

import { Notifier } from '@porto-stack/ui'
import { QueryClientProvider as TanstackProvider } from '@tanstack/react-query'

import { createQueryClient } from '@/lib/queryClient'
import { useState, type ReactNode } from 'react'

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createQueryClient)
  return (
    <>
      <Notifier />
      <TanstackProvider client={queryClient}>{children}</TanstackProvider>
    </>
  )
}
