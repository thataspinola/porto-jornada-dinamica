'use client'
import { Notifier } from '@porto-stack/ui'
import { QueryClientProvider as TanstackProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'

import { createQueryClient } from '@/lib/queryClient'

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createQueryClient)
  return (
    <>
      <Notifier />
      <TanstackProvider client={queryClient}>{children}</TanstackProvider>
    </>
  )
}
