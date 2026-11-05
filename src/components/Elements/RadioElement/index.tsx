'use client'

import { Radio } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'

import type { RadioElementProps } from './types'

export function RadioElement({ element }: RadioElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const { name, options, variant, backgroundColor } = element.config
  const gtmAttrs = buildGtmAttrs({
    kind: 'click-component',
    stepTitle,
    componentName: 'radio',
    label: name
  })

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Radio.Group
          {...gtmAttrs}
          onValueChange={field.onChange}
          value={field.value ?? ''}
          variant={variant}
          backgroundColor={backgroundColor}
          style={{ marginBottom: '3.2rem' }}>
          {options?.map((option) => (
            <Radio.Item
              value={option.value}
              key={option.value}
              label={option.label}
              description={option.description}
            />
          ))}
        </Radio.Group>
      )}
    />
  )
}
