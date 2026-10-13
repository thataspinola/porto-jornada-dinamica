import { apiService } from "@/services/apiService";
import type { OptionsSource, SelectOption } from "./types";
export async function optionsService(
	source: OptionsSource,
	signal?: AbortSignal,
): Promise<SelectOption[]> {
	const items = await apiService<Record<string, unknown>[]>({
		url: source.url,
		signal,
	});
	if (!Array.isArray(items)) throw new Error("Lista de opções inválida");
	return items.map((item) => ({
		label: String(item[source.labelKey ?? "label"] ?? ""),
		value: String(item[source.valueKey ?? "value"] ?? ""),
	}));
}
