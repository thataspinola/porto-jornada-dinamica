'use client'

import { useEffect } from 'react'

import { notifyVehicleModelsEmpty } from '../utils/notifyVehicleModelsEmpty'
import { notifyVehicleModelsPriceError } from '../utils/notifyVehicleModelsPriceError'

type UseVehicleModelsPriceErrorHandlerParams = {
  isVehicleModelsPriceError: boolean
  isVehicleModelsPriceEmpty: boolean
  resetOnEmpty: () => void
}

export function useVehicleModelsPriceErrorHandler({
  isVehicleModelsPriceError,
  isVehicleModelsPriceEmpty,
  resetOnEmpty
}: UseVehicleModelsPriceErrorHandlerParams) {
  useEffect(() => {
    if (!isVehicleModelsPriceError) return

    notifyVehicleModelsPriceError()
  }, [isVehicleModelsPriceError])

  useEffect(() => {
    if (!isVehicleModelsPriceEmpty) return

    notifyVehicleModelsEmpty()
    resetOnEmpty()
  }, [isVehicleModelsPriceEmpty, resetOnEmpty])
}
