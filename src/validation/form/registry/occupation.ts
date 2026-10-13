import { requiredString, optionalString } from "@/validation/primitives";
export const occupation = (required: boolean) =>
	required ? requiredString() : optionalString();
