"use client";

import { Link } from "@/components/UI/Link";
import { joinPaths } from "@/utils/joinPaths";
import type { JourneyDefinition } from "@/validation/schemaValidation/journey.schema";

type JourneyElement = JourneyDefinition["steps"][number]["elements"][number];
type NavigationElementType = Extract<JourneyElement, { type: "NAVIGATION" }>;

type NavigationElementProps = {
	element: NavigationElementType;
	onNavigate: (stepSlug: string) => void;
	bussines: Record<string, unknown>;
};

export function NavigationElement({
	element,
	onNavigate,
}: NavigationElementProps) {
	const url = element.config.url?.trim() ?? "";
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

	const href = joinPaths(baseUrl, url);
	const ui = element.config.ui;

	return (
		<Link
			href={href}
			variant={ui?.variant}
			styles={ui?.styles}
			size={ui?.size}
			width={ui?.width}
			disabled={ui?.disabled}
			className={ui?.className}
			onClick={(event: { preventDefault: () => void }) => {
				event.preventDefault();
				onNavigate(url);
			}}
		>
			{element.config.label}
		</Link>
	);
}
