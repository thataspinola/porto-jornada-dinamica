import { useEffect } from 'react'
import type { FieldValues, UseFormSetValue } from 'react-hook-form'

import { CEP_FIELD_NAMES } from './constants'

type AddressData = {
  bairro?: string
  localidade?: string
  logradouro?: string
  uf?: string
}

type UseCepAddressFormSyncParams = {
  addressData?: AddressData
  setValue: UseFormSetValue<FieldValues>
}

export function useCepAddressFormSync({
  addressData,
  setValue
}: UseCepAddressFormSyncParams) {
  useEffect(() => {
    if (!addressData) return

    setValue(CEP_FIELD_NAMES.addressStreetName, addressData.logradouro ?? '')
    setValue(CEP_FIELD_NAMES.addressNeighborhood, addressData.bairro ?? '')
    setValue(CEP_FIELD_NAMES.addressCity, addressData.localidade ?? '')
    setValue(CEP_FIELD_NAMES.addressState, addressData.uf ?? '')
  }, [addressData, setValue])
}
