import { QueryClient } from '@tanstack/react-query'

import { ServiceError } from '@/services/types'

const QUERY_CACHE_LIFETIME_MS = 10 * 60 * 1000
const MAX_RETRIES = 2

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) {
    return false
  }

  if (!(error instanceof ServiceError)) {
    return false
  }

  const { statusCode } = error

  return statusCode === 0 || statusCode >= 500
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
      gcTime: QUERY_CACHE_LIFETIME_MS,
    },
  },
})
