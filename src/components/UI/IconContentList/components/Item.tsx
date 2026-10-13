import type { ReactNode } from "react";
export function Item({ children }: { children: ReactNode }) {
	return <li>{children}</li>;
}
