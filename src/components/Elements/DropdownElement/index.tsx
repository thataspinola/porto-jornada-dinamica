'use client'

import { Select } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs } from '@/utils'

import { useSelectOptions } from '@/hooks/queries/useSelectOptions'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'

import type { SelectElementProps } from './types'

export function DropdownElement({ element }: SelectElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const { name, options, optionsSource, label } = element.config
  const { options: remoteOptions, isOptionsLoading } =
    useSelectOptions(optionsSource)
  const items = optionsSource ? remoteOptions : options
  const gtmAttrs = buildGtmAttrs({
    kind: 'click-component',
    stepTitle,
    componentName: 'select',
    label
  })

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select.Root
          {...gtmAttrs}
          onValueChange={field.onChange}
          label={label}
          errorMessage={fieldState.error?.message ?? ''}
          value={field.value ?? ''}
          isValid={!!field.value && !fieldState.error?.message}
          isLoading={isOptionsLoading}
          disabled={isOptionsLoading}
          style={{ marginBottom: '3.2rem' }}>
          {items?.map((option) => (
            <Select.Item value={option.value} key={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Root>
      )}
    />
  )
}
