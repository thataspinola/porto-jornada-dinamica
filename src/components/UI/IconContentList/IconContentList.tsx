import type { ReactNode } from "react";
export function IconContentList({
	items,
}: {
	items: { id: string; content: ReactNode }[];
}) {
	return (
		<ul>
			{items.map((item) => (
				<li key={item.id}>{item.content}</li>
			))}
		</ul>
	);
}
