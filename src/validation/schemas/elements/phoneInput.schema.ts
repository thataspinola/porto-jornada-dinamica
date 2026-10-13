import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
import { inputUiSchema } from "./elementUi.schemas";

export const phoneInputElementSchema = baseElementSchema.extend({
	type: z.literal("PHONE_INPUT"),
	config: z.object({
		label: z.string(),
		placeholder: z.string().optional(),
		required: z.boolean().default(false),
		name: z.string(),
		defaultValue: z.string().optional(),
		defaultValueFrom: z.any().optional(),
		ui: inputUiSchema,
	}),
});
