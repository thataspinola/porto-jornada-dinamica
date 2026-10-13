import { z } from "zod";
export const validationsSchema = z
	.object({
		required: z.boolean().optional(),
		minLength: z.number().int().nonnegative().optional(),
		maxLength: z.number().int().nonnegative().optional(),
		pattern: z.string().optional(),
		min: z.number().optional(),
		max: z.number().optional(),
	})
	.optional();
