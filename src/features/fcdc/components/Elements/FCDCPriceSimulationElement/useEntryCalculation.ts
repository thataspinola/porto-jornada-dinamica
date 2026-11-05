import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

type EntryCalculationResponse = {
  resultingEntry: number
  financingValue: number
}

type UseEntryCalculationParams = {
  vehicleValue: number
  entryValue: number
  nonce: number
}

export function useEntryCalculation({
  entryValue,
  vehicleValue,
  nonce
}: UseEntryCalculationParams) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: entryCalculation,
    isLoading: isLoadingEntryCalculation,
    isError: isErrorEntryCalculation,
    refetch: refetchEntryCalculation,
    error: errorEntryCalculation
  } = useQuery({
    queryFn: async () => {
      const result = await executeJourneyService<EntryCalculationResponse>({
        fields: {
          vehicleValue,
          targetEntry: entryValue
        },
        product: 'financing-loans-vehicle',
        action: 'entry-calculation',
        module: 'product-domains',
        recaptchaAction: 'entry_calculation'
      })

      return result.data
    },
    queryKey: ['fcdc-entry-calculation', { vehicleValue, entryValue, nonce }],
    enabled: !!vehicleValue
  })

  return {
    entryCalculation,
    isLoadingEntryCalculation,
    isErrorEntryCalculation,
    refetchEntryCalculation,
    errorEntryCalculation
  }
}
