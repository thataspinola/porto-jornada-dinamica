"use client";
import { useEffect, useState } from "react";
import { prefetchActions } from "@/utils/prefetchActions";
export function usePrefetch(actions: { service: string; input?: unknown }[]) {
	const [state, setState] = useState({ isLoading: true, error: "" });
	useEffect(() => {
		let active = true;
		prefetchActions(actions).then(
			(results) => {
				if (active)
					setState({
						isLoading: false,
						error: results.some((r) => !r.success)
							? "Não foi possível carregar os dados"
							: "",
					});
			},
			() => {
				if (active)
					setState({
						isLoading: false,
						error: "Não foi possível carregar os dados",
					});
			},
		);
		return () => {
			active = false;
		};
	}, [actions]);
	return state;
}
