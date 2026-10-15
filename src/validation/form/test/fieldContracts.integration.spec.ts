import { journeyStepSchema } from "@/validation/schemas";
import { buildStepFormSchema } from "@/validation/form";

function form(
	type: string,
	required = false,
	extra: Record<string, unknown> = {},
) {
	return buildStepFormSchema(
		journeyStepSchema.parse({
			id: "step",
			name: "Etapa",
			slug: "etapa",
			elements: [
				{
					id: "field",
					type,
					config: {
						name: "field",
						label: "Campo",
						required,
						options: [],
						items: [{ label: "Primeira", value: "first" }],
						min: 0,
						max: 100,
						step: 1,
						value: "hidden",
						...extra,
					},
				},
			],
		}),
	);
}

describe("contratos entre JSON e formulário", () => {
	it.each([
		["FULL_NAME_INPUT", "Ana Silva"],
		["BIRTH_DATE_INPUT", "1990-10-10"],
		["TAXVAT_INPUT", "52998224725"],
		["CEP_INPUT", "01310100"],
		["PHONE_INPUT", "11999998888"],
		["RADIO", "test"],
		["CHIPS", "test"],
		["CHIPS_IMAGE", "test"],
		["SELECT", "test"],
		["MARITAL_STATUS", "test"],
		["NATIONALITY", "test"],
		["TEXT_INPUT", "test"],
		["FCDC_PLATE_INPUT", "ABC1234"],
		["REFF_PLATE_INPUT", "ABC1234"],
		["FCDC_UNKNOWN_LICENSE_PLATE", "ABC1234"],
	])("%s respeita campo obrigatório e opcional", (type, value) => {
		const required = form(type, true);
		expect(required.schema.safeParse({ field: value }).success).toBe(true);
		expect(required.schema.safeParse({ field: "" }).success).toBe(false);
		const optional = form(type);
		expect(optional.schema.safeParse({ field: "" }).success).toBe(true);
		expect(optional.schema.safeParse({ field: value }).success).toBe(true);
	});
	it("CNPJ é selecionado pelo modo e CPF continua como padrão", () => {
		const { schema } = form("TAXVAT_INPUT", true, { mode: "cnpj" });
		expect(schema.safeParse({ field: "11222333000181" }).success).toBe(true);
		expect(schema.safeParse({ field: "52998224725" }).success).toBe(false);
	});
	it("e-mail vazio é opcional, e-mail inválido falha e máscara completa é aceita", () => {
		expect(form("EMAIL_INPUT").schema.safeParse({ field: "" }).success).toBe(
			true,
		);
		expect(
			form("EMAIL_INPUT", true).schema.safeParse({ field: "" }).success,
		).toBe(false);
		expect(
			form("EMAIL_INPUT", true).schema.safeParse({ field: "a***@example.test" })
				.success,
		).toBe(true);
		expect(
			form("EMAIL_INPUT").schema.safeParse({ field: "inválido" }).success,
		).toBe(false);
	});
	it("valor numérico mantém validações de texto e não aceita números não finitos", () => {
		const required = form("NUMERIC_INPUT", true, {
			validations: [{ type: "MIN_LENGTH", value: 2, message: "Mínimo" }],
		}).schema;
		expect(required.parse({ field: 25 }).field).toBe("25");
		expect(required.safeParse({ field: 1 }).success).toBe(false);
		expect(required.safeParse({ field: Infinity }).success).toBe(false);
		expect(form("NUMERIC_INPUT").schema.safeParse({}).success).toBe(true);
	});
	it.each([
		"FCDC_PLATE_INPUT",
		"REFF_PLATE_INPUT",
		"FCDC_UNKNOWN_LICENSE_PLATE",
		"FCDC_PRICE_SIMULATION",
		"REFF_SIMULATION",
		"OPTION_CARD_LIST",
		"TABS",
	])("%s sem name não cria campo undefined", (type) => {
		const { schema, defaultValues } = form(type, false, { name: undefined });
		expect(Object.keys(schema.shape)).toEqual([]);
		expect(defaultValues).toEqual({});
	});
	it.each([
		"FCDC_PRICE_SIMULATION",
		"REFF_SIMULATION",
	])("%s exige valor positivo", (type) => {
		const { schema, defaultValues } = form(type, true, { defaultValue: 10 });
		expect(defaultValues.field).toBe(10);
		expect(schema.safeParse({ field: 10 }).success).toBe(true);
		expect(schema.safeParse({ field: 0 }).success).toBe(false);
	});
	it("defaults, checkboxes, opt-in e produto mantêm seus tipos", () => {
		expect(form("INPUT_HIDDEN").defaultValues.field).toBe("hidden");
		expect(form("PRICE_SELECTOR").defaultValues.field).toBe(0);
		expect(
			form("PRICE_SELECTOR", false, { defaultValue: 10 }).defaultValues.field,
		).toBe(10);
		expect(form("CHECKBOX").schema.safeParse({ field: false }).success).toBe(
			true,
		);
		expect(form("MARKETING_OPTIN").defaultValues.field).toBe(false);
		expect(
			form("MARKETING_OPTIN").schema.safeParse({ field: false }).success,
		).toBe(true);
		expect(form("TABS").defaultValues.field).toBe("first");
		expect(
			form("TABS", false, { items: [{ label: "Sem valor" }] }).defaultValues
				.field,
		).toBe("");
		expect(
			form("OPTION_CARD_LIST").schema.safeParse({ field: "test" }).success,
		).toBe(true);
	});
});

it.each([
	"PLAN_CARD",
	"SUMMARY_PRODUCT_CARD",
])("%s guarda campos de produto sem fabricar seleção", (type) => {
	const { schema } = form(type, false, {
		sourcePath: "products",
		productTitle: "Produto de teste",
		changePlanUrl: "/planos",
		returnUrl: "/voltar",
	});
	expect(schema.safeParse({}).success).toBe(true);
	expect(schema.parse({ productSku: "test-sku", boost: "test-boost" })).toEqual(
		{ productSku: "test-sku", boost: "test-boost" },
	);
});
