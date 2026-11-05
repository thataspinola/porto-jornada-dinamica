'use client'

export type { FormValues } from './types'

import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, resolveValidationAttributes } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Icon, type IconName } from '@/components/UI/Icon'
import { Input } from '@/components/UI/Input'

import type { TextInputElementProps } from './types'

export function TextInputElement({ element }: TextInputElementProps) {
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
          value={field.value}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          onChange={(e) => field.onChange(e.target.value)}
          disabled={config.disabled}
          errorMessage={fieldState.error?.message ?? ''}
          style={{ marginBottom: '3.2rem' }}
          trailingIcon={
            config.trailingIcon ? (
              <Icon icon={config.trailingIcon as IconName} size={20} />
            ) : undefined
          }
          variant={config.variant}
          {...(config.variant === 'big' && { placeholder: config.label })}
          {...(config.variant !== 'big' && { label: config.label })}
        />
      )}
    />
  )
}
