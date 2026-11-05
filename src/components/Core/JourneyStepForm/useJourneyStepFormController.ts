'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { FieldValues } from 'react-hook-form'

import { useJourneyStore } from '@/store/journeyStore'
import type { FullscreenAction } from '@/hooks/serviceErrorHandlers/types'
import { useConditionGuard } from '@/hooks/useConditionGuard'
import { useDataQuality } from '@/hooks/useDataQuality'
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'
import { useJourneyService } from '@/hooks/useJourneyService'
import { useMultipleService } from '@/hooks/useMultipleService'
import { useServiceErrorHandler } from '@/hooks/useServiceErrorHandler'
import { formatGtmText } from '@/utils/formatGtm'
import { getAnalyticsUserId } from '@/utils/ensureAnalyticsUserId'
import { setCookiesFromTemplates } from '@/utils/setCookiesFromTemplates'

import { asArray, atIndex, executeStepServices } from './executeStepServices'
import { useStepFormState } from './useStepFormState'
import { validateStepDataQuality } from './validateStepDataQuality'
import type { JourneyStep, PendingAction } from './types'

type FormValues = FieldValues

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

type UseJourneyStepFormControllerParams = {
  step: JourneyStep
  product?: string
  journeyId: string
}

export function useJourneyStepFormController({
  step,
  product,
  journeyId
}: UseJourneyStepFormControllerParams) {
  const mergeFields = useJourneyStore((state) => state.mergeFields)
  const { methods, formId, isStepComplete } = useStepFormState(step)
  const { handleSubmit: hookFormHandleSubmit, getValues } = methods

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
      mutationFn: ({
        data,
        config
      }: {
        data: FormValues
        config: PendingAction
      }) =>
        executeStepServices(
          { data, config, product, dirtyFields: methods.formState.dirtyFields },
          { executeJourneyService, callMultiple }
        )
    })

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
      const invalids = await validateStepDataQuality(
        step.elements,
        data,
        validateDataQuality
      )
      if (invalids.length > 0) {
        invalids.forEach(({ fieldName, message }, index) => {
          methods.setError(fieldName, { type: 'server', message })
          if (index === 0) methods.setFocus(fieldName)
        })
        return
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
    if (typeof window === 'undefined' || !window.dataLayer) return

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
