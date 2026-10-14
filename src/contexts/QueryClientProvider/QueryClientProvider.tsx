"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { QueryClientProvider as TanstackProvider } from "@tanstack/react-query";
import { QueryClient } from "@/lib/queryClient";
import { JourneyNotifier } from "@/components/Core/JourneyNotifier";
const QueryContext = createContext<QueryClient | null>(null);
export function QueryClientProvider({ children }: { children: ReactNode }) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: { queries: { retry: false, staleTime: 30000 } },
			}),
	);
	return (
		<QueryContext.Provider value={client}>
			<TanstackProvider client={client}>
				<JourneyNotifier />
				{children}
			</TanstackProvider>
		</QueryContext.Provider>
	);
}
export function useQueryClient() {
	const client = useContext(QueryContext);
	const [fallback] = useState(() => new QueryClient());
	return client ?? fallback;
}
