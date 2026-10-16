import { evaluateConditions } from "@/utils/evaluateConditions/index";
import { visibilityConditionsSchema } from "@/validation/schemas";
describe("evaluateConditions", () => {
	const conditions = visibilityConditionsSchema.parse([
		{ source: "formErrors", path: "taxvat.type", value: "server" },
	]);
	it("exibe apenas após o erro server do CPF", () => {
		expect(evaluateConditions(conditions, { formErrors: {} })).toBe(false);
		expect(
			evaluateConditions(conditions, {
				formErrors: { taxvat: { type: "required" } },
			}),
		).toBe(false);
		expect(
			evaluateConditions(conditions, {
				formErrors: { taxvat: { type: "server" } },
			}),
		).toBe(true);
	});
	it("permite wrappers sem condições e exige todas as condições configuradas", () => {
		expect(evaluateConditions([], {})).toBe(true);
		const parsed = visibilityConditionsSchema.parse([
			...conditions,
			{ source: "business", path: "allowed", value: true },
		]);
		expect(
			evaluateConditions(parsed, {
				formErrors: { taxvat: { type: "server" } },
				business: { allowed: false },
			}),
		).toBe(false);
	});
	it.each([
		"exists",
		"notExists",
		"notEquals",
	] as const)("avalia %s", (operator) => {
		const parsed = visibilityConditionsSchema.parse([
			{ path: "cpf", operator, value: "123" },
		]);
		expect(
			evaluateConditions(parsed, {
				fields: { cpf: operator === "notExists" ? undefined : "456" },
			}),
		).toBe(true);
	});
});
