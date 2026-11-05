'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import {
  computePrefillValues,
  formatGtmText,
  resolveTemplates,
  setCookiesFromTemplates
} from '@/utils'
import { getAnalyticsUserId } from '@/utils/ensureAnalyticsUserId'

import { useJourneyStore } from '@/store/journeyStore'

import type { FullscreenAction } from '@/hooks/serviceErrorHandlers/types'
import { useConditionGuard } from '@/hooks/useConditionGuard'
import { type DataQualityType, useDataQuality } from '@/hooks/useDataQuality'
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'
import { useJourneyService } from '@/hooks/useJourneyService'
import { useMultipleService } from '@/hooks/useMultipleService'
import { useServiceErrorHandler } from '@/hooks/useServiceErrorHandler'

import { isMaskedEmail, isMaskedPhone } from '@/validation/fields'
import {
  areRequiredFieldsComplete,
  buildStepFormSchema
} from '@/validation/form'

import { dispatchServiceEvent } from './dispatchServiceEvent'
import type { JourneyElement, JourneyStep, PendingAction } from './types'

// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FieldValues constraint requires any
type FormValues = Record<string, any>

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function atIndex<T>(value: T | T[] | undefined, index: number): T | undefined {
  if (value == null) return undefined
  return Array.isArray(value) ? value[index] : value
}

function navigateOnSuccess(
  router: ReturnType<typeof useRouter>,
  destination: string,
  fullPageRedirect: boolean
) {
  if (fullPageRedirect) {
    window.location.assign(destination)
    return
  }

  router.push(destination)
}

function buildFormValues(
  schemaDefaults: FormValues,
  persistedFields: FormValues,
  empty: boolean
) {
  return empty ? schemaDefaults : { ...schemaDefaults, ...persistedFields }
}

function pickDirtyFields(
  data: FormValues,
  dirtyFields: Partial<Readonly<FormValues>>
): FormValues {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => Boolean(dirtyFields[key]))
  )
}

type DataQualityTarget = {
  type: DataQualityType
  fieldName: string
}

const DATA_QUALITY_ERROR_MESSAGE: Record<DataQualityType, string> = {
  email: 'E-mail inválido.',
  phone: 'Celular inválido.',
  socialName: 'Nome social inválido.'
}

function collectDataQualityTargets(
  elements: JourneyElement[],
  values: FormValues
): DataQualityTarget[] {
  const targets: DataQualityTarget[] = []

  for (const element of elements) {
    if (element.type === 'EMAIL_INPUT') {
      const fieldName = element.config.name

      const value = values[fieldName]
      if (value && !isMaskedEmail(value)) {
        targets.push({ type: 'email', fieldName })
      }

      continue
    }

    if (element.type === 'PHONE_INPUT') {
      const fieldName = element.config.name

      const value = values[fieldName]
      if (value && !isMaskedPhone(value)) {
        targets.push({ type: 'phone', fieldName })
      }

      continue
    }

    if (element.type === 'SOCIAL_NAME') {
      const fieldName = element.config.name
      if (values.hasSocialName === true && values[fieldName]) {
        targets.push({ type: 'socialName', fieldName })
      }
    }
  }

  return targets
}

type UseJourneyStepFormControllerParams = {
  step: JourneyStep
  product?: string
  analyticsProduct?: string
  journeyId: string
}

