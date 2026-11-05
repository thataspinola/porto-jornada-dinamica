'use client'

import { Chips } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'

import s from './styles.module.scss'
import type { ChipsElementProps } from './types'

export function ChipsElement({ element }: ChipsElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const { name, options, cssProperties, analytics } = element.config

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Chips.Group
          type="single"
          value={field.value ?? ''}
          onValueChange={field.onChange}
          className={s.chips}
          style={cssProperties}>
          {options.map((option) => (
            <Chips.Item
              key={option.value}
              value={option.value}
              {...buildGtmAttrs({
                kind: 'button',
                stepTitle: analytics?.gtmName ?? stepTitle,
                label: `${analytics?.gtmSubnamePrefix ?? name}:${option.value}`
              })}>
              {option.label}
            </Chips.Item>
          ))}
        </Chips.Group>
      )}
    />
  )
}
