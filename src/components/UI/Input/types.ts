import type { HTMLInputTypeAttribute, HTMLAttributes } from "react";

export type InputProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
	label?: string;
	type?: HTMLInputTypeAttribute;
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
