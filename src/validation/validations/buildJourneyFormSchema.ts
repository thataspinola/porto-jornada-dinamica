import { z } from "zod";
import type { JourneyDefinition } from "@/validation/schemas";
import { buildStepFormSchema } from "@/validation/form";
export function buildJourneyFormSchema(journey: JourneyDefinition) {
	const shape: Record<string, z.ZodType> = {};
	const stepFields: Record<string, string[]> = {};
	for (const step of journey.steps) {
		const result = buildStepFormSchema(step.elements);
		Object.assign(shape, result.schema.shape);
		stepFields[step.id] = result.fields;
	}
	return { schema: z.object(shape), stepFields };
}
