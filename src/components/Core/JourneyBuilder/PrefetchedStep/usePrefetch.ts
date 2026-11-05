import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'

import { SERVICE_ERROR_CODE, ServiceError } from '@/services/types'

import {
  preparePrefetchPayload,
  processPrefetchResponse,
  resolveTemplates,
  unwrapApiEnvelope
} from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { dispatchAlert } from '@/hooks/serviceErrorHandlers/dispatchAlert'
import {
  buildErrorInterpolationScope,
  extractErrorCode,
  interpolateFullscreenAction,
  resolveErrorAction
} from '@/hooks/serviceErrorHandlers/resolveErrorAction'
import type { FullscreenAction } from '@/hooks/serviceErrorHandlers/types'
import { useJourneyService } from '@/hooks/useJourneyService'
import { useMultipleService } from '@/hooks/useMultipleService'

import type { PrefetchDefinition } from '@/validation/schemas'

const COMPLETE_PROGRESS = 100

type UsePrefetchParams = {
  config: PrefetchDefinition | PrefetchDefinition[]
  product: string
  queryKey: readonly unknown[]
  onFullscreen?: (action: FullscreenAction) => void
}

export function usePrefetch({
  config,
  product,
  queryKey,
  onFullscreen
}: UsePrefetchParams) {
  const { executeJourneyService } = useJourneyService()
  const {
    mergeParameters,
    journeyErrors,
    fields,
    parameters,
    services,
    business
  } = useJourneyStore(
    useShallow((state) => ({
      mergeParameters: state.mergeParameters,
      journeyErrors: state.errors,
      fields: state.fields,
      parameters: state.parameters,
      services: state.services,
      business: state.business
    }))
  )
  const [isPrefetchCompleting, setIsPrefetchCompleting] = useState(false)
  const dispatchedErrorRef = useRef<unknown>(undefined)
  const {
    activeIndex: activeConfigIndex,
    activeIndexRef: activeConfigIndexRef,
    callMultiple
  } = useMultipleService()
  const configs = Array.isArray(config) ? config : [config]

  const {
    data: prefetchData,
    isLoading: isPrefetchLoading,
    isError: isPrefetchError,
    isRefetching: isPrefetchRefetching,
    refetch: refetchPrefetch
  } = useQuery({
    queryKey: ['journey-prefetch', ...queryKey],
    queryFn: async () => {
      setIsPrefetchCompleting(false)
      const mergedData: Record<string, unknown> = {}

      await callMultiple(configs, async (currentConfig) => {
        setIsPrefetchCompleting(false)
        const store = useJourneyStore.getState()
        const context = {
          fields: store.fields,
          parameters: { ...store.parameters, ...mergedData },
          services: store.services,
          business: store.business
        }
        const { payload: resolvedPayload, privateKey } =
          await preparePrefetchPayload(
            currentConfig.action,
            currentConfig.payload
              ? resolveTemplates(currentConfig.payload, context)
              : undefined,
            context
          )

        const result = await executeJourneyService({
          fields: resolvedPayload,
          product,
          action: currentConfig.action ?? '',
          module: currentConfig.module ?? '',
          mockResponse: currentConfig.mockResponse,
          recaptchaAction: 'parameters'
        })

        if (!result.data) {
          throw new ServiceError(SERVICE_ERROR_CODE.INTERNAL_SERVER_ERROR, 500)
        }

        const processedData = await processPrefetchResponse(
          currentConfig.action,
          result.data,
          privateKey
        )
        Object.assign(mergedData, unwrapApiEnvelope(processedData))

        if (currentConfig.loadingScreen?.to === COMPLETE_PROGRESS) {
          setIsPrefetchCompleting(true)
          await new Promise((resolve) =>
            setTimeout(
              resolve,
              currentConfig.loadingScreen?.completionHold ?? 0
            )
          )
        }
      })

      return mergedData
    },
    staleTime: Number.POSITIVE_INFINITY,
    throwOnError: (error) => {
      const currentConfig = configs[activeConfigIndexRef.current]
      const code = extractErrorCode(error)
      const action = resolveErrorAction({
        code,
        nodeErrors: currentConfig.errors,
        journeyErrors
      })

      const isNewError = dispatchedErrorRef.current !== error
      dispatchedErrorRef.current = error

      if (
        isNewError &&
        currentConfig.alertEvent &&
        currentConfig.action &&
        currentConfig.module
      ) {
        dispatchAlert(action, code, error, {
          alertEvent: currentConfig.alertEvent,
          errorService: `${currentConfig.action}/${currentConfig.module}`,
          evAction: currentConfig.alertAction
        })
      }

      if (action.kind === 'fullscreen' && onFullscreen) {
        if (isNewError) {
          const ctx = {
            fields,
            parameters,
            services,
            business,
            error: buildErrorInterpolationScope(error)
          }
          onFullscreen(interpolateFullscreenAction(action, ctx))
        }
        return false
      }

      return true
    }
  })

  useEffect(() => {
    if (!prefetchData || Object.keys(prefetchData).length === 0) {
      return
    }

    mergeParameters(prefetchData as Record<string, unknown>)
  }, [prefetchData, mergeParameters])

  return {
    isPrefetchLoading,
    isPrefetchError,
    isPrefetchRefetching,
    isPrefetchCompleting,
    activeConfigIndex,
    refetchPrefetch
  }
}
