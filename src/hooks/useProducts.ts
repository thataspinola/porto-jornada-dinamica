'use client'
import { useRemoteQuery } from './queries/useRemoteQuery'
import type { JourneyServiceInput } from './useJourneyService'
export function useProducts(input?: JourneyServiceInput) {
  return useRemoteQuery(input)
}
