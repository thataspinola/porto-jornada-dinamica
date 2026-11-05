'use client'

import { useJourneyStore } from '@/store/journeyStore'

import { encryptGtmClientId } from '../encrypt'

export function getAnalyticsUserId(): string | undefined {
  const business = useJourneyStore.getState().business as {
    metadata?: Record<string, string | undefined>
  }
  const value = business.metadata?.analyticsUserId
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

export async function ensureAnalyticsUserId(
  cpf: string | undefined
): Promise<string | undefined> {
  const current = getAnalyticsUserId()
  if (current) return current

  if (!cpf) return undefined

  const analyticsUserId = await encryptGtmClientId(cpf)
  if (!analyticsUserId) return undefined

  const business = useJourneyStore.getState().business as {
    metadata?: Record<string, string | undefined>
  }

  useJourneyStore.getState().mergeBusiness({
    metadata: {
      ...business.metadata,
      analyticsUserId
    }
  })

  return analyticsUserId
}
