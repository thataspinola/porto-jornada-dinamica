import { evaluateCheck } from "@/utils/evaluateConditions";
import type { ConditionalWrapperElementProps } from "./types";
export function useConditionalVisibility(
	element: ConditionalWrapperElementProps["element"],
	context: ConditionalWrapperElementProps["context"],
): boolean {
	return element.config.checks.every((check) => evaluateCheck(check, context));
}
