import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { Input } from "./Input";

jest.mock("./Input.scss", () => ({}));

jest.mock("@/components/UI/Loader", () => ({
	Loader: ({ className, color }: { className?: string; color?: string }) => (
		<div data-testid="mock-loader" className={className} data-color={color} />
	),
}));

const makeSut = (props: Partial<ComponentProps<typeof Input>> = {}) => {
	const result = render(<Input {...props} />);
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

describe("Input", () => {
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

		expect(label).not.toBeInTheDocument();
		expect(loader).not.toBeInTheDocument();
		expect(helperText).not.toBeInTheDocument();
		expect(errorMessage).not.toBeInTheDocument();
	});

	it("should render with label when provided", () => {
		const { label } = makeSut({ label: "Name", name: "name" });

		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent("Name");
		expect(label).toHaveAttribute("for", "name");
	});

	it("should render with value when provided", () => {
		const { inputField, inputRoot } = makeSut({ value: "Sample text" });

		expect(inputField).toHaveValue("Sample text");
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
		expect(loader).toHaveAttribute("data-color", "neutral-100");
	});

	it("should render with helper text when provided", () => {
		const { helperText } = makeSut({ helperText: "Helper text content" });

		expect(helperText).toBeInTheDocument();
		expect(helperText).toHaveTextContent("Helper text content");
	});

	it("should render with error message when provided", () => {
		const { errorMessage, inputRoot } = makeSut({
			errorMessage: "Error message content",
		});

		expect(errorMessage).toBeInTheDocument();
		expect(errorMessage).toHaveTextContent("Error message content");
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

		fireEvent.change(inputField, { target: { value: "New value" } });

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("should render with outlined variant", () => {
		const { inputRoot } = makeSut({ variant: "outlined" });

		expect(inputRoot).toHaveClass("--outlined");
		expect(inputRoot).not.toHaveClass("--default");
	});

	it("should render with fluid width", () => {
		const { inputRoot } = makeSut({ width: "fluid" });

		expect(inputRoot).toHaveClass("--fluid");
	});

	it("should apply custom CSS classes", () => {
		const { inputRoot } = makeSut({ className: "custom-class" });

		expect(inputRoot).toHaveClass("custom-class");
		expect(inputRoot).toHaveClass("input__root");
	});

	it("should pass additional HTML attributes to the root element", () => {
		const { inputRoot } = makeSut({
			"aria-label": "Text field",
			title: "Input title",
		} as any);

		expect(inputRoot).toHaveAttribute("aria-label", "Text field");
		expect(inputRoot).toHaveAttribute("title", "Input title");
	});

	it("should render with correct name and id", () => {
		const { inputField } = makeSut({ name: "username" });

		expect(inputField).toHaveAttribute("name", "username");
		expect(inputField).toHaveAttribute("id", "username");
	});

	it("should handle non-string values correctly", () => {
		const { inputField, inputRoot } = makeSut({ value: "123" });

		expect(inputField).toHaveValue("123");
		expect(inputRoot).toHaveClass("--filled");
	});
});
