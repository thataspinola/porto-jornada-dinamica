import { interpolateTemplate } from "@/utils/interpolateTemplate";
export function resolveTemplates(
	value: unknown,
	context: Record<string, unknown>,
): unknown {
	if (typeof value === "string") return interpolateTemplate(value, context);
	if (Array.isArray(value))
		return value.map((v) => resolveTemplates(v, context));
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value).map(([k, v]) => [k, resolveTemplates(v, context)]),
		);
	return value;
}
