'use client'

import { useEffect } from 'react'

import { notifyVehicleBrandsError } from '../utils/notifyVehicleBrandsError'

type UseVehicleBrandsErrorHandlerParams = {
  isVehicleBrandsError: boolean
}

export function useVehicleBrandsErrorHandler({
  isVehicleBrandsError
}: UseVehicleBrandsErrorHandlerParams) {
  useEffect(() => {
    if (!isVehicleBrandsError) return

    notifyVehicleBrandsError()
  }, [isVehicleBrandsError])
}
