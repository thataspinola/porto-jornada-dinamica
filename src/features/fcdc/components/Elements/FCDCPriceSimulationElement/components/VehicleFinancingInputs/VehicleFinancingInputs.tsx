import { Typography } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { centsToReais, formatPriceFromCents, reaisToCents } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { EditableInput } from '../EditableInput'
import styles from './VehicleFinancingInputs.module.scss'

type VehicleFinancingInputsProps = {
  isLoadingEntryCalculation: boolean
  isEditingVehicleValue?: boolean
  setIsEditingVehicleValue?: (isEditing: boolean) => void
  isEditingEntryValue?: boolean
  setIsEditingEntryValue?: (isEditing: boolean) => void
}

const displayFromReais = (value: unknown): string => {
  if (typeof value !== 'number' || value <= 0) return ''
  return formatPriceFromCents(reaisToCents(value))
}

const parseInputToReais = (input: string): number | undefined => {
  const cents = Number(input.replace(/\D/g, ''))
  return cents ? centsToReais(cents) : undefined
}

export function VehicleFinancingInputs({
  isLoadingEntryCalculation,
  isEditingVehicleValue,
  setIsEditingVehicleValue,
  isEditingEntryValue,
  setIsEditingEntryValue
}: VehicleFinancingInputsProps) {
  const { formState, setValue } = useFormContext()
  const mergeFields = useJourneyStore((state) => state.mergeFields)

  return (
    <div className={styles.container}>
      <Typography as="h3" weight="medium" variant="title5">
        Qual o valor do veículo e da entrada?
      </Typography>

      <div className={styles.priceFields}>
        <Controller
          name="vehicleValue"
          render={({ field }) => (
            <EditableInput.Root
              isEditing={isEditingVehicleValue}
              isEditingChange={(editing) => {
                if (editing) {
                  setValue('vehicleValue', '')
                  mergeFields({ vehicleValue: '' })
                }

                setIsEditingVehicleValue?.(editing)
              }}>
              <EditableInput.Field
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                type="tel"
                variant="default"
                label="Valor do veículo"
                value={displayFromReais(field.value)}
                errorMessage={
                  (formState.errors.vehicleValue?.message as string) || ''
                }
                onChange={(event) =>
                  field.onChange(parseInputToReais(event.target.value))
                }
              />
              <EditableInput.Edit label="Editar valor do veículo" />
            </EditableInput.Root>
          )}
        />

        <Controller
          name="vehicleEntryValue"
          render={({ field }) => (
            <EditableInput.Root
              isEditing={isEditingEntryValue}
              isEditingChange={(editing) => {
                if (editing) {
                  setValue('vehicleEntryValue', '')
                  mergeFields({ vehicleEntryValue: '' })
                }

                setIsEditingEntryValue?.(editing)
              }}
              isLoading={isLoadingEntryCalculation}>
              <EditableInput.Field
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                type="tel"
                variant="default"
                label="Valor da entrada"
                value={displayFromReais(field.value)}
                errorMessage={
                  (formState.errors.vehicleEntryValue?.message as string) || ''
                }
                onChange={(event) =>
                  field.onChange(parseInputToReais(event.target.value))
                }
              />
              <EditableInput.Edit label="Editar valor de entrada" />
            </EditableInput.Root>
          )}
        />
      </div>
    </div>
  )
}
