import type { ReactNode } from "react";
export function FeedbackView({
	title,
	children,
}: {
	title: string;
	children?: ReactNode;
}) {
	return (
		<output>
			<h2>{title}</h2>
			{children}
		</output>
	);
}
