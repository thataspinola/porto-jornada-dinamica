'use client'

import { useEffect } from 'react'

import { ipService } from '@/services/ipService'

import { useJourneyStore } from '@/store/journeyStore'

import { getMarketingParams } from '../getMarketingParams'
import { resolveGoogleAnalyticsMetadata } from '../parseGoogleClientId/index'

export const Metada = ({ organizationId }: { organizationId: string }) => {
  const mergeBusiness = useJourneyStore((state) => state.mergeBusiness)

  async function handleGetMetadata() {
    const userAddressIP = await ipService()
    const marketingParams = getMarketingParams(window.location.search)
    const googleAnalytics = await resolveGoogleAnalyticsMetadata()

    mergeBusiness({
      metadata: {
        ...useJourneyStore.getState().business.metadata,
        sessionId: organizationId,
        ipAddress: userAddressIP,
        userAgent: window.navigator.userAgent,
        ...marketingParams,
        ...googleAnalytics,
      },
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    handleGetMetadata()
  }, [])

  return null
}
