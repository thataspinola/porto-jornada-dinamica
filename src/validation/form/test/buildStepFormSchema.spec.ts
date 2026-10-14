import { buildStepFormSchema } from "@/validation/form/buildStepFormSchema";
test("valida CPF e campos de wrappers", () => {
	const { schema, fields } = buildStepFormSchema([
		{
			type: "BOX",
			config: {
				elements: [
					{ type: "CPF_INPUT", config: { name: "taxvat", required: true } },
				],
			},
		},
	]);
	expect(fields).toEqual(["taxvat"]);
	expect(schema.safeParse({ taxvat: "11111111111" }).success).toBe(false);
	expect(schema.safeParse({ taxvat: "52998224725" }).success).toBe(true);
});
