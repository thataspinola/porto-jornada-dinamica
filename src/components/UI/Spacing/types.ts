import type { CSSProperties, ReactNode } from "react";

export type SpacingSize = string | number;

export type SpacingProps = {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	top?: SpacingSize;
	bottom?: SpacingSize;
	left?: SpacingSize;
	right?: SpacingSize;
	inline?: boolean;
};
