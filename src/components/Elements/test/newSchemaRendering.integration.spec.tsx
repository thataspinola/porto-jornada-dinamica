import { fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { renderJourneyElement } from "@/components/Core/JourneyRenderElements";
import { journeyElementSchema } from "@/validation/schemas";
import type { ElementRenderContext } from "@/components/Core/JourneyRenderElements/types";

function JourneyElement({
	type,
	config,
	goNext = vi.fn<ElementRenderContext["goNext"]>(),
}: {
	type: string;
	config: Record<string, unknown>;
	goNext?: ElementRenderContext["goNext"];
}) {
	const form = useForm<Record<string, unknown>>();
	const ctx: ElementRenderContext = {
		register: form.register,
		control: form.control,
		errors: {},
		goNext,
		business: {},
		fields: form.watch(),
		canProceed: true,
		journeySlug: "teste",
	};
	return (
		<>
			{renderJourneyElement(
				journeyElementSchema.parse({ id: "element", type, config }),
				ctx,
			)}
			<output data-testid="values">{JSON.stringify(form.watch())}</output>
		</>
	);
}

it("grid e drawer mostram os descendentes definidos nos novos schemas", () => {
	const child = { id: "text", type: "TEXT", config: { text: "Conteúdo" } };
	const grid = render(
		<JourneyElement
			type="GRID"
			config={{
				children: [
					{
						id: "column",
						type: "GRID_ITEM",
						config: { colSpan: 12, children: [child] },
					},
				],
			}}
		/>,
	);
	expect(screen.getByText("Conteúdo")).toBeInTheDocument();
	grid.unmount();
	render(
		<JourneyElement
			type="DRAWER"
			config={{ slug: "detalhes", headerChildren: [child] }}
		/>,
	);
	fireEvent.click(screen.getByRole("button", { name: "Ver detalhes" }));
	expect(screen.getByRole("dialog")).toHaveTextContent("Conteúdo");
});

it("tabs mostram os filhos ativos e sincronizam a seleção com o formulário", () => {
	render(
		<JourneyElement
			type="TABS"
			config={{
				name: "selected",
				items: [
					{
						label: "Primeira",
						value: "one",
						children: [
							{
								id: "price1",
								type: "PRICE_SELECTOR",
								config: { name: "priceOne", min: 0, max: 100, step: 1 },
							},
						],
					},
					{
						label: "Segunda",
						value: "two",
						children: [
							{
								id: "price2",
								type: "PRICE_SELECTOR",
								config: { name: "priceTwo", min: 0, max: 200, step: 1 },
							},
						],
					},
				],
			}}
		/>,
	);
	expect(screen.getByRole("tabpanel")).toHaveTextContent("priceOne");
	fireEvent.click(screen.getByRole("tab", { name: "Segunda" }));
	expect(screen.getByRole("tabpanel")).toHaveTextContent("priceTwo");
	expect(screen.getByTestId("values")).toHaveTextContent('"selected":"two"');
});

it.each([
	"ghost",
	"stroke",
	"filled",
])("botões e links adaptam o estilo %s", (styles) => {
	const goNext = vi.fn<ElementRenderContext["goNext"]>();
	const service = render(
		<JourneyElement
			type="SERVICE_CALL"
			config={{
				label: "Continuar",
				service: "eligibility",
				targetStepOnSuccess: "/next",
				styles,
				size: "sm",
			}}
			goNext={goNext}
		/>,
	);
	fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
	expect(goNext).toHaveBeenCalledWith({
		type: "service",
		serviceName: "eligibility",
		targetSlug: "/next",
	});
	service.unmount();
	render(
		<JourneyElement
			type="NAVIGATION"
			config={{
				label: "Próxima",
				url: "/next",
				styles,
				size: "sm",
				disabled: true,
			}}
			goNext={goNext}
		/>,
	);
	goNext.mockClear();
	fireEvent.click(screen.getByRole("link", { name: "Próxima" }));
	expect(goNext).not.toHaveBeenCalled();
});

it("referências de serviço sem implementação não enviam um objeto para o dispatcher legado", () => {
	const goNext = vi.fn<ElementRenderContext["goNext"]>();
	render(
		<JourneyElement
			type="SERVICE_CALL"
			config={{
				label: "Continuar",
				service: { module: "test", action: "pending" },
				targetStepOnSuccess: "/next",
			}}
			goNext={goNext}
		/>,
	);
	expect(screen.getByRole("button")).toBeDisabled();
	expect(goNext).not.toHaveBeenCalled();
});
