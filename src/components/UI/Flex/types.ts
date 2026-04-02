import type { CSSProperties, ReactNode } from "react";

export type FlexProps = {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
	as?: keyof React.JSX.IntrinsicElements;
	direction?: CSSProperties["flexDirection"];
	align?: CSSProperties["alignItems"];
	justify?: CSSProperties["justifyContent"];
	wrap?: CSSProperties["flexWrap"];
	gap?: CSSProperties["gap"];
	inline?: boolean;
};
