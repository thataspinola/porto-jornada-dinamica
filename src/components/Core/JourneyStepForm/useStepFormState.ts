'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId, useMemo, useRef } from 'react'
import { type FieldValues, useForm, useWatch } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { useJourneyStore } from '@/store/journeyStore'
import { computePrefillValues } from '@/utils/computePrefillValues'
import { areRequiredFieldsComplete } from '@/validation/form/areRequiredFieldsComplete'
import { buildStepFormSchema } from '@/validation/form/buildStepFormSchema'

import type { JourneyStep } from './types'

function buildFormValues(
  defaults: FieldValues,
  fields: FieldValues,
  empty: boolean
) {
  return empty ? defaults : { ...defaults, ...fields }
}

export function useStepFormState(step: JourneyStep) {
  const { fields, services, parameters, mergeFields } = useJourneyStore(
    useShallow((state) => ({
      fields: state.fields,
      services: state.services,
      parameters: state.parameters,
      mergeFields: state.mergeFields
    }))
  )
  const { schema, defaultValues, requiredFields } = useMemo(
    () => buildStepFormSchema(step),
    [step]
  )
  const initial = useRef({ defaults: defaultValues, empty: step.empty })
  const initialValues = useRef(
    buildFormValues(defaultValues, fields, step.empty)
  ).current
  const methods = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  })
  const { reset, getValues, setValue } = methods
  const formId = useId()
  const isStepComplete = useWatch({
    control: methods.control,
    compute: (values) => areRequiredFieldsComplete(requiredFields, values)
  })

  useEffect(() => {
    const applyHydration = (persistedFields: FieldValues) => {
      reset(
        buildFormValues(
          initial.current.defaults,
          persistedFields,
          initial.current.empty
        ),
        {
          keepDirty: false,
          keepTouched: false
        }
      )
    }
    const persist = useJourneyStore.persist
    if (persist.hasHydrated()) {
      const formFields = buildFormValues(
        initial.current.defaults,
        useJourneyStore.getState().fields,
        initial.current.empty
      )
      if (Object.keys(formFields).length > 0)
        applyHydration(useJourneyStore.getState().fields)
      return
    }
    return persist.onFinishHydration((state) => applyHydration(state.fields))
  }, [reset])

  useEffect(() => {
    const prefill = computePrefillValues(
      step.elements,
      getValues(),
      services,
      parameters
    )
    if (Object.keys(prefill).length === 0) return
    for (const [key, value] of Object.entries(prefill)) {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false
      })
    }
    mergeFields(prefill)
  }, [step, getValues, services, parameters, setValue, mergeFields])

  return { methods, formId, isStepComplete }
}
