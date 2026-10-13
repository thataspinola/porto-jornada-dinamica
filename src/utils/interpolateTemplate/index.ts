import { getByPath } from "@/utils/getByPath";
export function interpolateTemplate(
	template: string,
	context: Record<string, unknown>,
) {
	return template.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_, path: string) => {
		const value = getByPath(context, path.trim());
		return value == null ? "" : String(value);
	});
}
