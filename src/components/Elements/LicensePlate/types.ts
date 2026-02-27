import type { HTMLAttributes } from "react";

export type LicensePlateProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	"onChange"
> & {
	label?: string;
	placeholder?: string;
	name?: string;
	value?: string;
	variant?: "outlined" | "default";
	width?: "fluid" | "contain";
	disabled?: boolean;
	isLoading?: boolean;
	helperText?: string;
	errorMessage?: string;
	onChange?: (value: string) => void;
};
