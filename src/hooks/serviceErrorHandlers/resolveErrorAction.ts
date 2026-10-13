import type { ServiceErrorRule } from "./types";
export function resolveErrorAction(code: string, rules: ServiceErrorRule[]) {
	return rules.find((rule) => rule.code === code)?.action;
}
