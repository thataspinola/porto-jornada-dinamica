import { evaluateConditions } from "@/utils";
import type { ConditionalWrapperElementProps } from "./types";
export function useConditionalVisibility(element: ConditionalWrapperElementProps["element"], context: ConditionalWrapperElementProps["context"]): boolean {
	return evaluateConditions(element.config.conditions, context);
}
