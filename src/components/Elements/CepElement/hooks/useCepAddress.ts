import { useEffect, useState } from 'react'
import type {
  Control,
  FieldValues,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'

import { useAddress } from '@/hooks/queries/useAddress'
import { useNavigationLock } from '@/hooks/useNavigationLock'

import { CEP_FIELD_NAMES, ZIPCODE_SEARCH_LENGTH } from './constants'
import { useCepAddressErrorHandler } from './useCepAddressErrorHandler'
import { useCepAddressFormSync } from './useCepAddressFormSync'
import { useCepFormHandlers } from './useCepFormHandlers'

export { CEP_FIELD_NAMES } from './constants'

type UseCepAddressParams = {
  control: Control<FieldValues>
  watch: UseFormWatch<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  getValues: UseFormGetValues<FieldValues>
  clearErrors: UseFormClearErrors<FieldValues>
}

export function useCepAddress({
  watch,
  control,
  setValue,
  getValues,
  clearErrors
}: UseCepAddressParams) {
  const [zipcode, setZipcode] = useState(() =>
    String(getValues(CEP_FIELD_NAMES.addressZipCode) || '')
  )

  const { addressData, isAddressError, isAddressLoading, isAddressSuccess } =
    useAddress({ zipcode })

  const { hasNoNumber, handleZipcodeChange, handleHasNoNumberChange } =
    useCepFormHandlers({ clearErrors, control, setValue })

  useEffect(() => {
    const { unsubscribe } = watch((values, { name }) => {
      const watchedZipcode = String(
        values[CEP_FIELD_NAMES.addressZipCode] ?? ''
      )

      if (
        name === CEP_FIELD_NAMES.addressZipCode &&
        watchedZipcode.length === ZIPCODE_SEARCH_LENGTH
      ) {
        setZipcode(watchedZipcode)
      }
    })

    return () => unsubscribe()
  }, [watch])

  useCepAddressErrorHandler({
    isAddressError,
    setValue,
    setZipcode
  })

  useCepAddressFormSync({ addressData, setValue })
  useNavigationLock({ isLocked: isAddressLoading })

  return {
    addressData,
    hasNoNumber,
    isAddressLoading,
    isAddressSuccess,
    handleZipcodeChange,
    handleHasNoNumberChange
  }
}
