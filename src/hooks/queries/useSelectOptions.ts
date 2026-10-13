import { useRemoteQuery } from "./useRemoteQuery";
export function useSelectOptions<T = unknown>(url?: string) {
	return useRemoteQuery<T>(url);
}
