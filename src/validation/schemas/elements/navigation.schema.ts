import { z } from "zod";
import { baseElementSchema } from "./baseElement.schema";
export const navigationElementSchema = baseElementSchema.extend({
	type: z.literal("NAVIGATION"),
	config: z.object({ label: z.string(), url: z.string() }),
});
