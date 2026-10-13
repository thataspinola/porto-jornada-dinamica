"use client";
import { useSimulatedProgress } from "./useSimulatedProgress";
export function LoadingScreen({
	complete = false,
	label = "Carregando...",
}: {
	complete?: boolean;
	label?: string;
}) {
	const value = useSimulatedProgress(complete);
	return (
		<output>
			{label}
			<progress value={value} max={100} />
		</output>
	);
}
