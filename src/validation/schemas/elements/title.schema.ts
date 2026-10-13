import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
import { typographyUiSchema } from "./elementUi.schema";

export const titleElementSchema = baseElementSchema.extend({
	type: z.literal("TITLE"),
	config: z.object({
		text: z.string(),
		size: z.enum(["sm", "md", "lg"]).optional(),
		ui: typographyUiSchema,
	}),
});
