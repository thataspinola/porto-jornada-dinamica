/** biome-ignore-all lint/performance/noAccumulatingSpread: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { useJourneyStore } from "@/store";
import { computePrefillValues } from "@/utils";

import { journeyStore } from "@/store/journeyStore";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";
import { buildJourneyFormSchema } from "@/validation/validations";

type JourneyStep = JourneyDefinition["steps"][number];
type FormValues = Record<string, any>;

export function useJourneyForm(
  journey: JourneyDefinition,
  currentStep: JourneyStep,
) {
  const { fields, mergeFields, services } = useJourneyStore();
  const { schema, stepFields } = buildJourneyFormSchema(journey);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    getFieldState,
    setValue,
    formState,
    watch,
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: useRef(fields).current,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const currentStepFields: string[] = stepFields[currentStep.id];
  function canProceedToNextStep() {
    const result = schema.safeParse(watch());

    if (result.success) true;

    const errors = new Set(
      result.error?.issues
        .map((issue) => issue.path[0] as string)
        .filter((key) => typeof key === "string"),
    );
    return !currentStepFields.some((field) => errors.has(field));
  }

  function applyPrefill() {
    if (!currentStep) return;

    const prefill = computePrefillValues(
      currentStep.elements,
      getValues(),
      services,
    );

    if (Object.keys(prefill).length === 0) return;

    for (const [key, value] of Object.entries(prefill)) {
      setValue(key as never, value as never, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false,
      });
    }

    mergeFields(prefill);
  }

  useEffect(() => {
    const currentState = journeyStore.getState();

    if (currentState._hasHydrated && Object.keys(currentState.fields).length > 0) {
      reset(currentState.fields as FormValues, { keepDirty: false, keepTouched: false });
    }

    const unsub = journeyStore.subscribe((state, prev) => {
      if (!prev._hasHydrated && state._hasHydrated) {
        reset(state.fields as FormValues, { keepDirty: false, keepTouched: false });
      }
    });
    return unsub;
  }, [reset]);

  useEffect(() => {
    applyPrefill();
  }, [currentStep, getValues, mergeFields, services, setValue]);

  return {
    schema,
    stepFields,
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    getFieldState,
    setValue,
    formState,
    currentStepFields,
    canProceed: canProceedToNextStep(),
  };
}
