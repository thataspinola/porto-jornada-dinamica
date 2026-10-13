import { z } from "zod";
import { fieldSchema } from "./elementRegistry";
export type FormElement = {
	type: string;
	config: {
		[key: string]: unknown;
		name?: string;
		required?: boolean;
		elements?: FormElement[];
	};
};
export function buildStepFormSchema(elements: FormElement[]) {
	const shape: Record<string, z.ZodType> = {};
	const visit = (items: FormElement[]) => {
		for (const item of items) {
			if (item.config.name)
				shape[item.config.name] = fieldSchema(
					item.type,
					!!item.config.required,
				);
			if (item.config.elements) visit(item.config.elements);
		}
	};
	visit(elements);
	return { schema: z.object(shape), fields: Object.keys(shape) };
}
