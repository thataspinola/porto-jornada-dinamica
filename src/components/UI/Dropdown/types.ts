import type { HTMLAttributes } from "react";

export type DropdownOption = {
	value: string;
	label: string;
};

export type DropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
	variant?: "outlined" | "default";
	width?: "fluid" | "contain";
	disabled?: boolean;
	errorMessage?: string;
	helperText?: string;
	readOnly?: boolean;
	isLoading?: boolean;
	label?: string;
	options?: DropdownOption[];
	value?: string;
	name?: string;
	onChange?: (value: string) => void;
};
