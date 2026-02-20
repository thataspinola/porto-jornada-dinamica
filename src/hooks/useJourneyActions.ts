import { journeyRegistryServices } from "@/services";
import { createJourneyStore } from "@/store";
import { useRouter } from "next/navigation";

export const useJourneyActions = (
  journeySlug: string,
  currentStepConfig: any,
) => {
  const router = useRouter();
  const useStore = createJourneyStore(journeySlug);
  const fields = useStore.getState().fields;
  const setError = useStore.getState().setError;

  const executeStepAction = async () => {
    const action = currentStepConfig.action;
    if (!action) return;

    console.log("currentStepConfig", currentStepConfig.action);
    if (action.type === "SERVICE_CALL") {
      try {
        const serviceFunction = journeyRegistryServices[action.service];
        const response = await serviceFunction(fields);

        if (response.success && action.onSuccess?.type === "NAVIGATE") {
          router.push(action.onSuccess.target);
        }
      } catch (err) {
        console.error("Erro na action de serviço:", err);
        setError("global", "Erro ao processar serviço.");
      }
      return;
    }

    if (action.type === "NAVIGATE") {
      router.push(action.target);
    }
  };

  return { executeStepAction };
};
