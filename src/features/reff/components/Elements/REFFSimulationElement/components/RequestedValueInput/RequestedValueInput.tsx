import { Typography } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { centsToReais, formatPriceFromCents, reaisToCents } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { EditableInput } from '../EditableInput'
import styles from './RequestedValueInput.module.scss'

type RequestedValueInputProps = {
  availableCredit: number
  isEditing?: boolean
  setIsEditing?: (isEditing: boolean) => void
}

const displayFromReais = (value: unknown): string => {
  if (typeof value !== 'number' || value <= 0) return ''
  return formatPriceFromCents(reaisToCents(value))
}

const parseInputToReais = (input: string): number | undefined => {
  const cents = Number(input.replace(/\D/g, ''))
  return cents ? centsToReais(cents) : undefined
}

export const normalizeRequestedValue = (
  value: unknown,
  availableCredit: number
): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return availableCredit
  }

  return value > availableCredit ? availableCredit : value
}

export function RequestedValueInput({
  availableCredit,
  isEditing,
  setIsEditing
}: RequestedValueInputProps) {
  const { formState, setValue } = useFormContext()
  const mergeFields = useJourneyStore((state) => state.mergeFields)

  return (
    <div className={styles.container}>
      <Typography as="h3" weight="medium" variant="title5">
        Qual valor você precisa?
      </Typography>

      <div className={styles.priceFields}>
        <Controller
          name="requestedValue"
          render={({ field }) => (
            <EditableInput.Root
              isEditing={isEditing}
              isEditingChange={(editing) => {
                if (editing) {
                  setValue('requestedValue', '', { shouldDirty: true })
                  mergeFields({ requestedValue: '' })
                }

                setIsEditing?.(editing)
              }}>
              <EditableInput.Field
                name={field.name}
                ref={field.ref}
                onBlur={() => {
                  field.onChange(
                    normalizeRequestedValue(field.value, availableCredit)
                  )
                  field.onBlur()
                }}
                type="tel"
                variant="default"
                label="Valor solicitado"
                value={displayFromReais(field.value)}
                errorMessage={
                  (formState.errors.requestedValue?.message as string) || ''
                }
                onChange={(event) =>
                  field.onChange(parseInputToReais(event.target.value))
                }
              />
              <EditableInput.Edit label="Editar valor solicitado" />
            </EditableInput.Root>
          )}
        />
      </div>
    </div>
  )
}
