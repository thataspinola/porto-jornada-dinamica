import { createJourneyStore } from "@/store";
import type { Element } from "@/types";
import { ValidationBuilder } from "@/validations";

export const useJourneyValidation = (
  journeySlug: string,
  elements: Element[],
) => {
  const useStore = createJourneyStore(journeySlug);
  const fields = useStore.getState().fields;
  const setError = useStore.getState().setError;
  const clearErrors = useStore.getState().clearErrors;

  const validateStep = () => {
    clearErrors();
    let isValid = true;

    for (const element of elements) {
      if (element.dependsOn) {
        const { field, value: expectedValue } = element.dependsOn;
        if (fields[field] !== expectedValue) continue;
      }

      const validator = ValidationBuilder.fromJson(element.rules || []);

      const error = validator.validate(fields[element.id]);
      console.log('validateStep', error)
      if (error) {
        setError(element.id, error);
        isValid = false;
      }
    }

    return isValid;
  };

  return {
    validateStep,
    errors: useStore((state: any) => state.errors),
  };
};
