import { journeyStepSchema } from "@/validation/schemas";
import { buildStepFormSchema, buildJourneyFormSchema } from "@/validation/form";
import { journeySchema } from "@/validation/schemas";

function build(type: string, config: Record<string, unknown> = {}) {
	return buildStepFormSchema(
		journeyStepSchema.parse({
			id: "step",
			name: "Etapa",
			slug: "etapa",
			elements: [{ id: "field", type, config }],
		}),
	);
}

describe("handlers do novo formulário", () => {
	it("valida CEP, número e complemento sem número", () => {
		const { schema, defaultValues } = build("CEP");
		expect(schema.safeParse(defaultValues).success).toBe(false);
		const address = {
			addressZipCode: "01310100",
			addressStreetName: "Rua de teste",
			addressNeighborhood: "Bairro",
			addressState: "SP",
			addressCity: "São Paulo",
			addressNumber: "1",
		};
		expect(schema.safeParse(address).success).toBe(true);
		expect(
			schema.safeParse({ ...address, addressNumber: "", hasNoNumber: true })
				.success,
		).toBe(false);
		expect(
			schema.safeParse({
				...address,
				addressNumber: "",
				hasNoNumber: true,
				addressAdditionalInfo: "Casa de teste",
			}).success,
		).toBe(true);
	});
	it("preserva o nome configurado da ocupação e exige renda apenas quando preenchida", () => {
		const { schema } = build("OCCUPATION", {
			name: "occupation",
			professionsRequiredFor: ["TEST_PROFESSION"],
		});
		expect(schema.safeParse({}).success).toBe(true);
		expect(schema.safeParse({ occupation: "TEST_OTHER" }).success).toBe(false);
		expect(
			schema.safeParse({ occupation: "TEST_OTHER", occupationIncome: 100 })
				.success,
		).toBe(true);
		expect(
			schema.safeParse({ occupation: "TEST_PROFESSION", occupationIncome: 100 })
				.success,
		).toBe(false);
		expect(
			schema.safeParse({
				occupation: "TEST_PROFESSION",
				occupationIncome: 100,
				occupationProfession: "Profissão de teste",
			}).success,
		).toBe(true);
		expect(
			build("OCCUPATION", { required: true }).schema.safeParse({}).success,
		).toBe(false);
	});
	it("nome social é exigido somente com a opção habilitada", () => {
		const { schema } = build("SOCIAL_NAME", { name: "socialName" });
		expect(schema.safeParse({ hasSocialName: false }).success).toBe(true);
		expect(schema.safeParse({ hasSocialName: true }).success).toBe(false);
		expect(
			schema.parse({ hasSocialName: true, socialName: " Ana " }).socialName,
		).toBe("Ana");
	});
	it("respeita a opção de intersexo e obrigatoriedade", () => {
		expect(build("BIOLOGICAL_SEX").schema.safeParse({}).success).toBe(true);
		const required = build("BIOLOGICAL_SEX", { required: true }).schema;
		expect(required.safeParse({}).success).toBe(false);
		expect(
			required.safeParse({ biologicalGender: "BIO_GENDER_INTERSEX" }).success,
		).toBe(true);
		expect(
			build("BIOLOGICAL_SEX", { showIntersex: false }).schema.safeParse({
				biologicalGender: "BIO_GENDER_INTERSEX",
			}).success,
		).toBe(false);
	});
	it("endereço selecionado mantém os campos auxiliares no formulário", () => {
		const { schema, defaultValues } = build("ADDRESS_RADIO", {
			name: "address",
			required: true,
			sourcePath: "addresses",
		});
		expect(schema.safeParse(defaultValues).success).toBe(false);
		expect(
			schema.safeParse({
				...defaultValues,
				address: "test",
				addressZipCode: "01310100",
				addressStreetName: "Rua",
				addressNeighborhood: "Bairro",
				addressState: "SP",
				addressCity: "São Paulo",
			}).success,
		).toBe(true);
	});
	it("agrega campos de todas as etapas e mantém os refinamentos locais", () => {
		const journey = journeySchema.parse({
			id: "journey",
			name: "Teste",
			slug: "teste",
			steps: [
				{
					id: "cpf",
					name: "CPF",
					slug: "cpf",
					elements: [
						{
							id: "cpf",
							type: "CPF_INPUT",
							config: { label: "CPF", name: "taxvat", required: true },
						},
					],
				},
				{
					id: "name",
					name: "Nome",
					slug: "nome",
					elements: [
						{ id: "name", type: "SOCIAL_NAME", config: { name: "socialName" } },
					],
				},
			],
		});
		const { schema, stepFields, defaultValues } =
			buildJourneyFormSchema(journey);
		expect(stepFields).toEqual({
			cpf: ["taxvat"],
			name: ["hasSocialName", "socialName"],
		});
		expect(defaultValues.hasSocialName).toBe(false);
		expect(
			schema.safeParse({ taxvat: "52998224725", hasSocialName: true }).success,
		).toBe(false);
		expect(
			schema.parse({
				taxvat: "529.982.247-25",
				hasSocialName: true,
				socialName: " Ana ",
			}),
		).toEqual({
			taxvat: "52998224725",
			hasSocialName: true,
			socialName: "Ana",
		});
	});
});
