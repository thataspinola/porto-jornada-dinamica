'use client'
import { useController, useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { buildGtmAttrs } from '@/utils'

import { useClearPrefillOnInput } from '@/hooks/useClearPrefillOnInput'
import { useDataQuality } from '@/hooks/useDataQuality'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Icon, type IconName } from '@/components/UI/Icon'
import { Input } from '@/components/UI/Input'

import type { TextInputElementProps } from './types'

const emailSchema = z.email()

export function EmailInputElement({ element }: TextInputElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const config = element.config
  const { prefetch } = useDataQuality()
  const { field, fieldState } = useController({
    control,
    name: config.name
  })
  const current = String(field.value ?? '')
  const { handleKeyDown, handleFocus, markChanged } = useClearPrefillOnInput({
    enabled: config.clearOnInput,
    value: current,
    onReplace: field.onChange
  })
  const gtmAttrs = buildGtmAttrs({
    kind: 'form-input',
    stepTitle,
    label: config.label
  })

  return (
    <Input
      {...field}
      {...gtmAttrs}
      type="email"
      value={field.value}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onChange={(e) => {
        const next = e.target.value
        markChanged(next)
        field.onChange(next)
      }}
      onBlur={() => {
        field.onBlur()

        const value = String(field.value ?? '')

        if (emailSchema.safeParse(value).success) {
          prefetch('email', value)
        }
      }}
      errorMessage={fieldState.error?.message ?? ''}
      style={{ marginBottom: '3.2rem' }}
      variant={config.variant}
      trailingIcon={
        config.trailingIcon ? (
          <Icon icon={config.trailingIcon as IconName} size={20} />
        ) : undefined
      }
      {...(config.variant === 'big' && { placeholder: config.label })}
      {...(config.variant !== 'big' && { label: config.label })}
    />
  )
}
