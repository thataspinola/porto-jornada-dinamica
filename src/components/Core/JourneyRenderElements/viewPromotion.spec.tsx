import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderJourneyElement } from "./renderJourneyElement";
import { useJourneyNavigation } from "@/hooks/useJourneyNavigation";
import { journeyElementSchema } from "@/validation/schemaValidation";
import { callService } from "@/services";
jest.mock("@/utils", () => ({
	evaluateConditions: jest.requireActual("@/utils/evaluateConditions")
		.evaluateConditions,
	pushEvent: jest.requireActual("@/utils/pushEvent").pushEvent,
	redirectTo: jest.fn(),
}));
jest.mock("@/store", () => ({
	useJourneyStore: () => ({
		mergeFields: jest.fn(),
		setError: jest.fn(),
		mergeServices: jest.fn(),
		business: {},
		services: {},
	}),
}));
jest.mock("@/services", () => ({ callService: jest.fn() }));
jest.mock("@/components/UI", () => ({
	Typography: ({ children }: { children: React.ReactNode }) =>
		jest.requireActual("react").createElement("p", null, children),
}));
jest.mock("@/components/Elements", () => ({
	ConditionalWrapperElement: jest.requireActual(
		"@/components/Elements/ConditionalWrapperElement",
	).ConditionalWrapperElement,
	ComposableCardElement: jest.requireActual(
		"@/components/Elements/ComposableCardElement",
	).ComposableCardElement,
	TextElement: jest.requireActual("@/components/Elements/TextElement")
		.TextElement,
	NavigationElement: ({
		element,
	}: {
		element: {
			config: {
				url: string;
				label: string;
			};
		};
	}) =>
		jest
			.requireActual("react")
			.createElement("a", { href: element.config.url }, element.config.label),
}));
const wrapper = journeyElementSchema.parse({
	id: "cpf-recommended-products-wrapper",
	type: "CONDITIONAL_WRAPPER",
	config: {
		conditions: [
			{ source: "formErrors", path: "taxvat.type", value: "server" },
		],
		elements: ["Empréstimo Consignado", "Empréstimo Pessoal"].map(
			(title, index) => ({
				id: "card-" + index,
				type: "COMPOSABLE_CARD",
				config: {
					elements: [
						{ id: "title-" + index, type: "TEXT", config: { text: title } },
						{
							id: "description-" + index,
							type: "TEXT",
							config: { text: "Descrição " + index },
						},
						{
							id: "link-" + index,
							type: "NAVIGATION",
							config: {
								label: "Conhecer " + index,
								url: "https://example.test/" + index,
							},
						},
					],
				},
			}),
		),
	},
});
const cpf = journeyElementSchema.parse({
	id: "cpf",
	type: "CPF_INPUT",
	config: { name: "taxvat", label: "CPF", required: true },
});
function Harness({ journeySlug }: { journeySlug: string }) {
	const [errors, setErrors] = useState<
		Record<
			string,
			{
				type: "server";
				message: string;
			}
		>
	>({});
	const navigation = useJourneyNavigation({
		journeySlug,
		setFormError: (field, error) =>
			setErrors((previous) => ({ ...previous, [field]: error })),
		steps: [],
		currentStep: {
			id: "cpf",
			name: "CPF",
			slug: "cpf",
			backStepSlug: "",
			elements: [cpf, wrapper],
		},
		currentStepIndex: 0,
		currentStepFields: [],
		getValues: jest.fn(),
		handleSubmit: jest.fn(),
		trigger: jest.fn(),
		getFieldState: jest.fn(),
	});
	return (
		<>
			<button
				type="button"
				onClick={() =>
					navigation.goNext({
						type: "service",
						serviceName: "eligibility",
						targetSlug: "placa",
					})
				}
			>
				Consultar
			</button>
			{renderJourneyElement(wrapper, {
				register: jest.fn(),
				control: {} as never,
				errors,
				goNext: navigation.goNext,
				business: {},
				canProceed: true,
				journeySlug,
			})}
		</>
	);
}
describe("integração negativa CPF → renderização → view_promotion", () => {
	beforeEach(() => {
		(
			window as Window & {
				dataLayer?: unknown[];
			}
		).dataLayer = [];
		jest
			.mocked(callService)
			.mockResolvedValue({ success: false, code: "NOT_ELIGIBLE" });
	});
	it.each([
		"emprestimo-com-garantia-de-veiculo",
		"financiamento-de-veiculos",
	])("mostra os produtos e envia um único evento em %s", async (journeySlug) => {
		render(<Harness journeySlug={journeySlug} />);
		expect(screen.queryByText("Empréstimo Consignado")).toBeNull();
		fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
		await waitFor(() =>
			expect(screen.getByText("Empréstimo Consignado")).toBeTruthy(),
		);
		expect(screen.getByText("Empréstimo Pessoal")).toBeTruthy();
		expect(
			screen.getByRole("link", { name: "Conhecer 0" }).getAttribute("href"),
		).toBe("https://example.test/0");
		expect(
			(
				window as Window & {
					dataLayer?: unknown[];
				}
			).dataLayer,
		).toHaveLength(1);
		fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
		await waitFor(() => expect(callService).toHaveBeenCalledTimes(2));
		expect(
			(
				window as Window & {
					dataLayer?: unknown[];
				}
			).dataLayer,
		).toHaveLength(1);
	});
	it("não mostra os cards em falhas diferentes de NOT_ELIGIBLE", async () => {
		jest
			.mocked(callService)
			.mockResolvedValue({ success: false, code: "TIMEOUT" });
		render(<Harness journeySlug="financiamento-de-veiculos" />);
		fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
		await waitFor(() => expect(callService).toHaveBeenCalled());
		expect(screen.queryByText("Empréstimo Consignado")).toBeNull();
		expect(
			(
				window as Window & {
					dataLayer?: unknown[];
				}
			).dataLayer,
		).toEqual([]);
	});
});
