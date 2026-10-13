import { useRemoteQuery } from "./useRemoteQuery";
export function useAddress<T = unknown>(url?: string) {
	return useRemoteQuery<T>(url);
}
