'use client'

import { Radio } from '@porto-stack/ui'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { buildGtmAttrs } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'

import type { AddressRadioElementProps } from './types'
import { useAddressRadio } from './useAddressRadio'

export function AddressRadioElement({ element }: AddressRadioElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const { name, sourcePath, variant, backgroundColor, cssProperties } =
    element.config
  const { option } = useAddressRadio(name, sourcePath)
  const tipoMoradia = useWatch({ control, name: 'tipoMoradia' }) as
    | string
    | undefined

  if (!option?.value) {
    return null
  }

  const gtmAttrs = buildGtmAttrs({
    kind: 'click-component',
    stepTitle,
    componentName: 'address-card',
    subtitle: tipoMoradia,
    label: 'endereco'
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
          style={cssProperties}>
          <Radio.Item
            value={option.value}
            label={option.label}
            description={option.description}
          />
        </Radio.Group>
      )}
    />
  )
}
