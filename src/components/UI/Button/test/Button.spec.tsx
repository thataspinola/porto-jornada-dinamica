import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@/components/UI/Button/index";

const makeSut = (props: any = {}) => {
	const defaultProps = {
		children: "Button",
		...props,
	};

	const result = render(<Button {...defaultProps} />);

	return {
		...result,
		props: defaultProps,
		button:
			screen.queryByRole("button") ||
			(result.container.firstChild as HTMLElement),
	};
};

describe("Button", () => {
	it("Should render correctly with default values", () => {
		const { button } = makeSut({ children: "Clique aqui" });

		expect(button).toBeInTheDocument();
		expect(button).toHaveClass("btn");
		expect(button).toHaveClass("--insurance-primary");
		expect(button).toHaveClass("--large");
		expect(button).toHaveClass("--fluid");
		expect(button).toHaveTextContent("Clique aqui");
		expect(button).not.toBeDisabled();
	});

	it("Should render with custom variant", () => {
		const { button } = makeSut({
			variant: "banking",
			children: "Botão bancário",
		});

		expect(button).toHaveClass("--banking-primary");
		expect(button).not.toHaveClass("--insurance-primary");
	});

	it("Should render with custom style", () => {
		const { button } = makeSut({
			styles: "secondary",
			children: "Botão secundário",
		});

		expect(button).toHaveClass("--insurance-secondary");
		expect(button).not.toHaveClass("--insurance-primary");
	});

	it("Should render with custom size", () => {
		const { button } = makeSut({ size: "small" });

		expect(button).toHaveClass("--small");
		expect(button).not.toHaveClass("--large");
	});

	it("Should render with custom width", () => {
		const { button } = makeSut({ width: "fluid" });

		expect(button).toHaveClass("--fluid");
		expect(button).not.toHaveClass("--contain");
	});

	it("Should render as disabled", () => {
		const { button } = makeSut({ disabled: true });

		expect(button).toBeDisabled();
		expect(button).toHaveClass("--disabled-primary");
		expect(button).not.toHaveClass("--insurance-primary");
	});

	it("Should render with loading state", () => {
		const { button } = makeSut({
			isLoading: true,
			children: "Botão carregando",
		});

		expect(button).toBeInTheDocument();
		const loader = button.querySelector(".loader");
		expect(loader).toBeInTheDocument();
		expect(button).not.toHaveTextContent("Botão carregando");
	});

	it("Should apply additional CSS classes", () => {
		const { button } = makeSut({ className: "custom-class" });

		expect(button).toHaveClass("custom-class");
		expect(button).toHaveClass("btn");
	});

	it("Should call onClick event when clicked", () => {
		const handleClick = vi.fn();
		const { button } = makeSut({ onClick: handleClick });

		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("Should not call onClick event when disabled", () => {
		const handleClick = vi.fn();
		const { button } = makeSut({ onClick: handleClick, disabled: true });

		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("Should pass additional HTML attributes to the button element", () => {
		const { getByTestId } = makeSut({
			type: "submit",
			"aria-label": "Enviar formulário",
			title: "Clique para enviar",
			"data-testid": "submit-button",
		});

		const button = getByTestId("submit-button");
		expect(button).toHaveAttribute("type", "submit");
		expect(button).toHaveAttribute("aria-label", "Enviar formulário");
		expect(button).toHaveAttribute("title", "Clique para enviar");
	});

	it("Should combine multiple custom properties", () => {
		const { button } = makeSut({
			variant: "health",
			styles: "ghost",
			size: "small",
			width: "fluid",
			className: "custom-class",
		});

		expect(button).toHaveClass("--health-ghost");
		expect(button).toHaveClass("--small");
		expect(button).toHaveClass("--fluid");
		expect(button).toHaveClass("custom-class");
	});

	it("Should prioritize disabled class over variant when disabled", () => {
		const { button } = makeSut({
			variant: "negative",
			styles: "secondary",
			disabled: true,
		});

		expect(button).toHaveClass("--disabled-secondary");
		expect(button).not.toHaveClass("--negative-secondary");
	});
});
