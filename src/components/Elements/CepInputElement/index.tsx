'use client'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, cepMask, sanitize } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI'

import type { CepInputElementProps } from './types'

export function CepInputElement({ element }: CepInputElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const config = element.config
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
          value={cepMask(field.value ?? '')}
          maxLength={9}
          onChange={(e) =>
            field.onChange(sanitize.digits(e.target.value).slice(0, 8))
          }
          errorMessage={fieldState.error?.message ?? ''}
          style={{ marginBottom: '3.2rem' }}
          variant={config.variant}
          {...(config.variant === 'big' && { placeholder: config.label })}
          {...(config.variant !== 'big' && { label: config.label })}
        />
      )}
    />
  )
}
