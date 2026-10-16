import { journeyStepSchema } from "@/validation/schemas";
import { buildStepFormSchema } from "@/validation/form";
test("valida CPF no novo registry e campos aninhados", () => {
	const step = journeyStepSchema.parse({
		id: "cpf",
		name: "CPF",
		slug: "cpf",
		elements: [
			{
				id: "cpf-input",
				type: "CPF_INPUT",
				config: { name: "taxvat", label: "CPF", required: true },
			},
			{
				id: "box",
				type: "BOX",
				config: {
					children: [
						{
							id: "consent",
							type: "CHECKBOX",
							config: {
								name: "consent",
								label: { text: "Aceito" },
								required: true,
							},
						},
					],
				},
			},
		],
	});
	const { schema, requiredFields, defaultValues } = buildStepFormSchema(step);
	expect(requiredFields).toEqual(["taxvat", "consent"]);
	expect(defaultValues.consent).toBe(false);
	expect(
		schema.safeParse({ taxvat: "11111111111", consent: true }).success,
	).toBe(false);
	expect(
		schema.safeParse({ taxvat: "52998224725", consent: false }).success,
	).toBe(false);
	expect(
		schema.safeParse({ taxvat: "52998224725", consent: true }).success,
	).toBe(true);
});
