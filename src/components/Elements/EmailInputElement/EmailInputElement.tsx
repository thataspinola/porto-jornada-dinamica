"use client";

import { Input } from "@/components/UI/Input";
import type { JourneyDefinition } from "@/validation/schemas";
import { type Control, Controller } from "react-hook-form";

export type FormValues = Record<string, unknown>;

type EmailInputElementType = Extract<
	JourneyDefinition["steps"][number]["elements"][number],
	{ type: "EMAIL_INPUT" }
>;

type EmailInputElementProps = {
	element: EmailInputElementType;
	control: Control<FormValues>;
};

export function EmailInputElement({
	element,
	control,
}: EmailInputElementProps) {
	const config = element.config;

	return (
		<Controller
			control={control}
			name={config.name}
			defaultValue=""
			render={({ field, fieldState }) => (
				<Input
					name={field.name}
					type="email"
					label={config.label}
					value={String(field.value ?? "")}
					onChange={(value) => field.onChange(value)}
					variant="default"
					width="fluid"
					disabled={false}
					autoFocus={false}
					helperText=""
					errorMessage={fieldState.error?.message ?? ""}
				/>
			)}
		/>
	);
}
