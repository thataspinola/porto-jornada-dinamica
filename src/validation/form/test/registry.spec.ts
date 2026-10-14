import { describe, expect, it } from "vitest";
import { fieldSchema } from "@/validation/form/elementRegistry";

describe("schema de campos declarativos", () => {
	it.each([
		["EMAIL_INPUT", "ana@porto.test", "inválido"],
		["NUMERIC_INPUT", 25, "25"],
		["PRICE_SELECTOR", 1000, Infinity],
		["MARKETING_OPTIN", true, false],
		["CHECKBOX", true, false],
		["TEXT_INPUT", "Ana", ""],
	])("exige valores válidos para %s", (type, valid, invalid) => {
		expect(fieldSchema(type as string, true).safeParse(valid).success).toBe(
			true,
		);
		expect(fieldSchema(type as string, true).safeParse(invalid).success).toBe(
			false,
		);
		expect(fieldSchema(type as string, false).safeParse(valid).success).toBe(
			true,
		);
		expect(
			fieldSchema(type as string, false).safeParse(undefined).success,
		).toBe(true);
	});
	it.each([
		"EMAIL_INPUT",
		"NUMERIC_INPUT",
		"TEXT_INPUT",
	])("permite campo opcional vazio em %s", (type) =>
		expect(fieldSchema(type, false).safeParse("").success).toBe(true));
});
