"use client";
import { useId, useState, type ReactNode } from "react";
export function Tabs({
	items,
}: {
	items: { label: string; content: ReactNode }[];
}) {
	const [active, setActive] = useState(0);
	const id = useId();
	return (
		<section>
			<div role="tablist">
				{items.map((item, i) => (
					<button
						id={id + "-tab-" + i}
						aria-controls={id + "-panel"}
						key={item.label}
						type="button"
						role="tab"
						aria-selected={active === i}
						onClick={() => setActive(i)}
					>
						{item.label}
					</button>
				))}
			</div>
			<div
				role="tabpanel"
				id={id + "-panel"}
				aria-labelledby={id + "-tab-" + active}
			>
				{items[active]?.content}
			</div>
		</section>
	);
}