export function useJourneyStepFormController({
  step,
  product,
  analyticsProduct,
  journeyId
}: UseJourneyStepFormControllerParams) {
  const { fields, mergeFields, services, parameters } = useJourneyStore(
    useShallow((state) => ({
      fields: state.fields,
      mergeFields: state.mergeFields,
      services: state.services,
      parameters: state.parameters
    }))
  )

  const {
    schema,
    defaultValues: schemaDefaults,
    requiredFields
  } = buildStepFormSchema(step)
  const initialFormValues = useRef(
    buildFormValues(schemaDefaults, fields, step.empty)
  ).current
  const formId = useId()

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialFormValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  })

  const {
    handleSubmit: hookFormHandleSubmit,
    getValues,
    setValue,
    reset
  } = methods
  const isStepComplete = useWatch({
    control: methods.control,
    compute: (values) => areRequiredFieldsComplete(requiredFields, values)
  })

  const pendingActionRef = useRef<PendingAction | null>(null)
  const [activeAction, setActiveAction] = useState<PendingAction | null>(null)
  const {
    activeIndex: activeServiceIndex,
    activeIndexRef: activeServiceIndexRef,
    reset: resetActiveService,
    callMultiple
  } = useMultipleService()
  const [fullscreenError, setFullscreenError] =
    useState<FullscreenAction | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const router = useRouter()
  const queryClient = useQueryClient()
  const { navigateTo } = useJourneyNavigation()

  const { executeJourneyService } = useJourneyService()

  const { validate: validateDataQuality } = useDataQuality()

  const { handleServiceError } = useServiceErrorHandler(methods)

  const { evaluate: evaluateGuard } = useConditionGuard(methods)

  const { mutateAsync: callServiceMutation, isPending: isMutationPending } =
    useMutation({
      mutationFn: async (input: {
        data: FormValues
        config: PendingAction
      }) => {
        const sessionMockResponse = input.config.mockResponse
          ? { data: {}, delayMs: 0 }
          : undefined

        const submittedFields = input.config.onlyDirtyFields
          ? pickDirtyFields(input.data, methods.formState.dirtyFields)
          : input.data

        if (Object.keys(submittedFields).length > 0) {
          await executeJourneyService({
            fields: submittedFields,
            product: product ?? '',
            action: 'session',
            module: 'session',
            mockResponse: sessionMockResponse,
            recaptchaAction: 'save_session'
          })
        }

        const services = asArray(input.config.service)

        await callMultiple(services, async (service, index) => {
          const rawPayload = atIndex(input.config.payload, index)
          const rawAdditionalPayload = atIndex(
            input.config.additionalPayload,
            index
          )
          const storeState = useJourneyStore.getState()
          const templateContext = {
            fields: { ...storeState.fields, ...submittedFields },
            services: storeState.services,
            parameters: storeState.parameters,
            business: storeState.business
          }
          const usesPayload = rawPayload != null
          const payload = usesPayload
            ? resolveTemplates(rawPayload, templateContext)
            : undefined
          const additionalPayload = rawAdditionalPayload
            ? resolveTemplates(rawAdditionalPayload, templateContext)
            : undefined

          const result = await executeJourneyService({
            fields: usesPayload ? (payload ?? {}) : submittedFields,
            product: product ?? '',
            action: service.action,
            module: service.module,
            additionalPayload,
            mockResponse: atIndex(input.config.mockResponse, index),
            recaptchaAction: 'submit_form'
          })

          await dispatchServiceEvent({
            service,
            result,
            formData: input.data,
            fields: useJourneyStore.getState().fields,
            parameters: useJourneyStore.getState().parameters,
            services: useJourneyStore.getState().services,
            product
          })
        })
      }
    })

  function applyPrefill() {
    if (!step) return

    const prefill = computePrefillValues(
      step.elements,
      getValues(),
      services,
      parameters
    )

    if (Object.keys(prefill).length === 0) return

    for (const [key, value] of Object.entries(prefill)) {
      setValue(key as never, value as never, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false
      })
    }

    mergeFields(prefill)
  }

  function requestAction(action: PendingAction) {
    pendingActionRef.current = action
    resetActiveService()
    setActiveAction(action)
  }

  function commitFields() {
    mergeFields(getValues())
  }

  async function onValid(data: FormValues) {
    const action = pendingActionRef.current
    pendingActionRef.current = null
    let navigationStarted = false

    if (!action) return

    try {
      const dataQualityTargets = collectDataQualityTargets(step.elements, data)
      const hasDataQualityTargets = dataQualityTargets.length > 0

      if (hasDataQualityTargets) {
        const results = await Promise.all(
          dataQualityTargets.map(async (target) => ({
            target,
            isValid: await validateDataQuality(
              target.type,
              data[target.fieldName]
            )
          }))
        )

        const invalids = results.filter((result) => !result.isValid)

        if (invalids.length > 0) {
          invalids.forEach(({ target }, index) => {
            methods.setError(target.fieldName as never, {
              type: 'server',
              message: DATA_QUALITY_ERROR_MESSAGE[target.type]
            })

            if (index === 0) {
              methods.setFocus(target.fieldName as never)
            }
          })

          setActiveAction(null)

          return
        }
      }

      commitFields()

      const guard = evaluateGuard({
        formData: data,
        rules: action.conditions
      })

      if (guard.matched) {
        return
      }

      await callServiceMutation({
        data,
        config: action
      })

      if (action.revalidatePrefetch) {
        await queryClient.refetchQueries(
          {
            queryKey: ['journey-prefetch', 'journey', journeyId],
            exact: true,
            type: 'active'
          },
          { throwOnError: false }
        )
      }

      if (action.cookiesOnSuccess) {
        const context = {
          fields: data,
          services: useJourneyStore.getState().services
        }

        setCookiesFromTemplates(action.cookiesOnSuccess, context)
      }

      const loadingScreen = atIndex(
        action.loadingScreen,
        Math.max(asArray(action.service).length - 1, 0)
      )
      if (loadingScreen?.to === 100) {
        await new Promise((resolve) =>
          setTimeout(resolve, loadingScreen.completionHold ?? 0)
        )
      }

      if (action.targetStepOnSuccess) {
        navigationStarted = true
        navigateOnSuccess(
          router,
          action.targetStepOnSuccess,
          action.fullPageRedirect
        )
      }
    } catch (error) {
      const service = asArray(action.service)[activeServiceIndexRef.current]
      handleServiceError(error, {
        nodeErrors: action.errors,
        onFullscreen: setFullscreenError,
        alertContext:
          action.alertEvent && service
            ? {
                alertEvent: action.alertEvent,
                errorService: `${service.action}/${service.module}`
              }
            : undefined
      })
    } finally {
      if (!navigationStarted) {
        setActiveAction(null)
      }
    }
  }

  function onInvalid(formErrors: typeof methods.formState.errors) {
    setActiveAction(null)

    Object.entries(formErrors).forEach(([field, error]) => {
      if (error?.message) {
        const analyticsUserId = getAnalyticsUserId()
        window.dataLayer.push({
          event: 'alert',
          ev_action: `preencheu:${step.slug}:alert`,
          ev_label: `${field}:${formatGtmText(error.message)}`,
          alert_event: 'select_content',
          alert_type: 'usuario',
          ...(analyticsUserId ? { user_id: analyticsUserId } : {})
        })
      }
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once on hydration — schemaDefaults, step, fields intentionally excluded to avoid re-running after initial fill
  useEffect(() => {
    const persist = useJourneyStore.persist

    if (persist.hasHydrated()) {
      const { fields: persistedFields } = useJourneyStore.getState()
      const formFields = buildFormValues(
        schemaDefaults,
        persistedFields,
        step.empty
      )

      if (Object.keys(formFields).length > 0) {
        reset(formFields, {
          keepDirty: false,
          keepTouched: false
        })
      }

      return
    }

    return persist.onFinishHydration((state) => {
      const formFields = buildFormValues(
        schemaDefaults,
        state.fields,
        step.empty
      )

      reset(formFields, {
        keepDirty: false,
        keepTouched: false
      })
    })
  }, [reset])

  // biome-ignore lint/correctness/useExhaustiveDependencies: applyPrefill is defined in this scope and recreated on every render — adding it would cause an infinite loop
  useEffect(() => {
    applyPrefill()
  }, [step, getValues, mergeFields, parameters, services, setValue])

  const formProps = {
    id: formId,
    onSubmit: hookFormHandleSubmit(onValid, onInvalid),
    noValidate: true,
    autoComplete: 'off' as const
  }

  return {
    methods,
    formProps,
    requestAction,
    activeAction,
    activeServiceIndex,
    isMutationPending,
    formId,
    commitFields,
    navigateTo,
    isStepComplete,
    fullscreenError,
    retryCount,
    clearFullscreenError: () => {
      setRetryCount((c) => c + 1)
      setFullscreenError(null)
    }
  }
}
