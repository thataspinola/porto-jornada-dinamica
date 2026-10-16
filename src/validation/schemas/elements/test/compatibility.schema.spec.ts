import { z } from "zod";
import { baseElementSchema } from "@/validation/schemas/elements/baseElement.schema";
import { journeyElementSchema } from "@/validation/schemas";
import { fieldValidationSchema } from "@/validation/schemas/elements/validations.schema";
import { iconNameSchema } from "@/validation/schemas/elements/icon.schema";
import { elementStyleSchema } from "@/validation/schemas/elements/styling.schema";

it("normaliza apenas formatos legados e mantém prioridade dos campos atuais", () => {
	const checkbox = journeyElementSchema.parse({
		id: "check",
		type: "CHECKBOX",
		config: { name: "accepted", label: "Aceito" },
	});
	expect(checkbox.config).toMatchObject({ label: { text: "Aceito" } });
	const element = journeyElementSchema.parse({
		id: "wrapper",
		type: "CONDITIONAL_WRAPPER",
		config: {
			checks: [{ left: { value: true }, op: "EQUAL", right: { value: true } }],
			conditions: [{ source: "fields", path: "wrong", value: false }],
			children: [
				{
					id: "title",
					type: "TEXT",
					config: { text: "Atual", ui: { weight: "bold" } },
				},
			],
			elements: [{ id: "legacy", type: "TEXT", config: { text: "Antigo" } }],
		},
	});
	expect(element.config).toMatchObject({
		checks: [{ left: { value: true } }],
		children: [{ config: { text: "Atual", weight: "bold" } }],
	});
	const legacy = journeyElementSchema.parse({
		id: "wrapper",
		type: "CONDITIONAL_WRAPPER",
		config: {
			conditions: [{ path: "x", operator: "exists" }],
			elements: [{ id: "text", type: "TEXT", config: { text: "Texto" } }],
		},
	});
	expect(legacy.config).toMatchObject({
		checks: [{ left: { from: "fields", path: "x" }, op: "EXISTS" }],
	});
});

it.each([
	null,
	1,
	[],
	undefined,
])("rejeita config inválida %j sem lançar fora do Zod", (config) => {
	expect(
		journeyElementSchema.safeParse({ id: "text", type: "TEXT", config })
			.success,
	).toBe(false);
});

it("base permite extensões sem config e valida estilo e nomes de ícone", () => {
	expect(
		baseElementSchema
			.extend({ type: z.literal("TEST") })
			.parse({ id: "test", type: "TEST" }),
	).toEqual({ id: "test", type: "TEST" });
	expect(
		elementStyleSchema.parse({ marginBottom: { desktop: 32, mobile: 16 } }),
	).toEqual({ marginBottom: { desktop: 32, mobile: 16 } });
	expect(elementStyleSchema.safeParse({ marginBottom: 7 }).success).toBe(false);
	expect(iconNameSchema.safeParse("add").success).toBe(true);
	expect(iconNameSchema.safeParse("not-a-porto-icon").success).toBe(false);
	expect(iconNameSchema.safeParse(1).success).toBe(false);
	expect(
		fieldValidationSchema.safeParse({
			type: "REGEX",
			value: "[",
			message: "Inválida",
		}).success,
	).toBe(false);
	expect(
		fieldValidationSchema.safeParse({
			type: "REGEX",
			value: "[A-Z]",
			message: "Formato",
		}).success,
	).toBe(true);
});
