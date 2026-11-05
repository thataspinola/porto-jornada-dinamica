'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'

import { sendNativeMessage } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'

import type { JourneyDefinition } from '@/validation/schemas'

type JourneyStep = JourneyDefinition['steps'][number]
type JourneyElement = JourneyDefinition['steps'][number]['elements'][number]

export function useJourneyBuilderController(journey: JourneyDefinition) {
  const pathname = usePathname()
  const { goBack } = useJourneyNavigation()
  const [isCaptchaReady, setIsCaptchaReady] = useState(false)

  const {
    error: storedError,
    business,
    services,
    fields,
    mergeBusiness,
    mergeFields,
    setErrors
  } = useJourneyStore(
    useShallow((state) => ({
      error: state.error,
      business: state.business,
      services: state.services,
      fields: state.fields,
      mergeBusiness: state.mergeBusiness,
      mergeFields: state.mergeFields,
      setErrors: state.setErrors
    }))
  )

  const steps = journey.steps

  const stepSlugToIndex = new Map(steps.map((step, i) => [step.slug, i]))

  const lastPathname = pathname.split('/').filter(Boolean).at(-1) || ''

  const currentStep: JourneyStep = steps[stepSlugToIndex.get(lastPathname) || 0]

  const currentStepIndex = currentStep
    ? (stepSlugToIndex.get(currentStep.slug) ?? 0)
    : 0

  const sortedElements: JourneyElement[] = currentStep?.elements || []

  function handleGoBack() {
    if (journey.variant === 'app' && currentStepIndex === 0) {
      sendNativeMessage({ action: 'dismiss' })
      return
    }
    goBack(currentStep?.backStepSlug)
  }

  useEffect(() => {
    mergeBusiness({
      journeyId: journey.id,
      journeySlug: journey.slug,
      stepSlug: currentStep?.slug || null
    })
  }, [journey.id, journey.slug, currentStep?.slug, mergeBusiness])

  useEffect(() => {
    setErrors(journey.errors ?? [])
  }, [journey.errors, setErrors])

  useEffect(() => {
    const defaultFields = journey.defaultFields
    if (!defaultFields) return

    const currentFields = useJourneyStore.getState().fields

    const missing = Object.fromEntries(
      Object.entries(defaultFields).filter(([key]) => {
        const value = currentFields[key]
        return value == null || value === ''
      })
    )

    if (Object.keys(missing).length > 0) mergeFields(missing)
  }, [journey.defaultFields, mergeFields])

  useEffect(() => {
    if (window?.grecaptcha?.enterprise?.execute) {
      setIsCaptchaReady(true)
      return
    }

    const intervalId = setInterval(() => {
      if (window?.grecaptcha?.enterprise?.execute) {
        setIsCaptchaReady(true)
        clearInterval(intervalId)
      }
    }, 200)

    return () => clearInterval(intervalId)
  }, [])

  return {
    isCaptchaReady,
    variant: journey.variant,
    steps,
    currentStep,
    currentStepIndex,
    sortedElements,
    business,
    services,
    storedError,
    fields,
    handleGoBack
  }
}
