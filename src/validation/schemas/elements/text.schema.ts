import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
export const textElementSchema = baseElementSchema.extend({
	type: z.literal("TEXT"),
	config: z.object({ text: z.string() }),
});
