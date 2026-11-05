'use client'

import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

type VehicleModelsPriceAPIResponse = {
  code: string
  description: string
  fipeCode: string
  value: string
}[]

type UseVehicleModelsPriceParams = {
  brandCode: number
  modelYear: string
  isZeroKm: boolean
  enabled?: boolean
}

export function useVehicleModelsPrice({
  brandCode,
  modelYear,
  isZeroKm,
  enabled = false
}: UseVehicleModelsPriceParams) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: vehicleModelsPriceData,
    isLoading: isVehicleModelsPriceLoading,
    isSuccess: isVehicleModelsPriceSuccess,
    error: vehicleModelsPriceError,
    isError: isVehicleModelsPriceError,
    refetch: refetchVehicleModelsPrice
  } = useQuery({
    queryKey: ['vehicleModelsPrice', brandCode, modelYear, isZeroKm],
    queryFn: async () => {
      const result = await executeJourneyService<VehicleModelsPriceAPIResponse>(
        {
          fields: {
            brandCode,
            modelYear,
            isZeroKm
          },
          product: 'financing-loans-vehicle',
          action: 'models-price',
          module: 'product-domains',
          recaptchaAction: 'vehicle_models_price'
        }
      )

      const models = result.data || []

      return {
        models
      }
    },
    enabled: enabled || (!!brandCode && !!modelYear && isZeroKm !== undefined)
  })

  return {
    vehicleModelsPriceData,
    isVehicleModelsPriceLoading,
    isVehicleModelsPriceSuccess,
    vehicleModelsPriceError,
    isVehicleModelsPriceError,
    refetchVehicleModelsPrice
  }
}
