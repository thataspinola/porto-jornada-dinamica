import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
import { typographyUiSchema } from "./elementUi.schemas";

export const paragraphElementSchema = baseElementSchema.extend({
	type: z.literal("PARAGRAPH"),
	config: z.object({
		text: z.string(),
		ui: typographyUiSchema,
	}),
});
