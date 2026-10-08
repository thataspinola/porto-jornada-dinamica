import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from "./index";

describe("Dropdown", () => {
	const mockOptions = [
		{ value: "option1", label: "Opção 1" },
		{ value: "option2", label: "Opção 2" },
		{ value: "option3", label: "Opção 3" },
	];

	it("Should render correctly", () => {
		render(<Dropdown data-testid="dropdown" />);

		const dropdown = screen.getByTestId("dropdown");
		expect(dropdown).toBeInTheDocument();
		expect(dropdown).toHaveClass("dropdown__root");
		expect(dropdown).toHaveClass("--default");
		expect(dropdown).toHaveClass("--contain");
	});

	it("Should render with label", () => {
		render(<Dropdown label="Selecione uma opção" name="test-dropdown" />);

		const label = screen.getByText("Selecione uma opção");
		expect(label).toBeInTheDocument();
		expect(label).toHaveClass("dropdown__label");
		expect(label).toHaveAttribute("for", "test-dropdown");
	});

	it("Should render with selected value", () => {
		render(<Dropdown value="Valor selecionado" />);

		const input = screen.getByDisplayValue("Valor selecionado");
		expect(input).toBeInTheDocument();
		expect(input).toHaveClass("dropdown__field");
		expect(input).toHaveAttribute("readOnly");
	});

	it("Should render as disabled", () => {
		render(<Dropdown disabled />);

		const dropdown = screen.getByRole("textbox", { hidden: true });
		expect(dropdown.closest(".dropdown__root")).toHaveClass("--disabled");
	});

	it("Should render with error message", () => {
		const errorMessage = "Este campo é obrigatório";
		render(<Dropdown errorMessage={errorMessage} />);

		const error = screen.getByText(errorMessage);
		expect(error).toBeInTheDocument();
		expect(error).toHaveClass("dropdown__error-message");
		expect(error.closest(".dropdown__root")).toHaveClass("--error");
	});

	it("Should render with help text", () => {
		const helperText = "Selecione uma das opções disponíveis";
		render(<Dropdown helperText={helperText} />);

		const helper = screen.getByText(helperText);
		expect(helper).toBeInTheDocument();
		expect(helper).toHaveClass("dropdown__helper-text");
	});

	it("Should prioritize error message over help text", () => {
		const helperText = "Selecione uma das opções disponíveis";
		const errorMessage = "Este campo é obrigatório";

		render(<Dropdown helperText={helperText} errorMessage={errorMessage} />);

		const error = screen.getByText(errorMessage);
		expect(error).toBeInTheDocument();

		const helper = screen.queryByText(helperText);
		expect(helper).not.toBeInTheDocument();
	});

	it("Should render with loader when isLoading=true", () => {
		render(<Dropdown isLoading />);

		const loader = screen.getByTestId("loader");
		expect(loader).toBeInTheDocument();

		const arrow = screen.queryByTestId("arrow-svg");
		expect(arrow).not.toBeInTheDocument();
	});

	it("Should close the list when selecting an option", () => {
		const handleChange = jest.fn();
		render(<Dropdown options={mockOptions} onChange={handleChange} />);

		const trigger = screen
			.getByRole("textbox", { hidden: true })
			.closest(".dropdown__trigger") as any;
		fireEvent.click(trigger);

		const option = screen.getByText("Opção 2");
		fireEvent.click(option);

		expect(handleChange).toHaveBeenCalledWith("option2");

		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("Should not open dropdown when disabled", () => {
		render(<Dropdown options={mockOptions} disabled />);

		const trigger = screen
			.getByRole("textbox", { hidden: true })
			.closest(".dropdown__trigger") as any;
		fireEvent.click(trigger);

		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	it("Should apply variant classes correctly", () => {
		render(<Dropdown variant="outlined" />);

		const dropdown = screen
			.getByRole("textbox", { hidden: true })
			.closest(".dropdown__root");
		expect(dropdown).toHaveClass("--outlined");
		expect(dropdown).not.toHaveClass("--default");
	});

	it("Should apply width classes correctly", () => {
		render(<Dropdown width="fluid" />);

		const dropdown = screen
			.getByRole("textbox", { hidden: true })
			.closest(".dropdown__root");
		expect(dropdown).toHaveClass("--fluid");
		expect(dropdown).not.toHaveClass("--contain");
	});

	it("Should apply custom class", () => {
		render(<Dropdown className="custom-class" />);

		const dropdown = screen
			.getByRole("textbox", { hidden: true })
			.closest(".dropdown__root");
		expect(dropdown).toHaveClass("custom-class");
	});

	it("Should apply class --filled when it has value", () => {
		render(<Dropdown value="option1" />);

		const dropdown = screen
			.getByRole("textbox", { hidden: true })
			.closest(".dropdown__root");
		expect(dropdown).toHaveClass("--filled");
	});

	it("Should apply class --readonly when readOnly=true", () => {
		render(<Dropdown readOnly />);

		const input = screen.getByRole("textbox", { hidden: true });
		expect(input).toHaveClass("--readonly");
	});

	it("Should allow selecting option using keyboard", () => {
		const handleChange = jest.fn();
		render(<Dropdown options={mockOptions} onChange={handleChange} />);

		const trigger = screen
			.getByRole("textbox", { hidden: true })
			.closest(".dropdown__trigger") as any;
		fireEvent.click(trigger);

		const option = screen.getByText("Opção 3");
		fireEvent.keyDown(option, { key: "Enter" });

		expect(handleChange).toHaveBeenCalledWith("option3");

		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});
});
