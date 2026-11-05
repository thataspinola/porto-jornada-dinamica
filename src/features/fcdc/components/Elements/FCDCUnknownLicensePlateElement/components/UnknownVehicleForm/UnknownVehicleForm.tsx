'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { centsToReais, formatPriceFromCents, reaisToCents } from '@/utils'

import { Input } from '@/components/UI'

import { FIELD_NAMES } from '../../constants'

const displayFromReais = (value: unknown): string => {
  if (typeof value !== 'number' || value <= 0) return ''
  return formatPriceFromCents(reaisToCents(value))
}

const parseInputToReais = (input: string): number | undefined => {
  const cents = Number(input.replace(/\D/g, ''))
  return cents ? centsToReais(cents) : undefined
}

export function UnknownVehicleForm() {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={FIELD_NAMES.vehicleValue}
      render={({ field, fieldState }) => (
        <Input
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          type="tel"
          variant="default"
          label="Valor do veículo"
          value={displayFromReais(field.value)}
          errorMessage={fieldState.error?.message}
          onChange={(event) =>
            field.onChange(parseInputToReais(event.target.value))
          }
        />
      )}
    />
  )
}
