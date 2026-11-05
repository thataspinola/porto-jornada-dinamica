import type {
  Control,
  FieldValues,
  UseFormClearErrors,
  UseFormSetValue
} from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import { sanitize } from '@/utils'

import { CEP_FIELD_NAMES } from './constants'

type UseCepFormHandlersParams = {
  clearErrors: UseFormClearErrors<FieldValues>
  control: Control<FieldValues>
  setValue: UseFormSetValue<FieldValues>
}

export function useCepFormHandlers({
  clearErrors,
  control,
  setValue
}: UseCepFormHandlersParams) {
  const hasNoNumber = Boolean(
    useWatch({
      control,
      defaultValue: false,
      name: CEP_FIELD_NAMES.hasNoNumber
    })
  )

  function handleZipcodeChange(
    value: string,
    onChange: (value: string) => void
  ) {
    onChange(sanitize.digits(value).slice(0, 8))
  }

  function handleHasNoNumberChange(checked: boolean | 'indeterminate') {
    const isChecked = checked === true

    setValue(CEP_FIELD_NAMES.hasNoNumber, isChecked)
    setValue(CEP_FIELD_NAMES.addressNumber, '')
    clearErrors(
      isChecked
        ? CEP_FIELD_NAMES.addressNumber
        : CEP_FIELD_NAMES.addressAdditionalInfo
    )
  }

  return {
    hasNoNumber,
    handleZipcodeChange,
    handleHasNoNumberChange
  }
}
