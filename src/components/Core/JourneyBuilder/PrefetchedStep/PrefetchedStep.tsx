'use client'

import { type ReactNode, useState } from 'react'

import type { FullscreenAction } from '@/hooks/serviceErrorHandlers/types'

import { LoadingScreen } from '@/components/UI'

import type { PrefetchDefinition } from '@/validation/schemas'

import { FullscreenErrorView } from '../FullscreenErrorView'
import { StepError } from '../StepError'
import { StepSkeleton } from '../StepSkeleton'
import { usePrefetch } from './usePrefetch'

interface PrefetchedStepProps {
  config: PrefetchDefinition | PrefetchDefinition[]
  product: string
  queryKey: readonly unknown[]
  fieldsCount: number
  children: ReactNode
}

export function PrefetchedStep({
  config,
  product,
  queryKey,
  fieldsCount,
  children
}: PrefetchedStepProps) {
  const [fullscreenError, setFullscreenError] =
    useState<FullscreenAction | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const {
    isPrefetchLoading,
    isPrefetchError,
    refetchPrefetch,
    isPrefetchRefetching,
    isPrefetchCompleting,
    activeConfigIndex
  } = usePrefetch({
    config,
    product,
    queryKey,
    onFullscreen: setFullscreenError
  })

  if (isPrefetchLoading) {
    const currentConfig = Array.isArray(config)
      ? config[activeConfigIndex]
      : config
    return currentConfig.loadingScreen ? (
      <LoadingScreen
        config={currentConfig.loadingScreen}
        complete={isPrefetchCompleting}
      />
    ) : (
      <StepSkeleton fieldsCount={fieldsCount} />
    )
  }

  if (fullscreenError) {
    return (
      <FullscreenErrorView
        error={fullscreenError}
        retryCount={retryCount}
        onRetry={() => {
          setRetryCount((c) => c + 1)
          setFullscreenError(null)
          refetchPrefetch()
        }}
      />
    )
  }

  if (isPrefetchError) {
    return (
      <StepError
        onRetry={() => refetchPrefetch()}
        isRetrying={isPrefetchRefetching}
      />
    )
  }

  return children
}
