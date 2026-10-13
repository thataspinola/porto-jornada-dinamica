export type CoveragePlan = {
	id: string;
	title: string;
	coverages: { name: string; description?: string }[];
};
export function coveragePlan(plans: CoveragePlan[], id: string) {
	return plans.find((plan) => plan.id === id)?.coverages ?? [];
}
