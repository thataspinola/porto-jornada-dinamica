"use client";
import type { ReactNode } from "react";
import { usePrefetch } from "./usePrefetch";
export function PrefetchedStep({
	actions,
	children,
}: {
	actions: { service: string; input?: unknown }[];
	children: ReactNode;
}) {
	const state = usePrefetch(actions);
	if (state.isLoading) return <output>Carregando...</output>;
	if (state.error) return <p role="alert">{state.error}</p>;
	return <>{children}</>;
}
