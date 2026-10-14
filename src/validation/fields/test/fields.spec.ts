import { describe, expect, it } from "vitest";
import {
	birthDate,
	cep,
	cpf,
	fullName,
	isValidCpf,
	maskedValue,
	phone,
} from "@/validation/fields";

describe("validadores de domínio", () => {
	it.each([
		[cpf, "529.982.247-25", "52998224724"],
		[cep, "01310-100", "01310"],
		[phone, "(11) 99999-8888", "099998888"],
		[fullName, "Maria da Silva", "Maria"],
		[birthDate, "10/10/1990", "31/02/2000"],
	])("aceita formato válido e rejeita inválido", (validator, valid, invalid) => {
		expect(validator().safeParse(valid).success).toBe(true);
		expect(validator().safeParse(invalid).success).toBe(false);
		expect(validator().safeParse("").success).toBe(false);
		expect(validator(false).safeParse("  ").success).toBe(true);
		expect(validator(false).safeParse(valid).success).toBe(true);
	});
	it.each([
		"",
		"123",
		"11111111111",
		"52998224724",
		"52998224825",
	])("rejeita CPF %s", (value) => expect(isValidCpf(value)).toBe(false));
	it("remove a máscara e exige a quantidade de dígitos", () => {
		expect(maskedValue(8).parse("01310-100")).toBe("01310100");
		expect(maskedValue(8).safeParse("123").success).toBe(false);
	});
});
