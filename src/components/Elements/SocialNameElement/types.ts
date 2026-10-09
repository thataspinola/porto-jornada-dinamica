import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { JourneyDefinition } from "../../../validation/schemaValidation";

export type FormValues = Record<string, unknown>;

export type CheckboxElementType = Extract<
	JourneyDefinition["steps"][number]["elements"][number],
	{ type: "SOCIAL_NAME" }
>;

export type SocialNameElementProps = {
	element: CheckboxElementType;
	register: UseFormRegister<FormValues>;
	control: Control<FormValues>;
	errors: FieldErrors<FormValues>;
};
