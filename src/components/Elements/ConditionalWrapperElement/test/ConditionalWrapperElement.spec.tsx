import { vi } from "vitest";
import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { ConditionalWrapperElement } from "@/components/Elements/ConditionalWrapperElement/ConditionalWrapperElement";
import { conditionalWrapperElementSchema } from "@/validation/schemas";
vi.mock("@/utils", async () => ({
	...(await vi.importActual<typeof import("@/utils")>("@/utils")),
}));
const cards = ["Empréstimo Consignado", "Empréstimo Pessoal"].map(
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
						label: "Conhecer",
						url: "https://example.test/produto-" + index,
					},
				},
			],
		},
	}),
);
const wrapper = conditionalWrapperElementSchema.parse({
	id: "cpf-recommended-products-wrapper",
	type: "CONDITIONAL_WRAPPER",
	config: {
		conditions: [
			{ source: "formErrors", path: "taxvat.type", value: "server" },
		],
		elements: cards,
	},
});
const renderElement = (child: (typeof wrapper.config.children)[number]) => (
	<span>{child.id}</span>
);
function dataLayer() {
	return (
		window as Window & {
			dataLayer?: unknown[];
		}
	).dataLayer;
}
beforeEach(() => {
	(
		window as Window & {
			dataLayer?: unknown[];
		}
	).dataLayer = [];
});
describe("ConditionalWrapperElement view_promotion", () => {
	it.each([
		"emprestimo-com-garantia-de-veiculo",
		"financiamento-de-veiculos",
	])("envia os dois cards uma vez ao aparecer em %s", (journeySlug) => {
		const props = { element: wrapper, journeySlug, renderElement };
		const { rerender } = render(
			<ConditionalWrapperElement {...props} context={{ formErrors: {} }} />,
		);
		expect(screen.queryByText("card-0")).toBeNull();
		expect(dataLayer()).toEqual([]);
		rerender(
			<ConditionalWrapperElement
				{...props}
				context={{ formErrors: { taxvat: { type: "server" } } }}
			/>,
		);
		expect(screen.getByText("card-0")).toBeTruthy();
		expect(screen.getByText("card-1")).toBeTruthy();
		expect(dataLayer()).toEqual([
			{
				event: "view_promotion",
				ev_action: "ecommerce:visualizar:promocao:sucesso",
				items: cards.map((card, index) => ({
					item_id: card.config.elements[2].config.url,
					item_name: card.config.elements[0].config.text,
					item_brand: "porto",
					creative_name: "produtos-recomendados",
					creative_slot: "cpf-negativa-elegibilidade",
					promotion_name: "Descrição " + index,
					affiliation: "porto",
				})),
			},
		]);
		rerender(
			<ConditionalWrapperElement
				{...props}
				element={{
					...wrapper,
					config: { ...wrapper.config, children: [...wrapper.config.children] },
				}}
				context={{ formErrors: { taxvat: { type: "server" } } }}
			/>,
		);
		rerender(
			<ConditionalWrapperElement {...props} context={{ formErrors: {} }} />,
		);
		rerender(
			<ConditionalWrapperElement
				{...props}
				context={{ formErrors: { taxvat: { type: "server" } } }}
			/>,
		);
		expect(dataLayer()).toHaveLength(1);
	});
	it("não duplica com StrictMode", () => {
		render(
			<StrictMode>
				<ConditionalWrapperElement
					element={wrapper}
					journeySlug="financiamento-de-veiculos"
					renderElement={renderElement}
					context={{ formErrors: { taxvat: { type: "server" } } }}
				/>
			</StrictMode>,
		);
		expect(dataLayer()).toHaveLength(1);
	});
	it.each([
		"seguro-bike",
		"consulta-de-credito",
		"",
	])("não envia em outra jornada: %s", (journeySlug) => {
		render(
			<ConditionalWrapperElement
				element={wrapper}
				journeySlug={journeySlug}
				renderElement={renderElement}
				context={{ formErrors: { taxvat: { type: "server" } } }}
			/>,
		);
		expect(dataLayer()).toEqual([]);
		expect(screen.getByText("card-0")).toBeTruthy();
	});
	it("não envia para outro wrapper", () => {
		render(
			<ConditionalWrapperElement
				element={{ ...wrapper, id: "outro-wrapper" }}
				journeySlug="financiamento-de-veiculos"
				renderElement={renderElement}
				context={{ formErrors: { taxvat: { type: "server" } } }}
			/>,
		);
		expect(dataLayer()).toEqual([]);
	});
	it("não envia payload parcial e permite nova tentativa quando os dois cards estão completos", () => {
		const incomplete = {
			...wrapper,
			config: {
				...wrapper.config,
				children: wrapper.config.children.slice(0, 1),
			},
		};
		const props = {
			journeySlug: "financiamento-de-veiculos",
			renderElement,
			context: { formErrors: { taxvat: { type: "server" } } },
		};
		const { rerender } = render(
			<ConditionalWrapperElement {...props} element={incomplete} />,
		);
		expect(dataLayer()).toEqual([]);
		rerender(<ConditionalWrapperElement {...props} element={wrapper} />);
		expect(dataLayer()).toHaveLength(1);
	});
	it("não envia quando falta a URL do card", () => {
		const badCards = JSON.parse(JSON.stringify(wrapper.config.children));
		badCards[0].config.children[2].element.config.url = "";
		render(
			<ConditionalWrapperElement
				element={{
					...wrapper,
					config: { ...wrapper.config, children: badCards },
				}}
				journeySlug="financiamento-de-veiculos"
				renderElement={renderElement}
				context={{ formErrors: { taxvat: { type: "server" } } }}
			/>,
		);
		expect(dataLayer()).toEqual([]);
	});
});
