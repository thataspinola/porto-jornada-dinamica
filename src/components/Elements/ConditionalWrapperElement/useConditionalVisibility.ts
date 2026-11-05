'use client'

import { useFormContext, useFormState, useWatch } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { evaluateRule } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import type { ConditionCheck } from '@/validation/schemas/elements/conditions.schema'

export function useConditionalVisibility(checks: ConditionCheck[]) {
  const { control } = useFormContext()
  const { errors } = useFormState({ control })
  const formValues = useWatch({ control })

  const { fields, parameters, services, business } = useJourneyStore(
    useShallow((state) => ({
      fields: state.fields,
      parameters: state.parameters,
      services: state.services,
      business: state.business
    }))
  )

  return evaluateRule(
    { checks },
    {
      fields: { ...fields, ...formValues },
      parameters,
      services,
      business,
      formErrors: errors as Record<string, unknown>
    }
  )
}
