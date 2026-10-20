'use client'

import { useEffect, useState } from 'react'
import { apiService } from '@/services/apiService'
import { useQueryClient } from '@/contexts/QueryClientProvider'

export function useRemoteQuery<T>(url?: string) {
  const client = useQueryClient()

  const [state, setState] = useState<{
    data?: T
    error?: Error
    isLoading: boolean
  }>({ isLoading: !!url })

  useEffect(() => {
    let active = true
    setState({ isLoading: !!url })

    if (url)
      client
        .fetch(url, () => apiService<T>({ url }))
        .then(
          (data) => {
            if (active) setState({ data, isLoading: false })
          },
          (error) => {
            if (active)
              setState({
                error:
                  error instanceof Error
                    ? error
                    : new Error('Falha ao carregar dados'),
                isLoading: false,
              })
          }
        )

    return () => {
      active = false
    }
  }, [url, client])

  return state
}
