'use client'

import { useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { useJourneyStore } from '@/store/journeyStore'
import { ServiceError } from '@/services/types'
import type { JourneyDefinition } from '@/validation/schemas'
import type { ServiceCallConfig } from '@/components/Elements/ServiceCallElement/ServiceCallElement'
import { resolveTemplates } from '@/utils/resolveTemplates'
import { setCookiesFromTemplates } from '@/utils/setCookiesFromTemplates'

import type { FullscreenAction } from './serviceErrorHandlers/types'

import { useConditionGuard } from './useConditionGuard'
import { useJourneyNavigation } from './useJourneyNavigation'
import { useJourneyService } from './useJourneyService'
import { useServiceErrorHandler } from './useServiceErrorHandler'

export type GoNextOptions =
  | { type: 'navigation'; targetSlug: string }
  | { type: 'service'; config: ServiceCallConfig }
  | { type: 'next' }

type Params = {
  journey: JourneyDefinition
  currentStep: JourneyDefinition['steps'][number] | undefined
  currentStepIndex: number
  currentStepFields: string[]
  methods: UseFormReturn<Record<string, unknown>>
}

export function useJourneyActions({
  journey,
  currentStep,
  currentStepIndex,
  currentStepFields,
  methods,
}: Params) {
  const { navigateTo, goBack } = useJourneyNavigation()
  const { executeJourneyService } = useJourneyService()
  const { handleServiceError } = useServiceErrorHandler(methods)
  const [fullscreen, setFullscreen] = useState<FullscreenAction>()
  const lastOptions = useRef<GoNextOptions | undefined>(undefined)
  const { evaluate } = useConditionGuard(methods, setFullscreen)
  const busy = useRef(false)
  const mounted = useRef(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  async function goNext(options: GoNextOptions) {
    if (!currentStep || busy.current) return
    lastOptions.current = options
    busy.current = true
    setIsLoading(true)
    try {
      if (
        currentStepFields.length &&
        !(await methods.trigger(currentStepFields))
      )
        return
      const values = methods.getValues()
      useJourneyStore.getState().mergeFields(values)
      if (options.type === 'navigation') {
        navigateTo(options.targetSlug)
        return
      }
      if (options.type === 'next') {
        const next = journey.steps[currentStepIndex + 1]
        if (next) navigateTo(next.slug)
        return
      }
      const config = options.config
      if (evaluate({ rules: config.conditions, formData: values }).matched)
        return
      const references = Array.isArray(config.service)
        ? config.service
        : [config.service]
      if (
        !journey.product ||
        references.length === 0 ||
        references.some((ref) => !ref || typeof ref === 'string')
      ) {
        throw new ServiceError('SERVICE_NOT_CONFIGURED', 0)
      }
      for (const [index, reference] of references.entries()) {
        if (!reference || typeof reference === 'string') continue
        const fields = config.onlyDirtyFields
          ? Object.fromEntries(
              Object.entries(values).filter(
                ([key]) => methods.formState.dirtyFields[key]
              )
            )
          : values
        const state = useJourneyStore.getState()
        const scope = {
          fields: values,
          services: state.services,
          business: state.business,
          parameters: state.parameters,
        }
        const payload = Array.isArray(config.payload)
          ? config.payload[index]
          : config.payload
        const additionalPayload = Array.isArray(config.additionalPayload)
          ? config.additionalPayload[index]
          : config.additionalPayload
        await executeJourneyService({
          fields: payload ? resolveTemplates(payload, scope) : fields,
          product: journey.product,
          action: reference.action,
          module: reference.module,
          recaptchaAction: reference.action,
          additionalPayload: additionalPayload
            ? resolveTemplates(additionalPayload, scope)
            : undefined,
        })
        if (!mounted.current) return
      }
      const state = useJourneyStore.getState()
      setCookiesFromTemplates(config.cookiesOnSuccess, {
        fields: values,
        services: state.services,
        business: state.business,
        parameters: state.parameters,
      })
      if (mounted.current) navigateTo(config.targetStepOnSuccess)
    } catch (error) {
      if (!mounted.current) return
      const config = options.type === 'service' ? options.config : undefined
      const reference =
        config &&
        (Array.isArray(config.service) ? config.service[0] : config.service)
      const errors = config?.errors ?? []
      const hasRule = [...errors, ...useJourneyStore.getState().errors].some(
        (rule) => rule.code === 'NOT_ELIGIBLE'
      )
      const cpf = currentStep.elements.find(
        (element) =>
          element.type === 'CPF_INPUT' ||
          (element.type === 'TAXVAT_INPUT' && element.config.mode === 'cpf')
      )
      const cpfNegative =
        error instanceof ServiceError &&
        error.message === 'NOT_ELIGIBLE' &&
        [
          'emprestimo-com-garantia-de-veiculo',
          'financiamento-de-veiculos',
        ].includes(journey.slug) &&
        cpf &&
        !hasRule
      handleServiceError(error, {
        onFullscreen: setFullscreen,
        nodeErrors: cpfNegative
          ? [
              ...errors,
              {
                code: 'NOT_ELIGIBLE',
                action: {
                  kind: 'fieldError',
                  field: String(
                    'name' in cpf.config ? cpf.config.name : 'taxvat'
                  ),
                  message: 'Produto indisponível para este CPF.',
                },
              },
            ]
          : errors,
        alertContext: config?.alertEvent
          ? {
              alertEvent: config.alertEvent,
              errorService:
                reference && typeof reference !== 'string'
                  ? `${reference.action}/${reference.module}`
                  : '',
            }
          : undefined,
      })
    } finally {
      busy.current = false
      if (mounted.current) setIsLoading(false)
    }
  }

  function onFullscreenAction() {
    const action = fullscreen?.attempts[0]?.actionButton.onClickAction
    setFullscreen(undefined)
    if (action?.kind === 'redirect') navigateTo(action.url)
    else if (lastOptions.current) void goNext(lastOptions.current)
  }
  return {
    goNext,
    goPrev: () => goBack(currentStep?.backStepSlug),
    isLoading,
    fullscreen,
    onFullscreenAction,
  }
}
