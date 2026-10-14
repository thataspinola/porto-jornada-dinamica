import { QueryClient as TanstackQueryClient } from "@tanstack/react-query";
export class QueryClient extends TanstackQueryClient {
	fetch<T>(key: string, load: () => Promise<T>) {
		return this.fetchQuery({ queryKey: [key], queryFn: load });
	}
	invalidate(key?: string) {
		return this.invalidateQueries(key ? { queryKey: [key] } : {});
	}
}
export const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false, staleTime: 30000 } },
});
