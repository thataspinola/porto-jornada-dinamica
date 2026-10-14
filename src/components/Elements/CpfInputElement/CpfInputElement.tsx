"use client";

import { Input } from "@/components/UI/Input";
import type { JourneyDefinition } from "@/validation/schemas";
import { type Control, Controller } from "react-hook-form";

type FormValues = Record<string, unknown>;

type CpfInputElementType = Extract<
	JourneyDefinition["steps"][number]["elements"][number],
	{ type: "CPF_INPUT" }
>;

type CpfInputElementProps = {
	element: CpfInputElementType;
	control: Control<FormValues>;
};

export function CpfInputElement({ element, control }: CpfInputElementProps) {
	const { name, label, defaultValue } = element.config;
	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue}
			render={({ field, fieldState }) => (
				<Input
					name={field.name}
					label={label}
					value={typeof field.value === "string" ? field.value : ""}
					onChange={field.onChange}
					variant="default"
					errorMessage={fieldState.error?.message ?? ""}
				/>
			)}
		/>
	);
}
