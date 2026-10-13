import { useRemoteQuery } from "./useRemoteQuery";
export function useStates<T = unknown>(url?: string) {
	return useRemoteQuery<T>(url);
}
