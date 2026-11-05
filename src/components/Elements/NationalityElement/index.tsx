'use client'

import { Select } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import type { NationalityElementProps } from './types'

const NATIONALITY_OPTIONS = [
  { value: 'brasileiro_nato', label: 'Brasileiro(a) nato(a)' },
  {
    value: 'brasileiro_naturalizado',
    label: 'Brasileiro(a) naturalizado(a)'
  },
  { value: 'estrangeiro', label: 'Estrangeiro(a)' },
  { value: 'portugues_equiparado', label: 'Português(a) Equiparado(a)' }
]

export function NationalityElement({ element }: NationalityElementProps) {
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
          style={{ marginBottom: '3.2rem' }}>
          {NATIONALITY_OPTIONS.map((option) => (
            <Select.Item value={option.value} key={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Root>
      )}
    />
  )
}
