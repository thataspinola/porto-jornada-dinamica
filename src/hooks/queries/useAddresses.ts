'use client'

import { useQuery } from '@tanstack/react-query'

import { SERVICE_ERROR_CODE, ServiceError } from '@/services/types'

import { formatGtmText, pushEvent } from '@/utils'

import { useJourneyService } from '@/hooks/useJourneyService'

type Logradouros = {
  numeroCepLogradouro: string
  numeroCepComplementoLogradouro: string
  nomeLogradouro: string
  tipoLogradouro: {
    nomeTipoLogradouro: string
  }
  bairro: {
    nomeBairro: string
  }
  localidade: {
    nomeLocalidade: string
    estado: {
      siglaEstado: string
      nomeEstado: string
    }
  }
}

type AddressesAPIResponse = {
  logradouros: Logradouros[]
}

type UseAddressesParams = {
  stateAcronym: string
  locationName: string
  addressName: string
}

export function useAddresses({
  addressName,
  locationName,
  stateAcronym,
}: UseAddressesParams) {
  const { executeJourneyService } = useJourneyService()

  const {
    data: addressesData,
    isLoading: isAddressesLoading,
    isSuccess: isAddressesSuccess,
    error: addressesError,
    isError: isAddressesError,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ['addresses', { stateAcronym, locationName, addressName }],
    queryFn: async () => {
      try {
        const result = await executeJourneyService<AddressesAPIResponse>({
          fields: {
            stateAcronym: stateAcronym,
            locationName: locationName,
            addressName: addressName,
            perPage: 5,
          },
          product: 'postal-guide',
          action: 'address-search',
          module: 'support',
          recaptchaAction: 'address_search',
        })

        const addresses = result.data?.logradouros || []

        pushEvent({
          event: 'search_address',
          evAction: 'buscar-endereco:sucesso',
          evLabel: String(addresses.length),
        })

        return {
          addresses,
        }
      } catch (error) {
        const errorCode =
          error instanceof Error && error.message
            ? error.message
            : SERVICE_ERROR_CODE.INTERNAL_SERVER_ERROR

        const alertCode =
          error instanceof ServiceError && error.statusCode > 0
            ? `${error.statusCode}||${errorCode}`
            : errorCode

        pushEvent({
          event: 'alert',
          evLabel: [addressName, errorCode].map(formatGtmText).join(' | '),
          evAction: 'buscar-endereco:alert',
          alertCode,
          errorService: 'address-search/support',
          alertServiceMessage: errorCode,
          alertType: 'erro',
          alertEvent: 'search_address',
        })

        throw error
      }
    },
    enabled: !!stateAcronym && !!locationName && !!addressName,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data: { addresses: Logradouros[] }) => {
      return {
        addresses:
          data?.addresses.map((Logradouro: Logradouros) => ({
            neighborhood: Logradouro.bairro.nomeBairro,
            state: Logradouro.localidade.estado.nomeEstado,
            stateAcronym: Logradouro.localidade.estado.siglaEstado,
            locality: Logradouro.localidade.nomeLocalidade,
            zipcode: `${Logradouro.numeroCepLogradouro}-${Logradouro.numeroCepComplementoLogradouro}`,
            address: `${Logradouro.tipoLogradouro.nomeTipoLogradouro ?? ''} ${Logradouro.nomeLogradouro} - ${Logradouro.bairro.nomeBairro} - ${Logradouro.localidade.nomeLocalidade} - ${Logradouro.localidade.estado.siglaEstado}`,
          })) || [],
      }
    },
  })

  return {
    addressesData,
    isAddressesLoading,
    isAddressesError,
    isAddressesSuccess,
    addressesError,
    refetchAddresses,
  }
}
