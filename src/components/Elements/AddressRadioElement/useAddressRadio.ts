'use client'

import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { useJourneyStore } from '@/store/journeyStore'

import { CEP_FIELD_NAMES } from '@/components/Elements/CepElement/hooks/constants'

import {
  buildInitialAddressFields,
  formatAddressOption,
  getAddressIdentifier,
  resolveAddressSource,
  shouldInitializeAddress
} from './addressRadio'

export function useAddressRadio(name: string, sourcePath: string | string[]) {
  const { control, setValue } = useFormContext()
  const { parameters, selectedAddress, mergeFields } = useJourneyStore(
    useShallow((state) => ({
      parameters: state.parameters,
      selectedAddress: state.fields[name],
      mergeFields: state.mergeFields
    }))
  )
  const source = resolveAddressSource(parameters, sourcePath)

  useEffect(() => {
    if (
      !source ||
      !shouldInitializeAddress(getAddressIdentifier(source), selectedAddress)
    ) {
      return
    }

    const initialFields = buildInitialAddressFields(source, name)

    for (const [field, value] of Object.entries(initialFields)) {
      setValue(field, value, { shouldDirty: false, shouldValidate: false })
    }
    mergeFields(initialFields)
  }, [mergeFields, name, selectedAddress, setValue, source])

  const values = useWatch({
    control,
    name: [
      name,
      CEP_FIELD_NAMES.addressStreetName,
      CEP_FIELD_NAMES.addressNumber,
      CEP_FIELD_NAMES.addressAdditionalInfo,
      CEP_FIELD_NAMES.addressNeighborhood,
      CEP_FIELD_NAMES.addressCity,
      CEP_FIELD_NAMES.addressState
    ]
  })

  return {
    option: formatAddressOption(values)
  }
}
