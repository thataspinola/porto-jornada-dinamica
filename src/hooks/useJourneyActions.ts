import { journeyRegistryServices } from "@/services";
import { createJourneyStore } from "@/store";
import { useRouter } from "next/navigation";

export const useJourneyActions = (
  journeySlug: string,
  currentStepConfig: any,
) => {
  const useStore = createJourneyStore(journeySlug);
  const setLoading = useStore.getState().setLoading;
  const router = useRouter();

  const executeStepAction = async () => {
    const action = currentStepConfig.action;
    if (!action) return;

    if (action.type === "SERVICE_CALL") {
      try {
        setLoading(true);

        const serviceFn = journeyRegistryServices[action.service];
        const response = await serviceFn(useStore.getState().fields);

        if (response.success && action.onSuccess?.type === "NAVIGATE") {
          router.push(action.onSuccess.target);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (action.type === "NAVIGATE") {
      try {
        router.push(action.target);
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  return { executeStepAction };
};
