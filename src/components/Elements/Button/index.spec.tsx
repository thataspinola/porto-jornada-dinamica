import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./index";

describe("Button", () => {
	it("Should render correctly with default values", () => {
		render(<Button>Clique aqui</Button>);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass("btn");
		expect(button).toHaveClass("--insurance-primary");
		expect(button).toHaveClass("--large");
		expect(button).toHaveClass("--fluid");
		expect(button).toHaveTextContent("Clique aqui");
		expect(button).not.toBeDisabled();
	});

	it("Should render with custom variant", () => {
		render(<Button variant="banking">Botão bancário</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("--banking-primary");
		expect(button).not.toHaveClass("--insurance-primary");
	});

	it("Should render with custom style", () => {
		render(<Button styles="secondary">Botão secundário</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("--insurance-secondary");
		expect(button).not.toHaveClass("--insurance-primary");
	});

	it("Should render with custom size", () => {
		render(<Button size="small">Botão pequeno</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("--small");
		expect(button).not.toHaveClass("--large");
	});

	it("Should render with custom width", () => {
		render(<Button width="fluid">Botão fluido</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("--fluid");
		expect(button).not.toHaveClass("--contain");
	});

	it("Should render as disabled", () => {
		render(<Button disabled>Botão desabilitado</Button>);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		expect(button).toHaveClass("--disabled-primary");
		expect(button).not.toHaveClass("--insurance-primary");
	});

	it("Should render with loading state", () => {
		render(<Button isLoading>Botão carregando</Button>);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();

		// Verificar se o loader está presente
		const loader = button.querySelector(".btn__loader");
		expect(loader).toBeInTheDocument();

		// Verificar se o conteúdo do botão não está visível
		expect(button).not.toHaveTextContent("Botão carregando");
	});

	it("Should apply additional CSS classes", () => {
		render(<Button className="custom-class">Botão customizado</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("custom-class");
		expect(button).toHaveClass("btn");
	});

	it("Should call onClick event when clicked", () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Botão clicável</Button>);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("Should not call onClick event when disabled", () => {
		const handleClick = jest.fn();
		render(
			<Button onClick={handleClick} disabled>
				Botão desabilitado
			</Button>
		);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it("Should pass additional HTML attributes to the button element", () => {
		render(
			<Button
				type="submit"
				aria-label="Enviar formulário"
				title="Clique para enviar"
				data-testid="submit-button"
			>
				Enviar
			</Button>
		);

		const button = screen.getByTestId("submit-button");
		expect(button).toHaveAttribute("type", "submit");
		expect(button).toHaveAttribute("aria-label", "Enviar formulário");
		expect(button).toHaveAttribute("title", "Clique para enviar");
	});

	it("Should combine multiple custom properties", () => {
		render(
			<Button variant="health" styles="ghost" size="small" width="fluid" className="custom-class">
				Botão personalizado
			</Button>
		);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("--health-ghost");
		expect(button).toHaveClass("--small");
		expect(button).toHaveClass("--fluid");
		expect(button).toHaveClass("custom-class");
	});

	it("Should prioritize disabled class over variant when disabled", () => {
		render(
			<Button variant="negative" styles="secondary" disabled>
				Botão desabilitado
			</Button>
		);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("--disabled-secondary");
		expect(button).not.toHaveClass("--negative-secondary");
	});
});
