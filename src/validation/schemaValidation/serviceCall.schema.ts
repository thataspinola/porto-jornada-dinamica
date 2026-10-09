import { z } from "zod";
import { baseElementSchema } from "./base.schema";
import { buttonUiSchema } from "./elementUi.schemas";

export const serviceCallElementSchema = baseElementSchema.extend({
	type: z.literal("SERVICE_CALL"),
	config: z.object({
		label: z.string(),
		service: z.string(),
		targetStepOnSuccess: z.string(),
		ui: buttonUiSchema,
	}),
});
