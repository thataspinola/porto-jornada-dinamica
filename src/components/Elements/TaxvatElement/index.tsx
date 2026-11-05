'use client'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, cpfMask, sanitize } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI'

import type { TaxvatInputElementProps } from './types'

export function TaxvatInputElement({ element }: TaxvatInputElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const { name, label, variant, disabled } = element.config
  const gtmAttrs = buildGtmAttrs({
    kind: 'form-input',
    stepTitle,
    label
  })
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...gtmAttrs}
          type="tel"
          disabled={disabled}
          value={
            String(field.value ?? '').includes('*')
              ? field.value
              : cpfMask(field.value ?? '')
          }
          maxLength={14}
          onChange={(e) =>
            field.onChange(sanitize.digits(e.target.value).slice(0, 11))
          }
          errorMessage={fieldState.error?.message ?? ''}
          style={{ marginBottom: '3.2rem' }}
          variant={variant}
          {...(variant === 'big' && { placeholder: label })}
          {...(variant !== 'big' && { label: label })}
        />
      )}
    />
  )
}
