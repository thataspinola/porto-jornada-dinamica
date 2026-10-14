import { describe, expect, it } from "vitest";
import { currencyToNumber } from "@/utils/currencyToNumber";
import { onlyLetterMask } from "@/utils/mask/onlyLetters";
import { onlyNumbers } from "@/utils/mask/onlyNumbers";
import { highlightTitle } from "@/components/Elements/WelcomeElement/utils/highlightTitle";
import { splitFullName } from "@/utils/pushLeadEvent/splitFullName";
import { resolveTemplates } from "@/utils/resolveTemplates";
import { areRequiredFieldsComplete } from "@/validation/form";
import { addressRadio } from "@/validation/form/registry/addressRadio";
import { biologicalSex } from "@/validation/form/registry/biologicalSex";
import { occupation } from "@/validation/form/registry/occupation";
import { socialName } from "@/validation/form/registry/socialName";
import { plate } from "@/features/fcdc/validation/form/registry/plate";
import { unknownPlate } from "@/features/fcdc/validation/form/registry/unknownPlate";
import { priceSimulation } from "@/features/fcdc/validation/form/registry/priceSimulation";
import { validationsSchema } from "@/validation/schemas/elements/validations.schema";

describe("entrada, texto e schemas por produto", () => {
	it("converte moeda e mantém entradas vazias sem inventar valor", () => {
		expect(currencyToNumber("")).toBe(0);
		expect(currencyToNumber("150000")).toBe(1500);
		expect(onlyNumbers("01310-100")).toBe("01310100");
		expect(onlyLetterMask("Ana123 @Silva")).toBe("Ana Silva");
	});
	it("destaca trecho existente e preserva texto sem match", () => {
		expect(highlightTitle("Crédito Porto", "Porto")).toEqual({
			before: "Crédito ",
			highlight: "Porto",
			after: "",
		});
		expect(highlightTitle("Crédito Porto", "Outro")).toEqual({
			before: "Crédito Porto",
			highlight: "",
			after: "",
		});
		expect(highlightTitle("Crédito Porto", "")).toEqual({
			before: "Crédito Porto",
			highlight: "",
			after: "",
		});
		expect(splitFullName(" Ana da Silva ")).toEqual({
			firstName: "Ana",
			lastName: "da Silva",
		});
		expect(splitFullName("")).toEqual({ firstName: "", lastName: "" });
	});
	it("templates resolvem arrays, objetos e preservam valores escalares", () => {
		expect(
			resolveTemplates(
				["{{user.name}}", { value: "{{user.name}}" }, 1, null, false],
				{ user: { name: "Ana" } },
			),
		).toEqual(["Ana", { value: "Ana" }, 1, null, false]);
	});
	it("obrigatórios rejeitam ausência e false, mas permitem zero", () => {
		expect(areRequiredFieldsComplete(["count"], { count: 0 })).toBe(true);
		for (const value of [undefined, null, "", false])
			expect(areRequiredFieldsComplete(["field"], { field: value })).toBe(
				false,
			);
		expect(areRequiredFieldsComplete([], {})).toBe(true);
	});
	it.each([
		addressRadio,
		biologicalSex,
		occupation,
		socialName,
	])("campos de seleção respeitam obrigatoriedade", (factory) => {
		expect(factory(true).safeParse("").success).toBe(false);
		expect(factory(true).safeParse("a").success).toBe(true);
		expect(factory(false).safeParse("").success).toBe(true);
	});
	it.each([plate, unknownPlate])("campos de placa exigem valor", (factory) => {
		expect(factory().safeParse("").success).toBe(false);
		expect(factory().safeParse("ABC1234").success).toBe(true);
	});
	it("simulação exige valor positivo e validações rejeitam comprimentos negativos", () => {
		expect(priceSimulation().safeParse(0).success).toBe(false);
		expect(priceSimulation().parse(100)).toBe(100);
		expect(validationsSchema.safeParse({ minLength: -1 }).success).toBe(false);
		expect(
			validationsSchema.parse({
				required: true,
				minLength: 1,
				maxLength: 10,
				pattern: "[A-Z]",
				min: 0,
				max: 100,
			}),
		).toMatchObject({ minLength: 1 });
	});
});
