import { vi, type Mock } from "vitest";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { journeySchema } from "@/validation/schemas";
import { journeyStore } from "@/store/journeyStore";
import { callService } from "@/services";
import { JourneyBuilder } from "./JourneyBuilder";

vi.mock("@/components/Core/Header", () => ({ Header: () => null }));
vi.mock("@/hooks/useCurrentPathname", () => ({
	useCurrentPathname: () => "/contrate/financiamento-de-veiculos/cpf",
}));
vi.mock("@/services", () => ({ callService: vi.fn() }));

test("CPF válido, negativa real do controller e impressão única dos dois cards", async () => {
	act(() =>
		journeyStore.setState({
			_hasHydrated: true,
			fields: {},
			business: {},
			services: {},
			error: {},
		}),
	);
	window.dataLayer = [];
	(callService as Mock).mockResolvedValue({
		success: false,
		code: "NOT_ELIGIBLE",
		message: "Produto indisponível",
	});
	const journey = journeySchema.parse(
		JSON.parse(
			readFileSync(
				join(
					process.cwd(),
					"public/jsonContent/financiamento-de-veiculos.json",
				),
				"utf8",
			),
		),
	);
	const { rerender } = render(<JourneyBuilder journey={journey} />);
	expect(screen.queryByText("Empréstimo Consignado")).not.toBeInTheDocument();
	fireEvent.change(screen.getByLabelText("CPF"), {
		target: { value: "52998224725" },
	});
	const button = screen.getByRole("button", { name: "Continuar" });
	await waitFor(() => expect(button).not.toBeDisabled());
	fireEvent.click(button);
	await waitFor(() =>
		expect(screen.getByText("Empréstimo Consignado")).toBeInTheDocument(),
	);
	expect(callService).toHaveBeenCalledWith(
		"eligibility",
		expect.objectContaining({ fields: { taxvat: "52998224725" } }),
	);
	expect(window.dataLayer).toHaveLength(1);
	expect(window.dataLayer[0]).toMatchObject({
		event: "view_promotion",
		items: [
			{ item_name: "Empréstimo Consignado" },
			{ item_name: "Empréstimo Pessoal" },
		],
	});
	rerender(<JourneyBuilder journey={journey} />);
	expect(window.dataLayer).toHaveLength(1);
});
