'use client'

import { useEffect, useRef } from 'react'

import { useServiceErrorHandler } from '@/hooks/useServiceErrorHandler'

type UseREFFSimulationErrorHandlerParams = {
  errorInstallments?: unknown
}

export function useREFFSimulationErrorHandler({
  errorInstallments
}: UseREFFSimulationErrorHandlerParams) {
  const { handleServiceError } = useServiceErrorHandler()
  const notifiedError = useRef<unknown>(null)

  useEffect(() => {
    if (!errorInstallments) {
      notifiedError.current = null
      return
    }

    if (notifiedError.current === errorInstallments) return

    notifiedError.current = errorInstallments
    handleServiceError(errorInstallments)
  }, [errorInstallments, handleServiceError])
}
