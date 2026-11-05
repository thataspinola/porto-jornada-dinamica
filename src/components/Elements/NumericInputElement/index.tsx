'use client'

import { Controller, useFormContext } from 'react-hook-form'

import {
  buildGtmAttrs,
  onlyNumbers,
  resolveValidationAttributes
} from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI'

import type { NumericInputElementProps } from './types'

export function NumericInputElement({ element }: NumericInputElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const config = element.config
  const { minLength, maxLength, pattern } = resolveValidationAttributes(
    config.validations
  )
  const gtmAttrs = buildGtmAttrs({
    kind: 'form-input',
    stepTitle,
    label: config.label
  })

  return (
    <Controller
      control={control}
      name={config.name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...gtmAttrs}
          type="tel"
          value={field.value}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          onChange={(e) =>
            field.onChange(onlyNumbers(e.target.value).slice(0, maxLength))
          }
          errorMessage={fieldState.error?.message ?? ''}
          style={config.cssProperties}
          variant={config.variant}
          {...(config.variant === 'big' && { placeholder: config.label })}
          {...(config.variant !== 'big' && { label: config.label })}
        />
      )}
    />
  )
}
