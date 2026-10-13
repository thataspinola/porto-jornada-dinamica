"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { QueryClient } from "@/lib/queryClient";
const QueryContext = createContext<QueryClient | null>(null);
export function QueryClientProvider({ children }: { children: ReactNode }) {
	const [client] = useState(() => new QueryClient());
	return (
		<QueryContext.Provider value={client}>{children}</QueryContext.Provider>
	);
}
export function useQueryClient() {
	const client = useContext(QueryContext);
	const [fallback] = useState(() => new QueryClient());
	return client ?? fallback;
}
