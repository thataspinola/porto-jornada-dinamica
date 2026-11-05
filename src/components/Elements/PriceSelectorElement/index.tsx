'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, clampNumber } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { PriceSelector } from '@/components/UI'

import type { PriceSelectorElementProps } from './types'

export function PriceSelectorElement({ element }: PriceSelectorElementProps) {
  const { name, min, max, step } = element.config
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const gtmAttrs = buildGtmAttrs({
    kind: 'click-component',
    stepTitle,
    componentName: 'price-selector',
    label: name
  })

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === 'number' ? field.value : min
        const setValue = (next: number) =>
          field.onChange(clampNumber(next, min, max))

        return (
          <div {...gtmAttrs} style={{ display: 'contents' }}>
            <PriceSelector
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={setValue}
            />
          </div>
        )
      }}
    />
  )
}
