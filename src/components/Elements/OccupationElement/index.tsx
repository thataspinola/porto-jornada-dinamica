'use client'

import { Select } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { centsToReais, formatPriceFromCents, reaisToCents } from '@/utils'

import { Input } from '@/components/UI'

import {
  OCCUPATION_FIELD_NAMES,
  OCCUPATION_OPTIONS,
  PROFESSIONS_BY_OCCUPATION
} from './constants'
import styles from './styles.module.scss'
import type { OccupationElementProps } from './types'

export function OccupationElement({ element }: OccupationElementProps) {
  const { control, watch, setValue } = useFormContext()
  const { required } = element.config

  const selectedOccupation = watch(OCCUPATION_FIELD_NAMES.occupation) as string
  const professionOptions = PROFESSIONS_BY_OCCUPATION[selectedOccupation]
  const showProfession = Boolean(professionOptions)

  return (
    <div className={styles.container}>
      <Controller
        name={OCCUPATION_FIELD_NAMES.occupation}
        control={control}
        rules={{ required }}
        render={({ field, fieldState }) => (
          <Select.Root
            onValueChange={(value) => {
              field.onChange(value)
              setValue(OCCUPATION_FIELD_NAMES.occupationProfession, '')
            }}
            label="Ocupação"
            errorMessage={fieldState.error?.message ?? ''}
            isValid={!!field.value && !fieldState.error}
            value={field.value ?? ''}>
            {OCCUPATION_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Root>
        )}
      />

      {selectedOccupation && showProfession && (
        <Controller
          key={selectedOccupation}
          name={OCCUPATION_FIELD_NAMES.occupationProfession}
          control={control}
          render={({ field, fieldState }) => (
            <Select.Root
              onValueChange={field.onChange}
              label="Profissão"
              errorMessage={fieldState.error?.message ?? ''}
              isValid={!!field.value && !fieldState.error}
              value={field.value ?? ''}>
              {professionOptions.map((profession) => (
                <Select.Item key={profession.value} value={profession.value}>
                  {profession.label}
                </Select.Item>
              ))}
            </Select.Root>
          )}
        />
      )}

      {selectedOccupation && (
        <Controller
          name={OCCUPATION_FIELD_NAMES.occupationIncome}
          control={control}
          render={({ field, fieldState }) => {
            const numericValue =
              typeof field.value === 'number' ? field.value : 0

            return (
              <Input
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                label="Renda"
                variant="default"
                type="tel"
                value={
                  numericValue
                    ? formatPriceFromCents(reaisToCents(numericValue))
                    : ''
                }
                onChange={(event) => {
                  const cents = Number(event.target.value.replace(/\D/g, ''))
                  field.onChange(cents ? centsToReais(cents) : undefined)
                }}
                errorMessage={fieldState.error?.message ?? ''}
              />
            )
          }}
        />
      )}
    </div>
  )
}
