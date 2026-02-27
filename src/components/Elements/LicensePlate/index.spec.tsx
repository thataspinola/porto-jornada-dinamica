import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { LicensePlate } from "./index";

jest.mock("./styles.scss", () => ({}));

jest.mock("../Loader", () => ({
	Loader: ({ className, color }: { className?: string; color?: string }) => (
		<div data-testid="mock-loader" className={className} data-color={color} />
	),
}));

const makeSut = (props: Partial<ComponentProps<typeof LicensePlate>> = {}) => {
	const result = render(<LicensePlate {...props} />);
	return {
		...result,
		inputField: screen.queryByRole("textbox") as HTMLInputElement,
		inputRoot: result.container.querySelector(".input__root"),
		label: result.container.querySelector(".input__label"),
		helperText: result.container.querySelector(".input__helper-text"),
		errorMessage: result.container.querySelector(".input__error-message"),
		loader: screen.queryByTestId("mock-loader"),
	};
};

describe("LicensePlate", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should render correctly with default values", () => {
		const { inputRoot, inputField, label, loader, helperText, errorMessage } =
			makeSut();

		expect(inputRoot).toBeInTheDocument();
		expect(inputRoot).toHaveClass("--default");
		expect(inputRoot).toHaveClass("--fluid");

		expect(inputField).toBeInTheDocument();
		expect(inputField).toHaveClass("input__field");
		expect(inputField).toHaveAttribute("type", "text");

		expect(label).toBeInTheDocument();
		expect(loader).not.toBeInTheDocument();
		expect(helperText).not.toBeInTheDocument();
		expect(errorMessage).not.toBeInTheDocument();
	});

	it("should render with label when provided", () => {
		const { label } = makeSut({ label: "Plate", name: "license_plate" });

		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent("Plate");
	});

	it("should render with value when provided", () => {
		const { inputField, inputRoot } = makeSut({ value: "ABC1234" });

		expect(inputField).toHaveValue("ABC1234");
		expect(inputRoot).toHaveClass("--filled");
	});

	it("should render as disabled when disabled=true", () => {
		const { inputField, inputRoot } = makeSut({ disabled: true });

		expect(inputField).toBeDisabled();
		expect(inputRoot).toHaveClass("--disabled");
	});

	it("should render with loader when isLoading=true", () => {
		const { loader } = makeSut({ isLoading: true });

		expect(loader).toBeInTheDocument();
		expect(loader).toHaveClass("input__loader");
		expect(loader).toHaveAttribute("data-color", "insurance-900");
	});

	it("should render with helper text when provided", () => {
		const { helperText } = makeSut({ helperText: "Enter your vehicle plate" });

		expect(helperText).toBeInTheDocument();
		expect(helperText).toHaveTextContent("Enter your vehicle plate");
	});

	it("should render with error message when provided", () => {
		const { errorMessage, inputRoot } = makeSut({
			errorMessage: "Invalid plate",
		});

		expect(errorMessage).toBeInTheDocument();
		expect(errorMessage).toHaveTextContent("Invalid plate");
		expect(inputRoot).toHaveClass("--error");
	});

	it("should prioritize error message over helper text", () => {
		const { errorMessage, helperText } = makeSut({
			helperText: "Helper text",
			errorMessage: "Error message",
		});

		expect(errorMessage).toBeInTheDocument();
		expect(helperText).not.toBeInTheDocument();
	});

	it("should apply --focused class on focus and remove on blur", () => {
		const { inputRoot, inputField } = makeSut();

		expect(inputRoot).not.toHaveClass("--focused");

		fireEvent.focus(inputField);
		expect(inputRoot).toHaveClass("--focused");

		fireEvent.blur(inputField);
		expect(inputRoot).not.toHaveClass("--focused");
	});

	it("should not apply --focused class when disabled", () => {
		const { inputRoot, inputField } = makeSut({ disabled: true });

		fireEvent.focus(inputField);
		expect(inputRoot).not.toHaveClass("--focused");
	});

	it("should call onChange when value changes", () => {
		const handleChange = jest.fn();
		const { inputField } = makeSut({ onChange: handleChange });

		fireEvent.change(inputField, { target: { value: "BRA2E20" } });

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("should render with outlined variant", () => {
		const { inputRoot } = makeSut({ variant: "outlined" });

		expect(inputRoot).toHaveClass("--outlined");
		expect(inputRoot).not.toHaveClass("--default");
	});

	it("should apply custom CSS classes", () => {
		const { inputRoot } = makeSut({ className: "custom-class" });

		expect(inputRoot).toHaveClass("custom-class");
		expect(inputRoot).toHaveClass("input__root");
	});

	it("should pass additional HTML attributes to the root element", () => {
		const { inputRoot } = makeSut({
			"aria-label": "License Plate",
			title: "Vehicle plate",
		} as any);

		expect(inputRoot).toHaveAttribute("aria-label", "License Plate");
		expect(inputRoot).toHaveAttribute("title", "Vehicle plate");
	});

	it("should render with correct name and id", () => {
		const { inputField } = makeSut({ name: "plate_id" });

		expect(inputField).toHaveAttribute("name", "plate_id");
		expect(inputField).toHaveAttribute("id", "plate_id");
	});

	it("should handle non-string values correctly", () => {
		const { inputField, inputRoot } = makeSut({ value: "123" });

		expect(inputField).toHaveValue("123");
		expect(inputRoot).toHaveClass("--filled");
	});
});
