import type { ReactNode } from "react";
export function FixedButtonWrapper({ children }: { children: ReactNode }) {
	return (
		<div
			style={{
				position: "sticky",
				bottom: 0,
				background: "white",
				padding: "1rem",
			}}
		>
			{children}
		</div>
	);
}
