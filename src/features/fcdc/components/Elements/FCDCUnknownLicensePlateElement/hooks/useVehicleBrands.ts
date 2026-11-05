'use client'

import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

type VehicleBrandsAPIResponse = {
  code: string
  description: string
}[]

export function useVehicleBrands() {
  const { executeJourneyService } = useJourneyService()

  const {
    data: vehicleBrandsData,
    isLoading: isVehicleBrandsLoading,
    isSuccess: isVehicleBrandsSuccess,
    error: vehicleBrandsError,
    isError: isVehicleBrandsError,
    refetch: refetchVehicleBrands
  } = useQuery({
    queryKey: ['vehicleBrands'],
    queryFn: async () => {
      const result = await executeJourneyService<VehicleBrandsAPIResponse>({
        fields: {},
        product: 'financing-loans-vehicle',
        action: 'brands',
        module: 'product-domains',
        recaptchaAction: 'vehicle_brands'
      })

      if (!result.data?.length) {
        throw new Error('Erro ao buscar marcas')
      }

      const brands = result.data

      return {
        brands
      }
    },
    refetchOnWindowFocus: false
  })

  return {
    vehicleBrandsData,
    isVehicleBrandsLoading,
    isVehicleBrandsSuccess,
    vehicleBrandsError,
    isVehicleBrandsError,
    refetchVehicleBrands
  }
}
