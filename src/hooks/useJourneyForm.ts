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

  const currentStepFields: string[] = stepFields[currentStep.id]; // Pega os campos do passo atual, ou um array vazio se currentStep for null

  function canProceedToNextStep() {
    const result = schema.safeParse(watch()); // Pega os valores atuais do formulário e valida contra o esquema

    if (result.success) true;

    const errors = new Set(
      result.error?.issues
        .map((issue) => issue.path[0] as string)
        .filter((key) => typeof key === "string"),
    ); // Pega os campos que possuem erros de validação

    return !currentStepFields.some((field) => errors.has(field)); // Verifica se algum dos campos do passo atual tem erro, se tiver, não pode prosseguir.
  }

  function applyPrefill() {
    if (!currentStep) return;

    const prefill = computePrefillValues(
      currentStep.elements,
      getValues(),
      services,
    );

    if (Object.keys(prefill).length === 0) return;

    // Atualiza cada campo no React Hook Form
    for (const [key, value] of Object.entries(prefill)) {
      setValue(key as never, value as never, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false,
      });
    }

    // Sincroniza os novos valores com a Store global do Zustand
    mergeFields(prefill);
  }

  /**
 * EFEITO DE HIDRATAÇÃO:
 * Sincroniza o formulário quando os dados chegam do sessionStorage (Zustand Persist).
 */
  useEffect(() => {
    const currentState = journeyStore.getState();

    // Caso 1: O dado já está pronto no momento que o hook carrega
    if (currentState._hasHydrated && Object.keys(currentState.fields).length > 0) {
      reset(currentState.fields as FormValues, { keepDirty: false, keepTouched: false });
    }

    // Caso 2: O dado chega depois (assíncrono). Subscrevemos à store para ouvir a mudança de _hasHydrated.
    const unsub = journeyStore.subscribe((state, prev) => {
      if (!prev._hasHydrated && state._hasHydrated) {
        reset(state.fields as FormValues, { keepDirty: false, keepTouched: false });
      }
    });
    return unsub; // Limpa a subscrição ao desmontar o componente
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
