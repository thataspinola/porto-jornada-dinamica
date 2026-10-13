import type { ReactNode } from "react";
export function JourneyWrapper({ children }: { children: ReactNode }) {
	return (
		<div style={{ maxWidth: "60rem", margin: "0 auto", padding: "1rem" }}>
			{children}
		</div>
	);
}
