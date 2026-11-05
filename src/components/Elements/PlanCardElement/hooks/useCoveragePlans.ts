'use client'

import { useMemo } from 'react'

import { getByPath } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { adaptCoveragePlans, parseCoverageProducts } from './coveragePlans'

export function useCoveragePlans(sourcePath: string) {
  const rawProducts = useJourneyStore((state) =>
    getByPath(state.services, sourcePath)
  )

  return useMemo(
    () => adaptCoveragePlans(parseCoverageProducts(rawProducts)),
    [rawProducts]
  )
}
