import { toSnakeCase } from "@/utils/toSnakeCase";
export function normalizeVertical(value: string) {
	return toSnakeCase(value.trim());
}
