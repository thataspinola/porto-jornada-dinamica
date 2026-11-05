'use client'

import { Controller, useFormContext } from 'react-hook-form'

import {
  birthDateToDisplay,
  birthDateToFormValue,
  buildGtmAttrs
} from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI'

import { useBirthDateAgeSync } from './hooks/useBirthDateAgeSync'
import styles from './styles.module.scss'
import type { BirthDateInputElementProps } from './types'

export function BirthDateInputElement({ element }: BirthDateInputElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const config = element.config
  const gtmAttrs = buildGtmAttrs({
    kind: 'form-input',
    stepTitle,
    label: config.label
  })

  useBirthDateAgeSync({ fieldName: config.name })

  return (
    <Controller
      control={control}
      name={config.name}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...gtmAttrs}
          type="tel"
          value={birthDateToDisplay(field.value)}
          onChange={(e) => field.onChange(birthDateToFormValue(e.target.value))}
          errorMessage={fieldState.error?.message ?? ''}
          className={styles.container}
          variant={config.variant}
          {...(config.variant === 'big' && { placeholder: config.label })}
          {...(config.variant !== 'big' && { label: config.label })}
        />
      )}
    />
  )
}
