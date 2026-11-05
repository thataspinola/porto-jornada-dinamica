'use client'

import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'

import { useJourneyStore } from '@/store/journeyStore'

type UseManufacturingYearsParams = {
  isZeroKm: unknown
  manufacturingYear: unknown
}

/**
 * Deriva as opções de ano de fabricação e ano do modelo a partir de
 * `parameters.vehicleManufacturingYearMin/Max` do `journeyStore`. Se o
 * prefetch da jornada falhar, o passo não é renderizado, então os
 * parâmetros são sempre esperados aqui.
 */
export function useManufacturingYears({
  isZeroKm,
  manufacturingYear
}: UseManufacturingYearsParams) {
  const { vehicleManufacturingYearMin, vehicleManufacturingYearMax } =
    useJourneyStore(
      useShallow((state) => ({
        vehicleManufacturingYearMin: Number(
          state.parameters.vehicleManufacturingYearMin
        ),
        vehicleManufacturingYearMax: Number(
          state.parameters.vehicleManufacturingYearMax
        )
      }))
    )

  const manufacturingYearsArray = useMemo(() => {
    if (isZeroKm === true) {
      return [vehicleManufacturingYearMax - 1, vehicleManufacturingYearMax]
    }

    if (isZeroKm === false) {
      return Array.from(
        {
          length: vehicleManufacturingYearMax - vehicleManufacturingYearMin + 1
        },
        (_, index) => vehicleManufacturingYearMin + index
      )
    }

    return []
  }, [isZeroKm, vehicleManufacturingYearMin, vehicleManufacturingYearMax])

  const modelYearsArray = useMemo(() => {
    if (!manufacturingYear) {
      return []
    }

    const parsed = Number(manufacturingYear)

    if (!Number.isFinite(parsed)) {
      return []
    }

    return [parsed, parsed + 1]
  }, [manufacturingYear])

  return {
    manufacturingYearsArray,
    modelYearsArray
  }
}
