import type {
	ConditionCheck,
	ConditionOperand,
	ConditionRule,
} from "@/validation/schemas/elements/conditions.schema";
import { getByPath } from "@/utils/getByPath";
import type { ConditionContext } from "./index";
export type EvaluationResult =
	| { matched: true; rule: ConditionRule }
	| { matched: false };
function operand(value: ConditionOperand | undefined, ctx: ConditionContext) {
	if (!value) return undefined;
	return "from" in value ? getByPath(ctx[value.from], value.path) : value.value;
}
function numeric(value: unknown) {
	if (typeof value === "number")
		return Number.isFinite(value) ? value : undefined;
	if (typeof value !== "string" || !value.trim()) return undefined;
	const result = Number(value);
	return Number.isFinite(result) ? result : undefined;
}
function equals(left: unknown, right: unknown) {
	if (left === right) return true;
	const a = numeric(left),
		b = numeric(right);
	return a !== undefined && b !== undefined && a === b;
}
export function evaluateCheck(check: ConditionCheck, ctx: ConditionContext) {
	const left = operand(check.left, ctx),
		right = operand(check.right, ctx);
	const exists =
		left !== undefined &&
		left !== null &&
		(typeof left !== "string" || !!left.trim());
	const a = numeric(left),
		b = numeric(right);
	switch (check.op) {
		case "EQUAL":
			return equals(left, right);
		case "NOT_EQUAL":
			return !equals(left, right);
		case "EXISTS":
			return exists;
		case "NOT_EXISTS":
			return !exists;
		case "INCLUDES":
			return Array.isArray(left)
				? left.some((v) => equals(v, right))
				: typeof left === "string" &&
						typeof right === "string" &&
						left.includes(right);
		case "GREATER_THAN":
			return a !== undefined && b !== undefined && a > b;
		case "GREATER_THAN_OR_EQUAL":
			return a !== undefined && b !== undefined && a >= b;
		case "LESS_THAN":
			return a !== undefined && b !== undefined && a < b;
		case "LESS_THAN_OR_EQUAL":
			return a !== undefined && b !== undefined && a <= b;
	}
}
export function evaluateRule(rule: ConditionRule, ctx: ConditionContext) {
	return (
		rule.checks.length > 0 &&
		rule.checks.every((check) => evaluateCheck(check, ctx))
	);
}
export function evaluateConditionRules(
	rules: ConditionRule[] | undefined,
	ctx: ConditionContext,
): EvaluationResult {
	const rule = rules?.find((rule) => evaluateRule(rule, ctx));
	return rule ? { matched: true, rule } : { matched: false };
}
