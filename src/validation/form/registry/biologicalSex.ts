import { requiredString, optionalString } from "@/validation/primitives";
export const biologicalSex = (required: boolean) =>
	required ? requiredString() : optionalString();
