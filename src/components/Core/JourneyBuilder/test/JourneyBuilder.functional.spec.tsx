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
import { JourneyBuilder } from "@/components/Core/JourneyBuilder/JourneyBuilder";

vi.mock("@/components/Core/Header", () => ({ Header: () => null }));
vi.mock("@/hooks/useCurrentPathname", () => ({
	useCurrentPathname: () => window.location.pathname,
}));
vi.mock("@/services", () => ({ callService: vi.fn() }));

test.each([
	"financiamento-de-veiculos",
	"emprestimo-com-garantia-de-veiculo",
])("CPF válido, negativa e impressão única em %s", async (slug) => {
	window.history.replaceState({}, "", `/contrate/${slug}/cpf`);
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
				join(process.cwd(), `public/jsonContent/${slug}.json`),
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
	await waitFor(() => expect(window.dataLayer).toHaveLength(1));
	expect(window.dataLayer[0]).toMatchObject({
		event: "view_promotion",
		items: [
			{ item_name: "Empréstimo Consignado" },
			{ item_name: "Empréstimo Pessoal" },
		],
	});
	rerender(<JourneyBuilder journey={journey} />);
	await waitFor(() => expect(window.dataLayer).toHaveLength(1));
});
