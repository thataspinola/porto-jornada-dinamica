import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi, afterEach } from "vitest";
import { ConfiguredElement } from "@/components/Elements/ConfiguredElement";
import type { ConfiguredElementProps } from "@/components/Elements/ConfiguredElement/types";

const element = (type: string, config: Record<string, unknown> = {}) => ({
	id: "test-element",
	type,
	config,
});
afterEach(() => vi.restoreAllMocks());
function Controlled({
	type,
	config = {},
}: {
	type: string;
	config?: Record<string, unknown>;
}) {
	const form = useForm<Record<string, unknown>>();
	return (
		<>
			<ConfiguredElement
				element={element(type, { name: "field", label: "Campo", ...config })}
				control={form.control}
			/>
			<output data-testid="value">{JSON.stringify(form.watch("field"))}</output>
		</>
	);
}
describe("elementos declarativos", () => {
	it.each([
		["NUMERIC_INPUT", "12", "12"],
		["PRICE_SELECTOR", "30", "30"],
		["FULL_NAME_INPUT", "Ana Silva", '"Ana Silva"'],
	])("%s propaga valor com tipo correto", async (type, value, expected) => {
		render(
			<Controlled
				type={type}
				config={{
					min: 0,
					max: 100,
					defaultValue: type === "PRICE_SELECTOR" ? 0 : "",
				}}
			/>,
		);
		const input = screen.getByLabelText("Campo");
		fireEvent.change(input, { target: { value } });
		fireEvent.blur(input);
		await waitFor(() =>
			expect(screen.getByTestId("value").textContent).toBe(expected),
		);
		if (type === "NUMERIC_INPUT") {
			fireEvent.change(input, { target: { value: "" } });
			expect(screen.getByTestId("value").textContent).toBe('""');
		}
	});
	it("propaga seleção e consentimento controlados", () => {
		const first = render(
			<Controlled
				type="OCCUPATION"
				config={{ options: [{ label: "Analista", value: "analyst" }] }}
			/>,
		);
		fireEvent.change(screen.getByRole("combobox"), {
			target: { value: "analyst" },
		});
		expect(screen.getByTestId("value").textContent).toBe('"analyst"');
		first.unmount();
		render(<Controlled type="MARKETING_OPTIN" />);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(screen.getByTestId("value").textContent).toBe("true");
	});
	it("oferece registro sem controller e exibe erro acessível", () => {
		const register = vi.fn(() => ({
			name: "field",
			onChange: vi.fn(),
			onBlur: vi.fn(),
			ref: vi.fn(),
		}));
		const { rerender } = render(
			<ConfiguredElement
				element={element("OCCUPATION", {
					name: "field",
					label: "Profissão",
					options: [{ label: "Analista", value: "analyst" }],
				})}
				register={
					register as unknown as NonNullable<ConfiguredElementProps["register"]>
				}
				errors={{ field: { type: "server", message: "Indisponível" } }}
			/>,
		);
		expect(screen.getByLabelText("Profissão")).toHaveAttribute(
			"aria-describedby",
			"test-element-error",
		);
		expect(screen.getByRole("alert")).toHaveTextContent("Indisponível");
		expect(register).toHaveBeenCalledWith("field");
		rerender(
			<ConfiguredElement
				element={element("TEXT_INPUT", { name: "field" })}
				register={
					register as unknown as NonNullable<ConfiguredElementProps["register"]>
				}
			/>,
		);
		expect(screen.getByLabelText("field")).toHaveAttribute("type", "text");
	});
	it("campo oculto não cria label e elemento sem nome não aparece", () => {
		const { container, rerender } = render(
			<ConfiguredElement
				element={element("INPUT_HIDDEN", { name: "hidden" })}
			/>,
		);
		expect(container.querySelector('input[type="hidden"]')).toBeInTheDocument();
		expect(container.querySelector("label")).toBeNull();
		rerender(<ConfiguredElement element={element("INPUT_HIDDEN")} />);
		expect(container).toBeEmptyDOMElement();
	});
	it("abre drawer, renderiza filhos e fecha", () => {
		render(
			<ConfiguredElement
				element={element("DRAWER", {
					label: "Detalhes",
					elements: [element("TEXT", { text: "Conteúdo" })],
				})}
			/>,
		);
		expect(screen.queryByRole("dialog")).toBeNull();
		fireEvent.click(screen.getByRole("button", { name: "Detalhes" }));
		expect(screen.getByRole("dialog")).toHaveTextContent("Conteúdo");
		fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
		expect(screen.queryByRole("dialog")).toBeNull();
	});
	it("seleciona abas com descrição ou filho renderizado", () => {
		const { rerender } = render(
			<ConfiguredElement
				element={element("TABS", {
					items: [
						{ title: "A", description: "Primeiro" },
						{ id: "b", title: "B", description: "Segundo" },
					],
				})}
			/>,
		);
		expect(screen.getByRole("tabpanel")).toHaveTextContent("Primeiro");
		fireEvent.click(screen.getByRole("tab", { name: "B" }));
		expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByRole("tabpanel")).toHaveTextContent("Segundo");
		rerender(
			<ConfiguredElement
				element={element("TABS", {
					items: [{ title: "A" }, { title: "B" }],
					elements: [element("TEXT"), element("TEXT")],
				})}
				renderElement={() => <p>Filho</p>}
			/>,
		);
		expect(screen.getByRole("tabpanel")).toHaveTextContent("Filho");
	});
	it("ícone tem nome acessível e valor é resolvido por prioridade", () => {
		const { rerender } = render(
			<ConfiguredElement element={element("ICON", { text: "Porto" })} />,
		);
		expect(screen.getByRole("img", { name: "Porto" })).toHaveTextContent(
			"Porto",
		);
		rerender(
			<ConfiguredElement element={element("ICON", { label: "Porto" })} />,
		);
		expect(screen.getByRole("img", { name: "Porto" })).toHaveTextContent("•");
		rerender(
			<ConfiguredElement
				element={element("LABEL_VALUE", {
					label: "Preço",
					value: 50,
					sourcePath: "price",
				})}
				values={{ price: 100 }}
			/>,
		);
		expect(screen.getByText("100")).toBeInTheDocument();
		rerender(
			<ConfiguredElement
				element={element("LABEL_VALUE", { title: "Preço", value: 50 })}
			/>,
		);
		expect(screen.getByText("50")).toBeInTheDocument();
		rerender(
			<ConfiguredElement
				element={element("LABEL_VALUE", { label: "Preço" })}
			/>,
		);
		expect(screen.getByText("Preço").nextSibling?.textContent).toBe("");
	});
	it("confirma navegação antes de chamar o callback", () => {
		const onNavigate = vi.fn(),
			confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
		const { rerender } = render(
			<ConfiguredElement
				element={element("CONFIRM_NAVIGATION_BUTTON", { url: "dados" })}
				onNavigate={onNavigate}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
		expect(onNavigate).not.toHaveBeenCalled();
		confirm.mockReturnValue(true);
		fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
		expect(onNavigate).toHaveBeenCalledWith("dados");
		rerender(
			<ConfiguredElement
				element={element("CONFIRM_NAVIGATION_BUTTON", {
					label: "Ir",
					description: "Confirma?",
				})}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Ir" }));
		expect(confirm).toHaveBeenCalledWith("Confirma?");
	});
	it("renderiza conteúdo, links, lista e notificação sem inventar campos", () => {
		const { rerender } = render(
			<ConfiguredElement
				element={element("NOTIFICATION", {
					title: "Título",
					text: "Texto",
					description: "Descrição",
					url: "/porto",
					items: [
						{
							id: "a",
							title: "Produto",
							description: "Detalhes",
							url: "/produto",
						},
						{ title: "Outro" },
						{},
					],
					elements: [element("TEXT", { text: "Filho" })],
				})}
			/>,
		);
		expect(screen.getByRole("status")).toHaveTextContent("Filho");
		expect(screen.getByRole("link", { name: "Título" })).toHaveAttribute(
			"href",
			"/porto",
		);
		expect(screen.getByRole("link", { name: "Saiba mais" })).toHaveAttribute(
			"href",
			"/produto",
		);
		expect(screen.getAllByRole("listitem")).toHaveLength(3);
		rerender(
			<ConfiguredElement element={element("CONTENT", { url: "/porto" })} />,
		);
		expect(
			screen.getByRole("link", { name: "Saiba mais" }),
		).toBeInTheDocument();
	});
});
