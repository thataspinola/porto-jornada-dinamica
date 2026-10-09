import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Spacing } from "./Spacing";

jest.mock("./Spacing.module.scss", () => ({
	spacing: "spacing-class",
	inline: "inline-class",
}));

describe("<Spacing />", () => {
	it("aplica espaçamento vertical com `top` e `bottom`", () => {
		render(<Spacing top="1rem" bottom="2rem" data-testid="spacing" />);
		const el = screen.getByTestId("spacing");

		expect(el).toHaveStyle({ marginTop: "1rem", marginBottom: "2rem" });
		expect(el.style.marginLeft).toBe("");
		expect(el.style.marginRight).toBe("");
	});

	it("aplica espaçamento horizontal com `left` e `right`", () => {
		render(<Spacing left="1em" right="1.5em" data-testid="spacing" />);
		const el = screen.getByTestId("spacing");

		expect(el).toHaveStyle({ marginLeft: "1em", marginRight: "1.5em" });
		expect(el.style.marginTop).toBe("");
		expect(el.style.marginBottom).toBe("");
	});

	it("converte valores numéricos para rem", () => {
		render(
			<Spacing
				top={2}
				bottom={1}
				left={0.5}
				right={1.5}
				data-testid="spacing"
			/>,
		);
		const el = screen.getByTestId("spacing");

		expect(el.style.marginTop).toBe("2rem");
		expect(el.style.marginBottom).toBe("1rem");
		expect(el.style.marginLeft).toBe("0.5rem");
		expect(el.style.marginRight).toBe("1.5rem");
	});

	it("aplica classe inline quando `inline` é true", () => {
		const { rerender } = render(<Spacing data-testid="spacing" />);

		const defaultEl = screen.getByTestId("spacing");
		expect(defaultEl.className).toContain("spacing-class");
		expect(defaultEl.className).not.toContain("inline-class");

		rerender(<Spacing inline data-testid="spacing" />);
		const inlineEl = screen.getByTestId("spacing");
		expect(inlineEl.className).toContain("spacing-class");
		expect(inlineEl.className).toContain("inline-class");
	});

	it("aplica classes CSS personalizadas", () => {
		render(
			<Spacing className="custom-class another-class" data-testid="spacing" />,
		);
		const el = screen.getByTestId("spacing");

		expect(el.className).toContain("custom-class");
		expect(el.className).toContain("another-class");
		expect(el.className).toContain("spacing-class");
	});

	it("aplica estilos inline adicionais e mescla com estilos existentes", () => {
		render(
			<Spacing
				style={{
					backgroundColor: "red",
					padding: "10px",
					marginTop: "5px",
				}}
				top="10px"
				data-testid="spacing"
			/>,
		);

		const el = screen.getByTestId("spacing");

		expect(el).toHaveStyle({
			backgroundColor: "red",
			padding: "10px",
		});

		expect(el.style.marginTop).toBe("10px");
	});

	it("renderiza sem margens por padrão", () => {
		render(<Spacing data-testid="spacing" />);
		const el = screen.getByTestId("spacing");

		expect(el.style.marginTop).toBe("");
		expect(el.style.marginBottom).toBe("");
		expect(el.style.marginLeft).toBe("");
		expect(el.style.marginRight).toBe("");

		expect(el).toHaveAttribute("aria-hidden", "true");
		expect(el).toBeEmptyDOMElement();
	});

	it("retorna null quando tem children", () => {
		const { container } = render(
			<Spacing data-testid="spacing">
				<div data-testid="child">Conteúdo ignorado</div>
			</Spacing>,
		);

		// Verifica que o componente retornou null (sem renderizar nada)
		expect(container.firstChild).toBeNull();

		// Verifica que o children não foi renderizado
		expect(screen.queryByTestId("child")).not.toBeInTheDocument();
		expect(screen.queryByTestId("spacing")).not.toBeInTheDocument();
	});

	it("aplica o data-testid corretamente", () => {
		render(<Spacing data-testid="custom-test-id" />);
		const el = screen.getByTestId("custom-test-id");
		expect(el).toBeInTheDocument();
	});
});
