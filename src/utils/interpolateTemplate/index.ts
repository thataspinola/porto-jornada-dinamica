import { getByPath } from "@/utils/getByPath";
export function interpolateTemplate(
	template: string,
	context: Record<string, unknown>,
	options: { keepMissing?: boolean } = {},
) {
	return template.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (match, path: string) => {
		const value = getByPath(context, path.trim());
		return value == null ? (options.keepMissing ? match : "") : String(value);
	});
}
