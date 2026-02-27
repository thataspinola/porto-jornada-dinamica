import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { Textarea } from "./index";

jest.mock("./styles.scss", () => ({}));

const mockClsx = jest.fn((...args: unknown[]) =>
	args.filter(Boolean).join(" "),
);
jest.mock("@/utils", () => ({
	clsx: (...args: unknown[]) => mockClsx(...args),
}));

const makeSut = (props: Partial<ComponentProps<typeof Textarea>> = {}) => {
	const result = render(<Textarea data-testid="textarea-root" {...props} />);
	return {
		...result,
		textareaRoot: screen.getByTestId("textarea-root"),
		textareaField: screen.queryByRole("textbox") as HTMLTextAreaElement,
		getCounter: (current: number, max: number = 200) =>
			screen.getByText(`${current} / ${max}`),
		getErrorMessage: (message: string) => screen.getByText(message),
		getHelperText: (text: string) => screen.getByText(text),
		getLabel: (text: string) => screen.getByText(text),
	};
};

describe("Textarea", () => {
	beforeEach(() => {
		mockClsx.mockClear();
	});

	it("should render correctly with default values", () => {
		const { textareaRoot, textareaField } = makeSut();

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": false,
				"--error": false,
			},
			"",
		);

		expect(textareaRoot).toBeInTheDocument();
		expect(textareaField).toBeInTheDocument();
		expect(textareaField).toHaveClass("textarea__field");
		expect(textareaField).toHaveAttribute("rows", "5");

		const counter = screen.getByText("0 / 200");
		expect(counter).toBeInTheDocument();
		expect(counter).toHaveClass("textarea__counter");
	});

	it("should render with label when provided", () => {
		const { getLabel } = makeSut({ label: "Description", name: "description" });

		const label = getLabel("Description");
		expect(label).toBeInTheDocument();
		expect(label).toHaveClass("textarea__label");
		expect(label).toHaveAttribute("for", "description");
	});

	it("should render with custom number of rows", () => {
		const { textareaField } = makeSut({ rows: 10 });

		expect(textareaField).toHaveAttribute("rows", "10");
	});

	it("should apply --filled class when it has a value", () => {
		makeSut({ value: "Sample text" });

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": true,
				"--focused": false,
				"--disabled": false,
				"--error": false,
			},
			"",
		);

		expect(screen.getByText("11 / 200")).toBeInTheDocument();
	});

	it("should apply --disabled class when disabled=true", () => {
		const { textareaField } = makeSut({ disabled: true });

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": true,
				"--error": false,
			},
			"",
		);

		expect(textareaField).toBeDisabled();
	});

	it("should apply --error class when error message is provided", () => {
		const { getErrorMessage } = makeSut({ errorMessage: "Required field" });

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": false,
				"--error": true,
			},
			"",
		);

		const errorMessage = getErrorMessage("Required field");
		expect(errorMessage).toBeInTheDocument();
		expect(errorMessage).toHaveClass("input__error-message");
	});

	it("should render helper text when provided", () => {
		const { getHelperText } = makeSut({ helperText: "Max 200 characters" });

		const helperText = getHelperText("Max 200 characters");
		expect(helperText).toBeInTheDocument();
		expect(helperText).toHaveClass("input__helper-text");
	});

	it("should prioritize error message over helper text", () => {
		makeSut({
			helperText: "Max 200 characters",
			errorMessage: "Required field",
		});

		expect(screen.getByText("Required field")).toBeInTheDocument();
		expect(screen.queryByText("Max 200 characters")).not.toBeInTheDocument();
	});

	it("should apply --focused class on focus and remove on blur", () => {
		const { textareaField } = makeSut();

		fireEvent.focus(textareaField);
		expect(mockClsx).toHaveBeenLastCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": true,
				"--disabled": false,
				"--error": false,
			},
			"",
		);

		fireEvent.blur(textareaField);
		expect(mockClsx).toHaveBeenLastCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": false,
				"--error": false,
			},
			"",
		);
	});

	it("should not apply --focused class when disabled", () => {
		const { textareaField } = makeSut({ disabled: true });

		fireEvent.focus(textareaField);
		expect(mockClsx).toHaveBeenLastCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": true,
				"--error": false,
			},
			"",
		);
	});

	it("should call onChange when value changes", () => {
		const handleChange = jest.fn();
		const { textareaField } = makeSut({ onChange: handleChange });

		fireEvent.change(textareaField, { target: { value: "New text" } });
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("should render with outlined variant", () => {
		makeSut({ variant: "outlined" });

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--outlined",
			"--contain",
			expect.anything(),
			"",
		);
	});

	it("should render with fluid width", () => {
		makeSut({ width: "fluid" });

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--default",
			"--fluid",
			expect.anything(),
			"",
		);
	});

	it("should pass additional HTML attributes to the root element", () => {
		const { textareaRoot } = makeSut({
			"aria-label": "Description field",
			title: "Enter description here",
		} as any);

		expect(textareaRoot).toHaveAttribute("aria-label", "Description field");
		expect(textareaRoot).toHaveAttribute("title", "Enter description here");
	});

	it("should render with correct name and id", () => {
		const { textareaField } = makeSut({ name: "comments" });

		expect(textareaField).toHaveAttribute("name", "comments");
		expect(textareaField).toHaveAttribute("id", "comments");
	});
});
