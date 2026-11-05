'use client'

import { env } from 'next-runtime-env'
import { useCallback, useContext } from 'react'
import { useShallow } from 'zustand/shallow'

import { callService } from '@/services'
import type { ServiceResult } from '@/services/types'
import { SERVICE_ERROR_CODE, ServiceError } from '@/services/types'

import {
  readReferencedCookies,
  redirectTo,
  resolveGoogleAnalyticsMetadata,
  unwrapApiEnvelope
} from '@/utils'
import { ensureAnalyticsUserId } from '@/utils/ensureAnalyticsUserId'
import { recaptcha } from '@/utils/recaptchaGenerator'

import { useJourneyStore } from '@/store/journeyStore'

import { JourneyVariantContext } from './journeyVariantContext'

export type JourneyServiceInput = {
  fields: Record<string, unknown>
  product: string
  action: string
  module: string
  additionalPayload?: Record<string, unknown>
  mockResponse?: {
    data: Record<string, unknown>
    delayMs: number
  }
  recaptchaAction: string
}

type BusinessMetadata = {
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  [key: string]: string | undefined
}

const isDev = env('NEXT_PUBLIC_NODE_ENV') !== 'production'

async function restartJourney() {
  useJourneyStore.getState().reset()
  await useJourneyStore.persist.clearStorage()

  const { origin, pathname, search } = window.location
  const segments = pathname.split('/').filter(Boolean)
  const entry =
    segments.length >= 2 ? `/${segments[0]}/${segments[1]}` : pathname

  redirectTo(`${origin}${entry}${search}`)
}

export function useJourneyService() {
  const variant = useContext(JourneyVariantContext)

  const { business, mergeServices } = useJourneyStore(
    useShallow((state) => ({
      business: state.business as { metadata?: BusinessMetadata },
      mergeServices: state.mergeServices
    }))
  )

  const executeJourneyService = useCallback(
    async <TData = unknown>(
      input: JourneyServiceInput
    ): Promise<ServiceResult<TData>> => {
      if (!!input.mockResponse && isDev) {
        const { mockResponse } = input
        await new Promise((resolve) =>
          setTimeout(resolve, mockResponse.delayMs)
        )

        const currentModule =
          (useJourneyStore.getState().services[input.module] as
            | Record<string, unknown>
            | undefined) ?? {}

        mergeServices({
          [input.module]: {
            ...currentModule,
            [input.action]: mockResponse.data
          }
        })

        return {
          success: true,
          data: mockResponse.data
        } as ServiceResult<TData>
      }

      const {
        fields,
        product,
        action,
        module,
        additionalPayload,
        recaptchaAction
      } = input

      const headers = {
        'porto-product': product,
        'porto-action': action,
        'porto-module': module
      }

      const recaptchaToken = await recaptcha(recaptchaAction)
      const googleAnalytics = await resolveGoogleAnalyticsMetadata()
      const analyticsUserId = await ensureAnalyticsUserId(
        typeof fields.taxvat === 'string' ? fields.taxvat : undefined
      )

      const hasPayload =
        Object.keys(fields).length > 0 ||
        (additionalPayload !== undefined &&
          Object.keys(additionalPayload).length > 0)

      const clientCookies = readReferencedCookies({
        ...fields,
        ...additionalPayload
      })

      const metadata = business.metadata ?? {}

      const result = await callService(
        {
          variant,
          serviceConfig: {
            headers,
            ...(additionalPayload !== undefined && { additionalPayload }),
            ...(Object.keys(clientCookies).length > 0 && { clientCookies })
          },
          fields,
          business: {
            metadata: {
              ...(hasPayload
                ? {
                    ...metadata,
                    sessionId: metadata.sessionId ?? '',
                    ipAddress: metadata.ipAddress ?? '',
                    userAgent: metadata.userAgent ?? '',
                    analyticsUserId: analyticsUserId ?? ''
                  }
                : {}),
              ...googleAnalytics,
              ...(analyticsUserId ? { analyticsUserId } : {})
            }
          }
        },
        recaptchaToken
      )

      if (result.sessionRestarted) {
        await restartJourney()
        return new Promise(() => {})
      }

      if (!result.success) {
        throw new ServiceError(
          result.error ?? SERVICE_ERROR_CODE.INTERNAL_SERVER_ERROR,
          result.statusCode ?? 0
        )
      }

      const unwrappedData = unwrapApiEnvelope(result.data)

      const currentModule =
        (useJourneyStore.getState().services[module] as
          | Record<string, unknown>
          | undefined) ?? {}

      mergeServices({
        [module]: {
          ...currentModule,
          [action]: unwrappedData
        }
      })

      return { ...result, data: unwrappedData } as ServiceResult<TData>
    },
    [business.metadata, mergeServices, variant]
  )

  return { executeJourneyService }
}
