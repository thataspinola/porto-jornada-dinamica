'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { sanitize } from '@/utils'

import { useJourneyService } from './useJourneyService'

export type DataQualityType = 'email' | 'phone' | 'socialName'

const ACTION_BY_TYPE: Record<DataQualityType, string> = {
  email: 'validate-email',
  phone: 'validate-phone',
  socialName: 'validate-social-name',
}

function sanitizeForDataQuality(type: DataQualityType, value: string): string {
  switch (type) {
    case 'email':
      return sanitize.email(value)
    case 'phone':
      return sanitize.digits(value)
    case 'socialName':
      return value.trim()
  }
}

export function dataQualityQueryKey(type: DataQualityType, value: string) {
  return ['data-quality', { type, value }] as const
}

export function useDataQuality() {
  const queryClient = useQueryClient()
  const { executeJourneyService } = useJourneyService()

  const getQueryOptions = useCallback(
    (type: DataQualityType, rawValue: string) => {
      const value = sanitizeForDataQuality(type, rawValue)

      return {
        queryKey: dataQualityQueryKey(type, value),
        staleTime: Number.POSITIVE_INFINITY,
        queryFn: async (): Promise<{ isValid: boolean }> => {
          const result = await executeJourneyService<{ isValid: boolean }>({
            fields: { [type]: value },
            product: 'data-quality',
            action: ACTION_BY_TYPE[type],
            module: 'support',
            recaptchaAction: `data_quality_${type}`,
          })

          return { isValid: result.data?.isValid !== false }
        },
      }
    },
    [executeJourneyService]
  )

  const prefetch = useCallback(
    (type: DataQualityType, rawValue: string) => {
      const value = sanitizeForDataQuality(type, rawValue)

      if (!value) {
        return
      }

      void queryClient.prefetchQuery(getQueryOptions(type, rawValue))
    },
    [queryClient, getQueryOptions]
  )

  const validate = useCallback(
    async (type: DataQualityType, rawValue: string): Promise<boolean> => {
      const value = sanitizeForDataQuality(type, rawValue)

      if (!value) {
        return true
      }

      try {
        const { isValid } = await queryClient.fetchQuery(
          getQueryOptions(type, rawValue)
        )

        return isValid
      } catch {
        return true
      }
    },
    [queryClient, getQueryOptions]
  )

  return { prefetch, validate }
}
