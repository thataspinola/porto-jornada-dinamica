import { notify } from '@porto-stack/ui/utils'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'
import type { FieldValues, UseFormSetValue } from 'react-hook-form'

import { CEP_FIELD_NAMES } from './constants'

type UseCepAddressErrorHandlerParams = {
  isAddressError: boolean
  setValue: UseFormSetValue<FieldValues>
  setZipcode: Dispatch<SetStateAction<string>>
}

export function useCepAddressErrorHandler({
  isAddressError,
  setValue,
  setZipcode
}: UseCepAddressErrorHandlerParams) {
  useEffect(() => {
    if (!isAddressError) return

    notify({
      title: 'Erro ao buscar CEP',
      description:
        'Ocorreu um erro ao buscar o CEP informado. Por favor, tente novamente.',
      type: 'error',
      actionButton: {
        children: 'Tentar novamente'
      }
    })

    setZipcode('')
    setValue(CEP_FIELD_NAMES.addressZipCode, '')
  }, [isAddressError, setValue, setZipcode])
}
