import type { ReactNode } from "react";
export function Icon({
	label,
	children,
}: {
	label?: string;
	children?: ReactNode;
}) {
	return label ? (
		<span role="img" aria-label={label}>
			{children}
		</span>
	) : (
		<span aria-hidden="true">{children}</span>
	);
}
