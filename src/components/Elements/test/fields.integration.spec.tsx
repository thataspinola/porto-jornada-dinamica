import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { renderJourneyElement } from "@/components/Core/JourneyRenderElements";
import { journeyElementSchema } from "@/validation/schemas";
import type { ElementRenderContext } from "@/components/Core/JourneyRenderElements/types";

function Field({
	type,
	config,
	error = false,
}: {
	type: string;
	config: Record<string, unknown>;
	error?: boolean;
}) {
	const form = useForm<Record<string, unknown>>();
	const element = journeyElementSchema.parse({ id: "field", type, config });
	const context: ElementRenderContext = {
		register: form.register,
		control: form.control,
		errors: error
			? { field: { type: "server", message: "Dado inválido" } }
			: {},
		goNext: async () => {},
		business: {},
		fields: form.watch(),
		canProceed: true,
		journeySlug: "financiamento-de-veiculos",
	};
	return (
		<>
			{renderJourneyElement(element, context)}
			<output data-testid="value">{JSON.stringify(form.watch())}</output>
		</>
	);
}
describe("formulário e renderer de campos", () => {
	it.each([
		"TEXT_INPUT",
		"PHONE_INPUT",
	])("%s preserva valor no formulário", async (type) => {
		render(<Field type={type} config={{ name: "field", label: "Campo" }} />);
		fireEvent.change(screen.getByLabelText("Campo"), {
			target: { value: "Ana" },
		});
		fireEvent.blur(screen.getByLabelText("Campo"));
		await waitFor(() =>
			expect(screen.getByTestId("value")).toHaveTextContent('"field":"Ana"'),
		);
	});
	it.each(["RADIO", "SELECT"])("%s seleciona opção e expõe erro", (type) => {
		const { rerender } = render(
			<Field
				type={type}
				config={{
					name: "field",
					label: "Opções",
					options: [
						{ label: "Opção A", value: "a" },
						{ label: "Opção B", value: "b" },
					],
				}}
				error
			/>,
		);
		expect(screen.getByText("Dado inválido")).toBeInTheDocument();
		if (type === "RADIO") fireEvent.click(screen.getByLabelText("Opção B"));
		else
			fireEvent.change(screen.getByRole("combobox"), {
				target: { value: "b" },
			});
		expect(screen.getByTestId("value")).toHaveTextContent('"field":"b"');
		rerender(
			<Field
				type={type}
				config={{ name: "field", label: "Opções", options: [] }}
			/>,
		);
		expect(screen.queryByText("Dado inválido")).toBeNull();
	});
	it("checkbox alterna consentimento booleano", () => {
		render(
			<Field type="CHECKBOX" config={{ name: "field", label: "Aceito" }} />,
		);
		fireEvent.click(screen.getByText("Aceito"));
		expect(screen.getByTestId("value")).toHaveTextContent('"field":true');
		fireEvent.click(screen.getByText("Aceito"));
		expect(screen.getByTestId("value")).toHaveTextContent('"field":false');
	});
	it("nome social exige confirmação e sanitiza o nome", async () => {
		render(
			<Field
				type="SOCIAL_NAME"
				config={{ name: "field", label: "Usar nome social" }}
			/>,
		);
		expect(screen.queryByLabelText("Nome social completo")).toBeNull();
		fireEvent.click(screen.getByText("Usar nome social"));
		fireEvent.click(screen.getByRole("button", { name: "Não sou" }));
		expect(screen.queryByLabelText("Nome social completo")).toBeNull();
		fireEvent.click(screen.getByText("Usar nome social"));
		fireEvent.click(screen.getByRole("button", { name: "Sim, eu sou" }));
		fireEvent.change(screen.getByLabelText("Nome social completo"), {
			target: { value: "Ana123" },
		});
		await waitFor(() =>
			expect(screen.getByTestId("value")).toHaveTextContent(
				'"social_name_value":"Ana"',
			),
		);
		fireEvent.click(screen.getByText("Usar nome social"));
		expect(screen.queryByLabelText("Nome social completo")).toBeNull();
		fireEvent.click(screen.getByRole("button", { name: "Não sou" }));
	});
});
