import type { ReactNode } from "react";
export function FixedWrapper({ children }: { children: ReactNode }) {
	return <aside style={{ position: "sticky", top: 0 }}>{children}</aside>;
}
