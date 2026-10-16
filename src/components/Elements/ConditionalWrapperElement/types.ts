import type { ReactNode } from "react";
import type { z } from "zod";
import type { ConditionContext } from "@/utils";
import type { conditionalWrapperElementSchema } from "@/validation/schemas";
export type ConditionalWrapperElementType = z.infer<
	typeof conditionalWrapperElementSchema
>;
export type ConditionalWrapperElementProps = {
	element: ConditionalWrapperElementType;
	context: ConditionContext;
	journeySlug: string;
	renderElement: (
		element: ConditionalWrapperElementType["config"]["children"][number],
	) => ReactNode;
};
