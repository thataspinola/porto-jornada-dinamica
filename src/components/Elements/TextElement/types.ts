import type { z } from "zod";
import type { textElementSchema } from "@/validation/schemas";
export type TextElementProps = {
	element: z.infer<typeof textElementSchema>;
};
