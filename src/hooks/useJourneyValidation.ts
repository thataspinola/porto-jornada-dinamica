import { createJourneyStore } from "@/store";
import { ValidationBuilder } from "@/validations";

export const useJourneyValidation = (journeySlug: string, elements: any[]) => {
  const useStore = createJourneyStore(journeySlug);
  const fields = useStore.getState().fields;
  const setError = useStore.getState().setError;
  const clearErrors = useStore.getState().clearErrors;

  const validateStep = () => {
    clearErrors();
    let isValid = true;

    for (const element of elements) {
      // 1. Verifica Condicional (dependsOn)
      if (element.dependsOn) {
        const { field, value: expectedValue } = element.dependsOn;
        if (fields[field] !== expectedValue) continue;
      }

      // 2. Monta o validador via Builder (POO)
      const validator = ValidationBuilder.fromJson(element.rules || []);

      // 3. Executa a validação (Composite)
      const error = validator.validate(fields[element.id]);

      if (error) {
        setError(element.id, error);
        isValid = false;
      }
    }

    return isValid;
  };

  return {
    validateStep,
    errors: useStore((state: any) => state.errors)
  };
};
