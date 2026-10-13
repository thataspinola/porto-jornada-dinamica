import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Radio } from "./Radio";

const makeSut = (props: any) => {
	return render(<Radio {...props} />);
};

describe("Radio", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Should render correctly with default values", () => {
		const { container } = makeSut({ "data-testid": "radio" });

		const radio = screen.getByTestId("radio");
		expect(radio).toBeInTheDocument();
		expect(radio.className).toContain("radio");
		expect(radio.className).toContain("--default");

		const svg = container.querySelector(".radio__svg");
		expect(svg).toBeInTheDocument();
		expect(svg?.tagName.toLowerCase()).toBe("svg");

		const label = container.querySelector(".radio__label");
		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent("");
	});

	it("Should render with description", () => {
		const { container } = makeSut({
			"data-testid": "radio",
			description: "Opção 1",
		});

		const radio = screen.getByTestId("radio");
		expect(radio).toBeInTheDocument();

		const label = container.querySelector(".radio__label");
		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent("Opção 1");
	});

	it("Should render with checked variant", () => {
		render(<Radio variant="checked" data-testid="radio" />);

		const radio = screen.getByTestId("radio");
		expect(radio.className).toContain("--checked");
		expect(radio.className).not.toContain("--default");
	});

	it("Should render with disabled variant", () => {
		render(<Radio variant="disabled" data-testid="radio" />);

		const radio = screen.getByTestId("radio");
		expect(radio.className).toContain("--disabled");
		expect(radio.className).not.toContain("--default");
	});

	it("Should be able apply additional CSS classes", () => {
		render(<Radio className="custom-class" data-testid="radio" />);

		const radio = screen.getByTestId("radio");
		expect(radio.className).toContain("radio");
		expect(radio.className).toContain("custom-class");
	});

	it("Should be able pass additional HTML attributes to the root element", () => {
		render(
			<Radio
				data-testid="radio"
				aria-label="Opção de rádio"
				title="Selecione esta opção"
				role="radio"
			/>,
		);

		const radio = screen.getByTestId("radio");
		expect(radio).toHaveAttribute("aria-label", "Opção de rádio");
		expect(radio).toHaveAttribute("title", "Selecione esta opção");
		expect(radio).toHaveAttribute("role", "radio");
	});

	it("Should render with long description", () => {
		const longDescription =
			"Esta é uma descrição muito longa para testar como o componente lida com textos extensos que podem quebrar em múltiplas linhas";
		const { container } = render(
			<Radio description={longDescription} data-testid="radio" />,
		);

		const radio = screen.getByTestId("radio");
		expect(radio).toBeInTheDocument();

		const label = container.querySelector(".radio__label");
		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent(longDescription);
	});

	it("Should render the SVG with the correct attributes", () => {
		const { container } = render(<Radio data-testid="radio" />);

		const svg = container.querySelector(".radio__svg");

		expect(svg).toBeInTheDocument();
		expect(svg?.tagName.toLowerCase()).toBe("svg");
		expect(svg?.getAttribute("width")).toBe("21");
		expect(svg?.getAttribute("height")).toBe("20");
		expect(svg?.getAttribute("viewBox")).toBe("0 0 21 20");
		expect(svg?.getAttribute("fill")).toBe("none");
		expect(svg?.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");

		const path = svg?.querySelector("path");
		expect(path).toBeInTheDocument();
		expect(path?.getAttribute("stroke")).toBe("white");
		expect(path?.getAttribute("stroke-width")).toBe("3");
		expect(path?.getAttribute("stroke-linecap")).toBe("round");
		expect(path?.getAttribute("stroke-linejoin")).toBe("round");
	});

	it("Should be clickable when not disabled", () => {
		const handleClick = vi.fn();
		render(<Radio data-testid="radio" onClick={handleClick} />);

		const radio = screen.getByTestId("radio");
		fireEvent.click(radio);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should not call click event when disabled", () => {
		const handleClick = vi.fn();
		render(
			<Radio data-testid="radio" variant="disabled" onClick={handleClick} />,
		);

		const radio = screen.getByTestId("radio");
		fireEvent.click(radio);

		expect(handleClick).not.toHaveBeenCalled();
	});
});
