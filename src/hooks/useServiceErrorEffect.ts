'use client'

import { useEffect } from 'react'

import { useServiceErrorHandler } from './useServiceErrorHandler'

export function useServiceErrorEffect(error: unknown | null | undefined) {
  const { handleServiceError } = useServiceErrorHandler()

  useEffect(() => {
    if (!error) return
    handleServiceError(error)
  }, [error, handleServiceError])
}
