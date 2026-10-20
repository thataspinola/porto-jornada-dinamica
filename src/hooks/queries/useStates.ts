'use client'

import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

type Estado = {
  nomeEstado: string
  siglaEstado: string
}

export type StateAPIResponse = {
  estados: Estado[]
}

type UseStatesParams = {
  enabled?: boolean
}

export function useStates({ enabled = true }: UseStatesParams = {}) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: statesData,
    isLoading: isStatesLoading,
    isSuccess: isStatesSuccess,
    error: statesError,
    isError: isStatesError,
    refetch: refetchStates,
  } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const result = await executeJourneyService<StateAPIResponse>({
        fields: {},
        product: 'postal-guide',
        action: 'state-search',
        module: 'support',
        recaptchaAction: 'state_search',
      })

      const states = result.data?.estados || []

      return {
        states,
      }
    },
    enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return {
    statesData,
    isStatesLoading,
    isStatesError,
    isStatesSuccess,
    statesError,
    refetchStates,
  }
}
