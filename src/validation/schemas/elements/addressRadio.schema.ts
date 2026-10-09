import { z } from "zod";

import { baseElementSchema } from "./baseElement.schema";

export const addressRadioElementSchema = baseElementSchema.extend({
	type: z.literal("ADDRESS_RADIO"),
	config: z.object({
		name: z.string(),
		sourcePath: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
		required: z.boolean().default(true),
		variant: z.enum(["default", "bordered", "contained"]).default("contained"),
		backgroundColor: z.string().optional(),
	}),
});
