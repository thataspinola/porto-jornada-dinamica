import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
import { conditionsSchema } from "./conditions.schema";
export const conditionalWrapperElementSchema = baseElementSchema.extend({
	type: z.literal("CONDITIONAL_WRAPPER"),
	config: z.object({
		conditions: conditionsSchema,
		elements: z.array(z.object({
			id: z.string(), type: z.string(), order: z.number().optional(),
			config: z.record(z.string(), z.unknown()),
		})),
	}),
});
