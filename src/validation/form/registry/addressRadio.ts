import { requiredString, optionalString } from "@/validation/primitives";
export const addressRadio = (required: boolean) =>
	required ? requiredString() : optionalString();
