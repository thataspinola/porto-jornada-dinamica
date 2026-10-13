import { useRemoteQuery } from "./useRemoteQuery";
export function useAddresses<T = unknown>(url?: string) {
	return useRemoteQuery<T>(url);
}
