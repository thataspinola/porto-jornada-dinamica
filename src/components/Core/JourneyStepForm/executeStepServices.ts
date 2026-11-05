import type { FieldValues, UseFormReturn } from 'react-hook-form'

import type { JourneyServiceInput } from '@/hooks/useJourneyService'
import type { useMultipleService } from '@/hooks/useMultipleService'
import type { ServiceResult } from '@/services/types'
import { useJourneyStore } from '@/store/journeyStore'
import { resolveTemplates } from '@/utils/resolveTemplates'

import { dispatchServiceEvent } from './dispatchServiceEvent'
import type { PendingAction } from './types'

export function asArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

export function atIndex<T>(
  value: T | T[] | undefined,
  index: number
): T | undefined {
  if (value == null) return undefined
  return Array.isArray(value) ? value[index] : value
}

type ExecuteStepServicesInput = {
  data: FieldValues
  config: PendingAction
  product?: string
  dirtyFields: UseFormReturn['formState']['dirtyFields']
}

type ServiceExecution = {
  executeJourneyService: (input: JourneyServiceInput) => Promise<ServiceResult>
  callMultiple: ReturnType<typeof useMultipleService>['callMultiple']
}

export async function executeStepServices(
  { data, config, product, dirtyFields }: ExecuteStepServicesInput,
  { executeJourneyService, callMultiple }: ServiceExecution
): Promise<void> {
  const submittedFields = config.onlyDirtyFields
    ? Object.fromEntries(
        Object.entries(data).filter(([key]) => Boolean(dirtyFields[key]))
      )
    : data

  if (Object.keys(submittedFields).length > 0) {
    await executeJourneyService({
      fields: submittedFields,
      product: product ?? '',
      action: 'session',
      module: 'session',
      mockResponse: config.mockResponse ? { data: {}, delayMs: 0 } : undefined,
      recaptchaAction: 'save_session'
    })
  }

  await callMultiple(asArray(config.service), async (service, index) => {
    const rawPayload = atIndex(config.payload, index)
    const rawAdditionalPayload = atIndex(config.additionalPayload, index)
    const store = useJourneyStore.getState()
    const context = {
      fields: { ...store.fields, ...submittedFields },
      services: store.services,
      parameters: store.parameters,
      business: store.business
    }
    const usesPayload = rawPayload != null
    const payload = usesPayload
      ? resolveTemplates(rawPayload, context)
      : undefined
    const additionalPayload = rawAdditionalPayload
      ? resolveTemplates(rawAdditionalPayload, context)
      : undefined

    const result = await executeJourneyService({
      fields: usesPayload ? (payload ?? {}) : submittedFields,
      product: product ?? '',
      action: service.action,
      module: service.module,
      additionalPayload,
      mockResponse: atIndex(config.mockResponse, index),
      recaptchaAction: 'submit_form'
    })

    const state = useJourneyStore.getState()
    await dispatchServiceEvent({
      service,
      result,
      formData: data,
      fields: state.fields,
      parameters: state.parameters,
      services: state.services,
      product
    })
  })
}
