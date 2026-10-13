import { requiredString, optionalString } from "@/validation/primitives";
export const socialName = (required: boolean) =>
	required ? requiredString() : optionalString();
