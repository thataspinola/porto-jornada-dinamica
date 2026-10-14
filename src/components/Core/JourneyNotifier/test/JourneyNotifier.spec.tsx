import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { JourneyNotifier, notify } from "@/components/Core/JourneyNotifier";

describe("notificações de condições", () => {
	it("mostra alerta, executa ação, fecha e limpa listener ao desmontar", () => {
		const onClick = vi.fn(),
			{ container, unmount } = render(<JourneyNotifier />);
		expect(container).toBeEmptyDOMElement();
		act(() =>
			notify({
				type: "error",
				title: "Falha",
				description: "Tente novamente",
				actionButton: { children: "Tentar", onClick },
			}),
		);
		expect(screen.getByRole("alert")).toHaveTextContent("Tente novamente");
		fireEvent.click(screen.getByRole("button", { name: "Tentar" }));
		expect(onClick).toHaveBeenCalledOnce();
		fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
		expect(container).toBeEmptyDOMElement();
		unmount();
		act(() => notify({ type: "success", title: "Fim", description: "" }));
		expect(screen.queryByText("Fim")).toBeNull();
	});
	it("mostra erro em diálogo quando fullscreen", () => {
		render(<JourneyNotifier />);
		act(() =>
			notify({
				type: "error",
				title: "Bloqueado",
				description: "",
				fullscreen: true,
			}),
		);
		expect(screen.getByRole("dialog", { name: "Bloqueado" })).toHaveAttribute(
			"aria-modal",
			"true",
		);
	});
});
