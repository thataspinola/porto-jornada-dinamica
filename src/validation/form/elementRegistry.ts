import { z } from "zod";
import { cpf, cep, phone, fullName, birthDate } from "@/validation/fields";
import {
	requiredString,
	optionalString,
	requiredTrueBoolean,
	optionalBoolean,
} from "@/validation/primitives";
export const elementRegistry: Record<string, (required: boolean) => z.ZodType> =
	{
		CPF_INPUT: cpf,
		TAXVAT_INPUT: cpf,
		CEP: cep,
		CEP_INPUT: cep,
		PHONE_INPUT: phone,
		FULL_NAME_INPUT: fullName,
		BIRTH_DATE_INPUT: birthDate,
		EMAIL_INPUT: (r) =>
			r
				? z.email({ error: "E-mail inválido" })
				: z.union([z.email(), z.literal("")]).optional(),
		NUMERIC_INPUT: (r) =>
			r
				? z.number().finite()
				: z.union([z.number().finite(), z.literal("")]).optional(),
		PRICE_SELECTOR: (r) =>
			r ? z.number().finite() : z.number().finite().optional(),
		MARKETING_OPTIN: (r) => (r ? requiredTrueBoolean() : optionalBoolean()),
		CHECKBOX: (r) => (r ? requiredTrueBoolean() : optionalBoolean()),
	};
export function fieldSchema(type: string, required: boolean) {
	return (
		elementRegistry[type]?.(required) ??
		(required ? requiredString() : optionalString())
	);
}
