import type { Condition } from "@/validation/schemas";
import { getByPath } from "../getByPath";
export type ConditionContext = {
	fields?: Record<string, unknown>;
	formErrors?: Record<string, unknown>;
	business?: Record<string, unknown>;
	services?: Record<string, unknown>;
};
export function evaluateConditions(conditions: Condition[], context: ConditionContext): boolean {
	return conditions.every((condition) => {
		const actual = getByPath(context[condition.source], condition.path);
		switch (condition.operator) {
			case "equals": return actual === condition.value;
			case "notEquals": return actual !== condition.value;
			case "exists": return actual !== undefined && actual !== null;
			case "notExists": return actual === undefined || actual === null;
		}
	});
}
