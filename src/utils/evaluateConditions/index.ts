import type { Condition } from "@/validation/schemas";
import { getByPath } from "@/utils/getByPath";
export type ConditionContext = {
	fields?: Record<string, unknown>;
	formErrors?: Record<string, unknown>;
	business?: Record<string, unknown>;
	services?: Record<string, unknown>;
};
export function evaluateConditions(
  rules: ConditionRule[] | undefined,
  ctx: EvaluationContext
): EvaluationResult {
  if (!rules || rules.length === 0) {
    return {
      matched: false,
    }
  }

  for (const rule of rules) {
    if (evaluateRule(rule, ctx)) {
      return {
        matched: true,
        rule,
      }
    }
  }

  return {
    matched: false,
  }
}
