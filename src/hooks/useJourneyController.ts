'use client'

import { useJourneyStore } from '@/store'
import type { JourneyDefinition } from '@/validation/schemas'

import { useJourneyForm } from './useJourneyForm'
import { useJourneyActions } from './useJourneyActions'
import { useJourneySteps } from './useJourneySteps'

export type { GoNextOptions } from './useJourneyActions'

export function useJourneyController(journey: JourneyDefinition) {
  const steps = useJourneySteps(journey)
  const form = useJourneyForm(journey, steps.currentStep)

  const navigation = useJourneyActions({
    journey,
    currentStep: steps.currentStep,
    currentStepIndex: steps.currentStepIndex,
    currentStepFields: form.currentStepFields,
    methods: form.methods,
  })

  const {
    error: storedError,
    business,
    services,
    _hasHydrated: hasHydrated,
  } = useJourneyStore()

  const storedErrorEntries = Object.entries(storedError).filter(
    ([, v]) => !!v
  ) as Array<[string, string]>

  return {
    steps: steps.steps,
    stepCount: steps.stepCount,
    currentStep: steps.currentStep,
    currentStepIndex: steps.currentStepIndex,
    sortedElements: steps.elements,
    navigationElements: steps.navigationElements,
    methods: form.methods,
    register: form.register,
    control: form.control,
    formState: form.formState,
    getValues: form.getValues,
    fields: form.fields,
    canProceed: hasHydrated && form.canProceed && !navigation.isLoading,
    business,
    services,
    storedError,
    storedErrorEntries,
    fullscreen: navigation.fullscreen,
    onFullscreenAction: navigation.onFullscreenAction,
    goNext: navigation.goNext,
    goPrev: navigation.goPrev,
  }
}
