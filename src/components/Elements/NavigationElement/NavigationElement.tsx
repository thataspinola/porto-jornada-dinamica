"use client";

import { Link } from "@/components/UI/Link";
import { joinPaths } from "@/utils/joinPaths";
import type { JourneyDefinition } from "@/validation/schemas";

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
	const ui = element.config;

	return (
		<Link
			href={href}
			variant="insurance"
			styles={
				ui?.styles === "ghost"
					? "ghost"
					: ui?.styles === "stroke"
						? "secondary"
						: "primary"
			}
			size={ui?.size === "sm" ? "small" : "large"}
			className={ui?.className}
			disabled={ui.disabled}
			onClick={(event: { preventDefault: () => void }) => {
				event.preventDefault();
				if (ui.disabled) return;
				onNavigate(url);
			}}
		>
			{element.config.label}
		</Link>
	);
}
