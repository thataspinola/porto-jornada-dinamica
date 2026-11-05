'use client'
import { Notifier } from '@porto-stack/ui'
import { QueryClientProvider as TanstackProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'

export const QueryClientProvider = ({ children }) => {
  return (
    <>
      <Notifier />
      <TanstackProvider client={queryClient}>{children}</TanstackProvider>
    </>
  )
}
