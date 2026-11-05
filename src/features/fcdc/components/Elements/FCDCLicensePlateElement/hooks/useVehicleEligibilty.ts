'use client'

import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

export type VehicleEligibilityAPIResponse = {
  brandDescription: string
  modelDescription: string
  fipeCode: string
  modelYear: string
  manufacturingYear: string
  fipeValue: number
  chassis: string
}

export function useVehicleEligibility({ plate }: { plate: string }) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: vehicleEligibilityData,
    isLoading: isVehicleEligibilityLoading,
    isSuccess: isVehicleEligibilitySuccess,
    error: vehicleEligibilityError,
    isError: isVehicleEligibilityError,
    refetch: refetchVehicleEligibility
  } = useQuery({
    queryKey: ['plate', { plate }],
    queryFn: async () => {
      const result = await executeJourneyService<VehicleEligibilityAPIResponse>(
        {
          fields: { plate },
          product: 'financing-loans-vehicle',
          action: 'vehicle',
          module: 'eligibility',
          recaptchaAction: 'vehicle_eligibility'
        }
      )

      return { vehicleModel: result.data as VehicleEligibilityAPIResponse }
    },
    select: (data) => {
      return {
        brandDescription: data.vehicleModel.brandDescription ?? '',
        modelDescription: data.vehicleModel.modelDescription ?? '',
        fipeCode: data.vehicleModel.fipeCode ?? '',
        modelYear: data.vehicleModel.modelYear ?? '',
        manufacturingYear: data.vehicleModel.manufacturingYear ?? '',
        fipeValue: data.vehicleModel.fipeValue ?? 0,
        chassis: data.vehicleModel.chassis ?? ''
      }
    },
    enabled: plate.length === 7,
    refetchOnWindowFocus: false
  })

  return {
    vehicleEligibilityData,
    isVehicleEligibilityLoading,
    isVehicleEligibilitySuccess,
    vehicleEligibilityError,
    isVehicleEligibilityError,
    refetchVehicleEligibility
  }
}
