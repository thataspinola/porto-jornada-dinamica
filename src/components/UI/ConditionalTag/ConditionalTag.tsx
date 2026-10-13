import type { ReactNode } from "react";
export function ConditionalTag({
	visible,
	children,
}: {
	visible: boolean;
	children: ReactNode;
}) {
	return visible ? <>{children}</> : null;
}
