import type { HTMLAttributes, ReactNode } from "react";

export interface IconProps {
	iconName?: string;
	[key: string]: unknown;
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	isOpen: boolean;
	variant?: "small" | "medium" | "large";
	title?: ReactNode;
	subtitle?: ReactNode;
	description?: ReactNode;
	icon?: IconProps;
	children?: ReactNode;
	footer?: ReactNode;
	footerVariant?: "column" | "row";
	onClose?: () => void;
}
