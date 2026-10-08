"use client";

import { useJourneyStore } from "@/store";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";

import { useJourneyForm } from "./useJourneyForm";
import { useJourneyNavigation } from "./useJourneyNavigation";
import { useJourneySteps } from "./useJourneySteps";

export type { GoNextOptions } from "./useJourneyNavigation";

export function useJourneyController(journey: JourneyDefinition) {
  const steps = useJourneySteps(journey);
  const form = useJourneyForm(journey, steps.currentStep);
  const navigation = useJourneyNavigation({
    steps: steps.steps,
    currentStep: steps.currentStep,
    currentStepIndex: steps.currentStepIndex,
    currentStepFields: form.currentStepFields,
    getValues: form.getValues,
    handleSubmit: form.handleSubmit,
    trigger: form.trigger,
    getFieldState: form.getFieldState,
    setFormError: form.setFormError,
    journeySlug: journey.slug,
  });

  const { error: storedError, business, services, hasHydrated } = useJourneyStore();
  const storedErrorEntries = Object.entries(storedError).filter(
    ([, v]) => !!v,
  ) as Array<[string, string]>;

  return {
    steps: steps.steps,
    stepCount: steps.stepCount,
    currentStep: steps.currentStep,
    currentStepIndex: steps.currentStepIndex,
    sortedElements: steps.elements,
    navigationElements: steps.navigationElements,
    register: form.register,
    control: form.control,
    formState: form.formState,
    getValues: form.getValues,
    fields: form.fields,
    canProceed: hasHydrated && form.canProceed,
    business,
    services,
    storedError,
    storedErrorEntries,
    goNext: navigation.goNext,
    goPrev: navigation.goPrev,
    submitted: navigation.submitted,
    setSubmitted: navigation.setSubmitted,
  };
}
