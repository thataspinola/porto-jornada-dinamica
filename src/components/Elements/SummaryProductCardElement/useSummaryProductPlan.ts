import type { CoveragePlan } from "@/components/Elements/PlanCardElement/hooks/coveragePlan";
export function useSummaryProductPlan(
	plans: CoveragePlan[],
	selectedId: string,
) {
	return plans.find((p) => p.id === selectedId);
}
