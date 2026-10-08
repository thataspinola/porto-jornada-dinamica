"use client";

import { useState } from "react";
import { useServiceErrorHandler, type SetFormError } from "./useServiceErrorHandler";
import type {
  UseFormGetFieldState,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormTrigger,
} from "react-hook-form";

import { useJourneyStore } from "@/store";
import { redirectTo } from "@/utils";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";
import { callService } from "../services";

type FormValues = Record<string, unknown>;

type JourneyStep = JourneyDefinition["steps"][number];

export type GoNextOptions =
  | { type: "navigation"; targetSlug: string }
  | { type: "service"; serviceName: string; targetSlug: string }
  | { type: "next" };

type SubmittedPayload = {
  fields: FormValues;
  error: Record<string, unknown>;
  business: Record<string, unknown>;
  services: Record<string, unknown>;
};

export type UseJourneyNavigationParams = {
  setFormError: SetFormError;
  journeySlug: string;
  steps: JourneyDefinition["steps"];
  currentStep: JourneyStep | null;
  currentStepIndex: number;
  currentStepFields: string[];
  getValues: UseFormGetValues<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  trigger: UseFormTrigger<FormValues>;
  getFieldState: UseFormGetFieldState<FormValues>;
};

export function useJourneyNavigation({
  setFormError,
  journeySlug,
  steps,
  currentStep,
  currentStepIndex,
  currentStepFields,
  getValues,
  handleSubmit,
  trigger,
  getFieldState,
}: UseJourneyNavigationParams) {
  const handleServiceError = useServiceErrorHandler(setFormError);
  const { mergeFields, setError, mergeServices, business, services } =
    useJourneyStore();
  const [submitted, setSubmitted] = useState<SubmittedPayload | null>(null);

  async function validateCurrentStep() {
    if (!currentStep || currentStepFields.length === 0) return true;

    const ok = await trigger(currentStepFields);

    if (!ok) {
      const fieldErrors: FormValues = {};

      for (const field of currentStepFields) {
        const message = getFieldState(field).error?.message;
        if (message) fieldErrors[field] = message;
      }
      setError(fieldErrors);
      return false;
    }

    setError({});
    mergeFields(getValues());
    return true;
  }

  async function goNext(options: GoNextOptions) {
    if (!currentStep) return;

    const valid = await validateCurrentStep();
    if (!valid) return;

    console.log('goNext:', options);

    if (options.type === "service") {
      const input = getValues();

      const result = await callService(options.serviceName, {
        serviceName: options.serviceName,
        fields: input,
        business,
      });

      mergeServices({ [options.serviceName]: result });

      if (!result.success) {
        const cpf = currentStep.elements.find((element) => element.type === "CPF_INPUT");
        handleServiceError(result, journeySlug, cpf?.config.name ?? "taxvat");
        setError({ service: result.error });
        return;
      }

      redirectTo(options.targetSlug);
      return;
    }

    if (options.type === "navigation") {
      redirectTo(options.targetSlug);
      return;
    }

    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      redirectTo(nextStep.slug);
      return;
    }

    handleSubmit((values) => {
      mergeFields(values);
      setError({});
      setSubmitted({ fields: values, error: {}, business, services });
    })();
  }

  function goPrev() {
    if (!currentStep?.backStepSlug) return;
    const backStepSlug = currentStep.backStepSlug;

    mergeFields(getValues());

    if (backStepSlug === "/") {
      redirectTo("/");
      return;
    }
    redirectTo(backStepSlug);
  }

  return { goNext, goPrev, submitted, setSubmitted };
}
