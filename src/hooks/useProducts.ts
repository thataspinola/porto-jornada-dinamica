import { useRemoteQuery } from "@/hooks/queries/useRemoteQuery";
export function useProducts<T = unknown>(url?: string) {
	return useRemoteQuery<T[]>(url);
}
