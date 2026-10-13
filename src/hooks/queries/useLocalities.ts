import { useRemoteQuery } from "./useRemoteQuery";
export function useLocalities<T = unknown>(url?: string) {
	return useRemoteQuery<T>(url);
}
