'use client'

import { notify } from '@porto-stack/ui/utils'
import { useCallback, useRef } from 'react'
import {
  type FieldValues,
  type UseFormReturn,
  useFormContext,
} from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { interpolateTemplate } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'

import type { ServiceErrorsConfig } from '@/validation/schemas'

import {
  type AlertEventContext,
  dispatchAlert,
} from './serviceErrorHandlers/dispatchAlert'

import {
  buildErrorInterpolationScope,
  extractErrorCode,
  interpolateFullscreenAction,
  resolveErrorAction,
} from './serviceErrorHandlers/resolveErrorAction'

import type {
  FullscreenAction,
  ServiceErrorAction,
} from './serviceErrorHandlers/types'

export type { AlertEventContext }

type InterpolationContext = Record<string, unknown>

function interpolate(template: string, ctx: InterpolationContext): string {
  const result = interpolateTemplate(template, ctx, {
    keepMissing: true,
  })

  return result ?? template
}

function applyAction(
  action: ServiceErrorAction,
  ctx: InterpolationContext,
  methods: UseFormReturn<FieldValues> | null,
  navigateTo: (destination: string) => void,
  onFullscreen: (action: FullscreenAction) => void
) {
  switch (action.kind) {
    case 'notify': {
      const { actionButton } = action
      const onClickAction = actionButton?.onClickAction

      notify({
        type: 'error',
        title: interpolate(action.title, ctx),
        description: interpolate(action.description, ctx),
        actionButton: actionButton && {
          children: interpolate(actionButton.children, ctx),
          onClick: onClickAction
            ? () =>
                applyAction(
                  onClickAction,
                  ctx,
                  methods,
                  navigateTo,
                  onFullscreen
                )
            : undefined,
        },
      })

      return
    }

    case 'fieldError': {
      const message = interpolate(action.message, ctx)

      if (methods) {
        methods.setError(action.field as never, {
          type: 'server',
          message,
        })

        if (action.focus) {
          methods.setFocus(action.field as never)
        }

        return
      }

      notify({
        type: 'error',
        title: message,
        description: '',
      })

      return
    }

    case 'redirect':
      navigateTo(interpolate(action.url, ctx))
      return

    case 'fullscreen': {
      if (onFullscreen) {
        onFullscreen(interpolateFullscreenAction(action, ctx))
      }

      return
    }
  }
}

export type HandleServiceErrorOptions = {
  nodeErrors?: ServiceErrorsConfig
  onFullscreen?: (action: FullscreenAction) => void
  alertContext?: AlertEventContext
}

export function useServiceErrorHandler<TFieldValues extends FieldValues>(
  methodsParam?: UseFormReturn<TFieldValues>
) {
  const contextMethods = useFormContext<TFieldValues>()

  const methods = (methodsParam ??
    contextMethods ??
    null) as UseFormReturn<FieldValues> | null

  const { navigateTo } = useJourneyNavigation()

  const { fields, parameters, services, business, journeyErrors } =
    useJourneyStore(
      useShallow((state: JourneyState) => ({
        fields: state.fields,
        parameters: state.parameters,
        services: state.services,
        business: state.business,
        journeyErrors: state.errors,
      }))
    )

  // Keep latest deps in a ref so handleServiceError stays referentially stable.
  // FormProvider's context value is a fresh object each render, which would
  // otherwise re-create the callback and cause useEffect loops in callers.
  const latestRef = useRef({
    methods,
    navigateTo,
    fields,
    parameters,
    services,
    business,
    journeyErrors,
  })

  latestRef.current = {
    methods,
    navigateTo,
    fields,
    parameters,
    services,
    business,
    journeyErrors,
  }

  const handleServiceError = useCallback(
    (error: unknown, options?: HandleServiceErrorOptions) => {
      const {
        methods: currentMethods,
        navigateTo: currentNavigateTo,
        fields: currentFields,
        parameters: currentParameters,
        services: currentServices,
        business: currentBusiness,
        journeyErrors: currentJourneyErrors,
      } = latestRef.current

      const code = extractErrorCode(error)

      const action = resolveErrorAction({
        code,
        nodeErrors: options?.nodeErrors,
        journeyErrors: currentJourneyErrors,
      })

      const ctx: InterpolationContext = {
        fields: currentFields,
        parameters: currentParameters,
        services: currentServices,
        business: currentBusiness,
        error: buildErrorInterpolationScope(error),
      }

      applyAction(
        action,
        ctx,
        currentMethods,
        currentNavigateTo,
        options?.onFullscreen
      )

      if (options?.alertContext) {
        dispatchAlert(action, code, error, options.alertContext)
      }
    },
    []
  )

  return { handleServiceError }
}
