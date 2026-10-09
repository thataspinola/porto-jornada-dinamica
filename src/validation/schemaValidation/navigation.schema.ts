import { z } from "zod";
import { baseElementSchema } from "./base.schema";
import { linkUiSchema } from "./elementUi.schemas";

export const navigationElementSchema = baseElementSchema.extend({
	type: z.literal("NAVIGATION"),
	config: z.object({
		label: z.string(),
		url: z.string().optional().default(""),
		ui: linkUiSchema,
	}),
});
