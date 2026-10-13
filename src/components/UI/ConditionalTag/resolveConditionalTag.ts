import { evaluateConditions, type ConditionContext } from "@/utils";
import type { Condition } from "@/validation/schemas";
export const resolveConditionalTag = (
	conditions: Condition[],
	context: ConditionContext,
) => evaluateConditions(conditions, context);
