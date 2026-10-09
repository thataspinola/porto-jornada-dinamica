import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
import { navigationElementSchema } from "./navigation.schema";
import { textElementSchema } from "./text.schema";
export const composableCardElementSchema = baseElementSchema.extend({
	type: z.literal("COMPOSABLE_CARD"),
	config: z.object({
		elements: z.array(z.union([textElementSchema, navigationElementSchema])),
	}),
});
