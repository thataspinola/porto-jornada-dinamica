import { evaluateConditions, type ConditionContext } from "@/utils";
import type { Condition } from "@/validation/schemas";
export function useConditionGuard(
	conditions: Condition[],
	context: ConditionContext,
) {
	return evaluateConditions(conditions, context);
}
