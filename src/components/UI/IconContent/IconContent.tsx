import type { ReactNode } from "react";
export function IconContent({
	icon,
	title,
	children,
}: {
	icon?: ReactNode;
	title: string;
	children?: ReactNode;
}) {
	return (
		<article>
			{icon}
			<h3>{title}</h3>
			{children}
		</article>
	);
}
