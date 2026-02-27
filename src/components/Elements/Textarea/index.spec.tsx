import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Textarea } from "./index";

// Mock dos estilos
jest.mock("./styles.scss", () => ({}));

// Mock do utilitário clsx
const mockClsx = jest.fn((...args: unknown[]) => args.filter(Boolean).join(" "));
jest.mock("@/utils", () => ({
	clsx: (...args: unknown[]) => mockClsx(...args),
}));

describe("Textarea", () => {
	beforeEach(() => {
		mockClsx.mockClear();
	});

	it("deve renderizar corretamente com valores padrão", () => {
		render(<Textarea data-testid="textarea-root" />);

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
			""
		);

		const textareaRoot = screen.getByTestId("textarea-root");
		expect(textareaRoot).toBeInTheDocument();

		const textareaField = screen.getByRole("textbox");
		expect(textareaField).toBeInTheDocument();
		expect(textareaField).toHaveClass("textarea__field");
		expect(textareaField).toHaveAttribute("rows", "5");

		const counter = screen.getByText("0 / 200");
		expect(counter).toBeInTheDocument();
		expect(counter).toHaveClass("textarea__counter");
	});

	it("deve renderizar com label quando fornecido", () => {
		render(<Textarea label="Descrição" name="description" />);

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
			""
		);

		const label = screen.getByText("Descrição");
		expect(label).toBeInTheDocument();
		expect(label).toHaveClass("textarea__label");
		expect(label).toHaveAttribute("for", "description");
	});

	it("deve renderizar com número personalizado de linhas", () => {
		render(<Textarea rows={10} data-testid="textarea-root" />);

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
			""
		);

		const textareaField = screen.getByRole("textbox");
		expect(textareaField).toHaveAttribute("rows", "10");
	});

	it("deve aplicar classe --filled quando tem valor", () => {
		render(<Textarea value="Texto de exemplo" data-testid="textarea-root" />);

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
			""
		);

		const counter = screen.getByText("16 / 200");
		expect(counter).toBeInTheDocument();
	});

	it("deve aplicar classe --disabled quando desabilitado", () => {
		render(<Textarea disabled data-testid="textarea-root" />);

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
			""
		);

		const textareaField = screen.getByRole("textbox");
		expect(textareaField).toHaveAttribute("disabled");
	});

	it("deve aplicar classe --error quando tem mensagem de erro", () => {
		render(<Textarea errorMessage="Campo obrigatório" data-testid="textarea-root" />);

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
			""
		);

		const errorMessage = screen.getByText("Campo obrigatório");
		expect(errorMessage).toBeInTheDocument();
		expect(errorMessage).toHaveClass("input__error-message");
	});

	it("deve renderizar texto de ajuda quando fornecido", () => {
		render(<Textarea helperText="Máximo de 200 caracteres" data-testid="textarea-root" />);

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
			""
		);

		const helperText = screen.getByText("Máximo de 200 caracteres");
		expect(helperText).toBeInTheDocument();
		expect(helperText).toHaveClass("input__helper-text");
	});

	it("deve priorizar mensagem de erro sobre texto de ajuda", () => {
		render(
			<Textarea
				helperText="Máximo de 200 caracteres"
				errorMessage="Campo obrigatório"
				data-testid="textarea-root"
			/>
		);

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
			""
		);

		const errorMessage = screen.getByText("Campo obrigatório");
		expect(errorMessage).toBeInTheDocument();

		const helperText = screen.queryByText("Máximo de 200 caracteres");
		expect(helperText).not.toBeInTheDocument();
	});

	it("deve aplicar classe --focused ao receber foco", () => {
		render(<Textarea data-testid="textarea-root" />);

		const textareaField = screen.getByRole("textbox");

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
			""
		);

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
			""
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
			""
		);
	});

	it("não deve aplicar classe --focused quando desabilitado", () => {
		render(<Textarea disabled data-testid="textarea-root" />);

		const textareaField = screen.getByRole("textbox");
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
			""
		);

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
			""
		);
	});

	it("não deve aplicar classe --focused quando tem erro", () => {
		render(<Textarea errorMessage="Campo obrigatório" data-testid="textarea-root" />);

		expect(mockClsx).toHaveBeenLastCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": false,
				"--error": true,
			},
			""
		);

		expect(mockClsx).toHaveBeenLastCalledWith(
			"textarea__root",
			"--default",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": false,
				"--error": true,
			},
			""
		);
	});

	it("deve chamar onChange quando o valor é alterado", () => {
		const handleChange = jest.fn();
		render(<Textarea onChange={handleChange} data-testid="textarea-root" />);

		const textareaField = screen.getByRole("textbox");

		fireEvent.change(textareaField, { target: { value: "Novo texto" } });

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it("deve renderizar com variante outlined", () => {
		render(<Textarea variant="outlined" data-testid="textarea-root" />);

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--outlined",
			"--contain",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": false,
				"--error": false,
			},
			""
		);
	});

	it("deve renderizar com largura fluid", () => {
		render(<Textarea width="fluid" data-testid="textarea-root" />);

		expect(mockClsx).toHaveBeenCalledWith(
			"textarea__root",
			"--default",
			"--fluid",
			{
				"--filled": false,
				"--focused": false,
				"--disabled": false,
				"--error": false,
			},
			""
		);
	});

	it("deve passar atributos HTML adicionais para o elemento raiz", () => {
		render(
			<Textarea
				data-testid="textarea-root"
				aria-label="Campo de descrição"
				title="Insira sua descrição aqui"
			/>
		);

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
			""
		);

		const textareaRoot = screen.getByTestId("textarea-root");
		expect(textareaRoot).toHaveAttribute("aria-label", "Campo de descrição");
		expect(textareaRoot).toHaveAttribute("title", "Insira sua descrição aqui");
	});

	it("deve renderizar com nome e id corretos", () => {
		render(<Textarea name="comments" data-testid="textarea-root" />);

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
			""
		);

		const textareaField = screen.getByRole("textbox");
		expect(textareaField).toHaveAttribute("name", "comments");
		expect(textareaField).toHaveAttribute("id", "comments");
	});
});
