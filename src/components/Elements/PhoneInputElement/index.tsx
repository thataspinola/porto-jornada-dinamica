'use client'

import { useController, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, phoneMask, sanitize } from '@/utils'

import { useClearPrefillOnInput } from '@/hooks/useClearPrefillOnInput'
import { useDataQuality } from '@/hooks/useDataQuality'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Icon, type IconName } from '@/components/UI/Icon'
import { Input } from '@/components/UI/Input'

import type { PhoneInputElementProps } from './types'

export function PhoneInputElement({ element }: PhoneInputElementProps) {
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
    onReplace: (next) => field.onChange(sanitize.digits(next).slice(0, 11))
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
      type="tel"
      value={current.includes('*') ? current : phoneMask(current)}
      maxLength={15}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onChange={(e) => {
        const next = e.target.value
        markChanged(next)

        const digits = sanitize.digits(next).slice(0, 11)

        field.onChange(digits)

        if (digits.length === 11) {
          prefetch('phone', digits)
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
