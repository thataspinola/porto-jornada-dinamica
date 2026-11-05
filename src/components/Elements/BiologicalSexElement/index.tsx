'use client'

import { Select } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import styles from './BiologicalSexElement.module.scss'
import { DialogLimitedOptions } from './DialogLimitedOptions'
import type { BiologicalSexElementProps } from './types'

const BIOLOGICAL_SEX_OPTIONS = [
  { value: 'BIO_GENDER_MALE', label: 'Masculino' },
  { value: 'BIO_GENDER_FEMALE', label: 'Feminino' },
  { value: 'BIO_GENDER_INTERSEX', label: 'Intersexo' }
]

const BIOLOGICAL_SEX_OPTIONS_WITHOUT_INTERSEX = BIOLOGICAL_SEX_OPTIONS.filter(
  (option) => option.value !== 'BIO_GENDER_INTERSEX'
)

export function BiologicalSexElement({ element }: BiologicalSexElementProps) {
  const { control } = useFormContext()
  const { name, label, showIntersex = true } = element.config

  const options = showIntersex
    ? BIOLOGICAL_SEX_OPTIONS
    : BIOLOGICAL_SEX_OPTIONS_WITHOUT_INTERSEX

  return (
    <div className={styles.wrapper}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Select.Root
            onValueChange={field.onChange}
            label={label}
            errorMessage={fieldState.error?.message ?? ''}
            value={field.value ?? ''}
            isValid={!!field.value && !fieldState.error?.message}>
            {options.map((option) => (
              <Select.Item value={option.value} key={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Root>
        )}
      />

      <DialogLimitedOptions />
    </div>
  )
}
