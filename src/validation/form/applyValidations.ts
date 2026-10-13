import type { z } from "zod";
export function applyValidations(
	schema: z.ZodString,
	config: { minLength?: number; maxLength?: number; pattern?: string },
) {
	let result = schema;
	if (config.minLength !== undefined)
		result = result.min(config.minLength, "Texto muito curto");
	if (config.maxLength !== undefined)
		result = result.max(config.maxLength, "Texto muito longo");
	if (config.pattern)
		result = result.regex(new RegExp(config.pattern), "Formato inválido");
	return result;
}
