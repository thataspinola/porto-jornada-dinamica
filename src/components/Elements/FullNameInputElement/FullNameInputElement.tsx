'use client'
import { useFormContext } from 'react-hook-form'

import { buildGtmAttrs, resolveValidationAttributes } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI/Input'

import styles from './FullNameInputElement.module.scss'
import type { FullNameInputElementProps } from './FullNameInputElement.types'

export function FullNameInputElement({ element }: FullNameInputElementProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext()
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
    <Input
      {...register(config.name)}
      {...gtmAttrs}
      style={config.cssProperties}
      type="text"
      className={styles.container}
      variant={config.variant}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      errorMessage={(errors[config.name]?.message as string) ?? ''}
      {...(config.variant === 'big' && { placeholder: config.label })}
      {...(config.variant !== 'big' && { label: config.label })}
    />
  )
}
