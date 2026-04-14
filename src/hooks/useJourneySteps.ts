/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import { useEffect } from "react";

import { useJourneyStore } from "@/store";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";

import { useCurrentPathname } from "./useCurrentPathname";

type JourneyStep = JourneyDefinition["steps"][number];
type JourneyElement = JourneyDefinition["steps"][number]["elements"][number];

export function useJourneySteps(journey: JourneyDefinition) {
  const steps = journey.steps;
  const stepCount = steps.length;

  const { mergeBusiness } = useJourneyStore();

  const pathname = useCurrentPathname();

  const stepSlugToIndex = new Map(steps.map((step, i) => [step.slug, i]));

  const lastPathname = pathname.split("/").filter(Boolean).at(-1) || "";

  const currentStep: JourneyStep =
    steps[stepSlugToIndex.get(lastPathname) || 0];

  const currentStepIndex = currentStep
    ? (stepSlugToIndex.get(currentStep.slug) ?? 0)
    : 0;

  const elements: JourneyElement[] = currentStep?.elements || [];

  const navigationElements = elements.filter(
    (element) => element.type === "NAVIGATION",
  );

  function syncBusiness() {
    mergeBusiness({
      journeyId: journey.id,
      journeySlug: journey.slug,
      stepSlug: currentStep?.slug || null,
    });
  }

  useEffect(() => {
    syncBusiness();
  }, [journey.id, journey.slug, currentStep?.slug, mergeBusiness]);

  return {
    steps,
    currentStep,
    stepCount,
    stepSlugToIndex,
    currentStepIndex,
    elements,
    navigationElements,
  };
}
