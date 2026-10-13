import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
export const priceSelectorElementSchema = baseElementSchema.extend({
	type: z.literal("PRICE_SELECTOR"),
	config: z.looseObject({
		label: z.string().optional(),
		text: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		required: z.boolean().default(false),
		placeholder: z.string().optional(),
		defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
		sourcePath: z.string().optional(),
		url: z.string().optional(),
		options: z
			.array(z.object({ label: z.string(), value: z.string() }))
			.default([]),
		elements: z
			.array(
				z.looseObject({
					id: z.string(),
					type: z.string(),
					config: z.record(z.string(), z.unknown()),
				}),
			)
			.default([]),
		items: z
			.array(
				z.looseObject({
					id: z.string().optional(),
					title: z.string().optional(),
					description: z.string().optional(),
					url: z.string().optional(),
				}),
			)
			.default([]),
		min: z.number().optional(),
		max: z.number().optional(),
		name: z.string().min(1),
	}),
});
