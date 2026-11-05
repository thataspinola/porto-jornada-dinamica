import { useEffect } from 'react'

import { notifyAddressError } from '../utils/notifyAddressError'

type UseAddressErrorHandlerProps = {
  hasStatesFailure: boolean
  hasLocalitiesFailure: boolean
  onError: () => void
  onRetry?: () => void
  onLocalitiesError?: () => void
}

export function useAddressErrorHandler({
  onError,
  onRetry,
  onLocalitiesError,
  hasStatesFailure,
  hasLocalitiesFailure
}: UseAddressErrorHandlerProps) {
  useEffect(() => {
    if (hasStatesFailure) {
      onError()
      notifyAddressError({ onRetry })
    }
  }, [hasStatesFailure, onError, onRetry])

  useEffect(() => {
    if (!hasLocalitiesFailure) return

    onLocalitiesError?.()
    onError()
    notifyAddressError()
  }, [hasLocalitiesFailure, onError, onLocalitiesError])
}
