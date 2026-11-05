'use client'

import { Select } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import type { MaritalStatusElementProps } from './types'

const MARITAL_STATUS_OPTIONS = [
  { value: 'MARIT_STATUS_SINGLE', label: 'Solteiro(a)' },
  { value: 'MARIT_STATUS_MARRIED', label: 'Casado(a)' },
  { value: 'MARIT_STATUS_STABLE_UNION', label: 'União Estável' },
  { value: 'MARIT_STATUS_DIVORCED', label: 'Divorciado(a)' },
  { value: 'MARIT_STATUS_SEPARATED', label: 'Separado(a)' },
  { value: 'MARIT_STATUS_WIDOWED', label: 'Viúvo(a)' }
]

export function MaritalStatusElement({ element }: MaritalStatusElementProps) {
  const { control } = useFormContext()
  const { name, label } = element.config

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select.Root
          onValueChange={field.onChange}
          label={label}
          errorMessage={fieldState.error?.message ?? ''}
          value={field.value ?? ''}
          isValid={!!field.value && !fieldState.error?.message}
          style={{ marginBottom: '3.2rem' }}>
          {MARITAL_STATUS_OPTIONS.map((option) => (
            <Select.Item value={option.value} key={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Root>
      )}
    />
  )
}
