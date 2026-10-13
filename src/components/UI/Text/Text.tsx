import type { ReactNode } from "react";
export function Text({ children }: { children: ReactNode }) {
	return <p>{children}</p>;
}
