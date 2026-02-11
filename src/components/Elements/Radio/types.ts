import type { HTMLAttributes } from "react";

export type RadioProps = HTMLAttributes<HTMLDivElement> & {
	variant?: "default" | "checked" | "disabled";
	description?: string;
};
