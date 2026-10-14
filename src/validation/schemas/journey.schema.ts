import { z } from "zod";

import { journeyStepSchema } from "./journeyStep.schema";
import { prefetchSchema } from "./prefetch.schema";
import { serviceErrorsSchema } from "./serviceErrors.schema";

const completionSchema = z.object({
	type: z.string(),
});

const analyticsSchema = z.object({
	category: z.string(),
	vertical: z.string(),
	product: z.string(),
	funnel: z.string().default("pdp"),
	subProduct: z.string().default(""),
});

export const journeySchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	product: z.string().optional(),
	variant: z.enum(["app", "web"]).default("web"),
	defaultFields: z.record(z.string(), z.string()).optional(),
	completion: completionSchema.optional(),
	steps: z.array(journeyStepSchema),
	whatsapp: z
		.object({
			link: z.url(),
			exclude: z.array(z.string()).optional(),
		})
		.optional(),
	prefetch: z
		.union([prefetchSchema, z.array(prefetchSchema).min(1)])
		.optional(),
	errors: serviceErrorsSchema,
	analytics: analyticsSchema.optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type JourneyDefinition = z.infer<typeof journeySchema>;
