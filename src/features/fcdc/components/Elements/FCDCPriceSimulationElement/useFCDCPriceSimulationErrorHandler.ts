'use client'

import { useEffect } from 'react'

import { useServiceErrorHandler } from '@/hooks/useServiceErrorHandler'

type UseFCDCPriceSimulationErrorHandlerParams = {
  errorEntryCalculation?: unknown
  errorInstallments?: unknown
}

export function useFCDCPriceSimulationErrorHandler({
  errorEntryCalculation,
  errorInstallments
}: UseFCDCPriceSimulationErrorHandlerParams) {
  const { handleServiceError } = useServiceErrorHandler()

  useEffect(() => {
    if (!errorEntryCalculation) return

    handleServiceError(errorEntryCalculation)
  }, [errorEntryCalculation, handleServiceError])

  useEffect(() => {
    if (!errorInstallments) return

    handleServiceError(errorInstallments)
  }, [errorInstallments, handleServiceError])
}
