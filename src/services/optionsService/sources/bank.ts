import { optionsService } from "@/services/optionsService";
export function bankOptions(url: string, signal?: AbortSignal) {
	return optionsService({ url, labelKey: "name", valueKey: "code" }, signal);
}
