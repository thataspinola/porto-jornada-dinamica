'use client'

import { useQuery } from '@tanstack/react-query'

import { useJourneyService } from '@/hooks/useJourneyService'

type AddressAPIResponse = {
  cep?: string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  estado?: string
}

export function useAddress({
  zipcode,
  enabled
}: {
  enabled?: boolean
  zipcode: string
}) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: addressData,
    isLoading: isAddressLoading,
    isSuccess: isAddressSuccess,
    error: addressError,
    isError: isAddressError,
    refetch: refetchAddress
  } = useQuery({
    queryKey: ['address', { zipcode }],
    queryFn: async () => {
      const result = await executeJourneyService<AddressAPIResponse>({
        fields: {
          zipcode: zipcode.replace(/[^\d]/g, '')
        },
        product: 'postal-guide',
        action: 'zipcode-search',
        module: 'support',
        recaptchaAction: 'zipcode_search'
      })

      return {
        logradouro: result.data?.logradouro ?? '',
        bairro: result.data?.bairro ?? '',
        localidade: result.data?.localidade ?? '',
        estado: result.data?.estado ?? '',
        uf: result.data?.uf ?? '',
        cep: result.data?.cep ?? ''
      }
    },
    enabled: enabled || !!zipcode,
    refetchOnWindowFocus: false
  })

  return {
    addressData,
    refetchAddress,
    isAddressLoading,
    isAddressError,
    isAddressSuccess,
    addressError
  }
}
