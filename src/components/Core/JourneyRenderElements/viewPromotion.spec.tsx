import { vi } from "vitest";
import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderJourneyElement } from "./renderJourneyElement";
import { useJourneyNavigation } from "@/hooks/useJourneyNavigation";
import { journeyElementSchema } from "@/validation/schemaValidation";
import { callService } from "@/services";
vi.mock("@/utils", async () => ({
	...(await vi.importActual<typeof import("@/utils")>("@/utils")),
	redirectTo: vi.fn(),
}));
vi.mock("@/store", () => ({
	useJourneyStore: () => ({
		mergeFields: vi.fn(),
		setError: vi.fn(),
		mergeServices: vi.fn(),
		business: {},
		services: {},
	}),
}));
vi.mock("@/services", () => ({ callService: vi.fn() }));

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
			showProgressBar: true,
			showBackButton: true,
			empty: false,
			elements: [cpf, wrapper],
		},
		currentStepIndex: 0,
		currentStepFields: [],
		getValues: vi.fn(),
		handleSubmit: vi.fn(),
		trigger: vi.fn(),
		getFieldState: vi.fn(),
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
				register: vi.fn(),
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
		vi.mocked(callService).mockResolvedValue({
			success: false,
			code: "NOT_ELIGIBLE",
		});
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
		vi.mocked(callService).mockResolvedValue({
			success: false,
			code: "TIMEOUT",
		});
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
