/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */

import { clsx } from "@/utils";
import { useState } from "react";

import "./Textarea.scss";

import type { TextareaProps } from "./types";

export const Textarea = ({
	className = "",
	name = "",
	variant = "default",
	width = "contain",
	value = "",
	label = "",
	onChange,
	disabled = false,
	rows = 5,
	helperText = "",
	errorMessage = "",
	children,
	...props
}: TextareaProps) => {
	const [focused, setFocused] = useState(false);
	const isError = errorMessage.length > 0;
	const isFilled = value.toString().length > 0;

	const handleFocus = (isFocus: boolean) => {
		if (disabled || isError) return;
		setFocused(isFocus);
	};

	const classes = clsx(
		"textarea__root",
		`--${variant}`,
		`--${width}`,
		{
			"--filled": isFilled,
			"--focused": focused,
			"--disabled": disabled,
			"--error": isError,
		},
		className,
	);

	return (
		<div
			onFocus={() => handleFocus(true)}
			onBlur={() => handleFocus(false)}
			className={classes}
			{...props}
		>
			{label && (
				<label htmlFor={name} className="textarea__label">
					{label}
				</label>
			)}
			<textarea
				id={name}
				name={name}
				className="textarea__field"
				rows={rows}
				value={value}
				disabled={disabled}
				onChange={(e) => onChange(e.target.value)}
			/>
			<span className="textarea__counter">{value.toString().length} / 200</span>
			{helperText && !isError && (
				<p className="input__helper-text">{helperText}</p>
			)}
			{isError && <p className="input__error-message">{errorMessage}</p>}
		</div>
	);
};
