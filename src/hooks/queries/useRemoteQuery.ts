'use client'
import { useQuery } from '@tanstack/react-query'
import {
  useJourneyService,
  type JourneyServiceInput,
} from '@/hooks/useJourneyService'
export function useRemoteQuery<T>(input?: JourneyServiceInput) {
  const { executeJourneyService } = useJourneyService()
  return useQuery({
    queryKey: ['journey-service', input],
    enabled: !!input,
    queryFn: async () => {
      if (!input) throw new Error('Serviço não configurado')
      const result = await executeJourneyService<T>(input)
      return result.data
    },
  })
}
