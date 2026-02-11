import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Checkbox } from ".";

describe("<Checkbox />", () => {
	it("Should render correctly with default values", () => {
		render(<Checkbox data-testid="checkbox" />);

		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).toHaveClass("checkbox__root");
		expect(checkbox).toHaveClass("--default");

		const svg = checkbox.querySelector("svg.checkbox__svg");
		expect(svg).toBeInTheDocument();

		const label = checkbox.querySelector(".checkbox__label");
		expect(label).toBeInTheDocument();
		expect(label).toBeEmptyDOMElement();
	});

	it("Should display label text correctly", () => {
		render(<Checkbox label="Aceito os termos" data-testid="checkbox" />);

		const label = screen.getByText("Aceito os termos");
		expect(label).toBeInTheDocument();
		expect(label).toHaveClass("checkbox__label");
	});

	it("Should be able apply the 'checked' variant", () => {
		render(<Checkbox variant="checked" data-testid="checkbox" />);
		expect(screen.getByTestId("checkbox")).toHaveClass("--checked");
	});

	it("Should be able apply the 'disabled' variant", () => {
		render(<Checkbox variant="disabled" data-testid="checkbox" />);
		expect(screen.getByTestId("checkbox")).toHaveClass("--disabled");
	});

	it("Should apply additional CSS classes", () => {
		render(<Checkbox className="custom-class" data-testid="checkbox" />);
		expect(screen.getByTestId("checkbox")).toHaveClass("custom-class");
	});

	it("Should pass HTML attributes to the root element", () => {
		render(
			<Checkbox
				data-testid="checkbox"
				aria-label="Caixa de seleção"
				role="checkbox"
				aria-checked="false"
			/>
		);

		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toHaveAttribute("aria-label", "Caixa de seleção");
		expect(checkbox).toHaveAttribute("role", "checkbox");
		expect(checkbox).toHaveAttribute("aria-checked", "false");
	});

	it("Should apply the title correctly in the visual input", () => {
		render(<Checkbox title="Título" data-testid="checkbox" />);
		const inputDiv = screen.getByTitle("Título");
		expect(inputDiv).toHaveClass("checkbox__input");
	});

	it("Should render HTML in label using dangerouslySetInnerHTML", () => {
		render(<Checkbox label="Aceito os <strong>termos</strong>" data-testid="checkbox" />);
		const label = screen.getByTestId("checkbox").querySelector(".checkbox__label");
		expect(label?.innerHTML).toContain("<strong>termos</strong>");
	});

	it("Should renders SVG with correct attributes", () => {
		render(<Checkbox data-testid="checkbox" />);
		const svg = screen.getByTestId("checkbox").querySelector("svg.checkbox__svg");

		expect(svg).toHaveAttribute("width", "21");
		expect(svg).toHaveAttribute("height", "20");
		expect(svg).toHaveAttribute("viewBox", "0 0 21 20");
		expect(svg).toHaveAttribute("fill", "none");

		const path = svg?.querySelector("path");
		expect(path).toHaveAttribute("stroke", "white");
		expect(path).toHaveAttribute("stroke-width", "3");
		expect(path).toHaveAttribute("stroke-linecap", "round");
		expect(path).toHaveAttribute("stroke-linejoin", "round");
	});
});
