import { useSummaryProductPlan } from "./useSummaryProductPlan";
test("não seleciona outro plano", () => {
	const plans = [{ id: "a", title: "A", coverages: [] }];
	expect(useSummaryProductPlan(plans, "b")).toBeUndefined();
	expect(useSummaryProductPlan(plans, "a")).toEqual(plans[0]);
});
