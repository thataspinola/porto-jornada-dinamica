import type { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'
import type { UseFormResetField, UseFormSetValue } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import { sanitize } from '@/utils'

import type { useAddresses } from '@/hooks/queries/useAddresses'

import { CEP_FIELD_NAMES } from '../../../hooks/constants'
import type { FormData } from './useAddressForm'
import type { AddressSearch } from './useAddressSearch'

type AddressesData = ReturnType<typeof useAddresses>['addressesData']

type UseAddressSearchControllerProps = {
  resetField: UseFormResetField<FormData>
  setAddressFormValue: UseFormSetValue<FormData>
  setAddressSearch: Dispatch<SetStateAction<AddressSearch | null>>
  clearAddressSearch: () => void
  addressesData: AddressesData
  isAddressesLoading: boolean
  zipcode?: string
  onCloseModal: () => void
}

export function useAddressSearchController({
  zipcode,
  resetField,
  onCloseModal,
  addressesData,
  setAddressSearch,
  clearAddressSearch,
  isAddressesLoading,
  setAddressFormValue
}: UseAddressSearchControllerProps) {
  const { setValue: setParentFormValue } = useFormContext()

  function clearSelectedZipcode() {
    setAddressFormValue('zipcode', '')
    setAddressFormValue('addressOptionValue', '')
  }

  useEffect(() => {
    if (!isAddressesLoading) return

    setAddressFormValue('zipcode', '')
    setAddressFormValue('addressOptionValue', '')
  }, [isAddressesLoading, setAddressFormValue])

  function handleCityChange() {
    clearAddressSearch()
    clearSelectedZipcode()
  }

  function handleStateChange() {
    resetField('city')
    handleCityChange()
  }

  function handleLocalitiesError() {
    setAddressFormValue('state', '')
    handleStateChange()
  }

  function handleFormSubmit(data: FormData) {
    setAddressSearch({
      state: data.state,
      city: data.city,
      address: data.address
    })
  }

  function handleConfirmZipcode() {
    setParentFormValue(
      CEP_FIELD_NAMES.addressZipCode,
      sanitize.digits(zipcode ?? '')
    )
    onCloseModal()
  }

  function handleAddressOptionChange(addressIndex: string) {
    const zipcode = addressesData?.addresses[Number(addressIndex)]?.zipcode

    if (!zipcode) return

    setAddressFormValue('addressOptionValue', addressIndex)
    setAddressFormValue('zipcode', zipcode)
  }

  return {
    handleCityChange,
    handleStateChange,
    handleLocalitiesError,
    handleFormSubmit,
    handleConfirmZipcode,
    handleAddressOptionChange
  }
}
