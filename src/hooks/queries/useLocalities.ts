'use client'

import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

type UseLocalitiesParams = {
  enabled?: boolean
  stateAcronym: string
}

export function useLocalities({ stateAcronym, enabled }: UseLocalitiesParams) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: localitiesData,
    isLoading: isLocalitiesLoading,
    isSuccess: isLocalitiesSuccess,
    error: localitiesError,
    isError: isLocalitiesError,
    refetch: refetchLocalities,
  } = useQuery({
    queryKey: ['localities', { stateAcronym }],
    queryFn: async () => {
      const result = await executeJourneyService<string[]>({
        fields: {
          stateAcronym: stateAcronym,
          page: 0,
          perPage: 999,
        },
        product: 'postal-guide',
        action: 'locality-search',
        module: 'support',
        recaptchaAction: 'city_search',
      })

      const localities = result.data

      return {
        localities,
      }
    },
    enabled: enabled ?? !!stateAcronym,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return {
    localitiesData,
    isLocalitiesLoading,
    isLocalitiesError,
    isLocalitiesSuccess,
    localitiesError,
    refetchLocalities,
  }
}
