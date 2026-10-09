import { z } from "zod";
export const conditionSchema = z.object({
	source: z
		.enum(["fields", "formErrors", "business", "services"])
		.default("fields"),
	path: z.string().min(1),
	operator: z
		.enum(["equals", "notEquals", "exists", "notExists"])
		.default("equals"),
	value: z.unknown().optional(),
});
export const conditionsSchema = z.array(conditionSchema).optional().default([]);
export type Condition = z.infer<typeof conditionSchema>;
export const conditionActionSchema = z.object({
	type: z.literal("SET_ERROR"),
	field: z.string().min(1),
	message: z.string(),
});
