"use client";

import type { JourneyDefinition } from "@/validation/schemas";
import {
	type Control,
	Controller,
	type FieldErrors,
	type UseFormRegister,
} from "react-hook-form";
import { Checkbox } from "@/components/UI/Checkbox";
import type { FormValues } from "@/components/Elements/TextInputElement";

type CheckboxElementType = Extract<
	JourneyDefinition["steps"][number]["elements"][number],
	{ type: "CHECKBOX" }
>;

type CheckboxElementProps = {
	element: CheckboxElementType;
	register: UseFormRegister<FormValues>;
	control: Control<FormValues>;
	errors: FieldErrors<FormValues>;
};

export function CheckboxElement({
	element,
	register,
	control,
	errors,
}: CheckboxElementProps) {
	const { name, label } = element.config;

	return (
		<Controller
			control={control}
			name={name}
			defaultValue={element.config.defaultValue}
			render={({ field }) => (
				<Checkbox
					title={name}
					label={label.text}
					value={!!field.value}
					handleClick={() => field.onChange(!field.value)}
				/>
			)}
		/>
	);
}
