import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dialog } from "@/components/UI/Dialog/Dialog";
test("abre e fecha conforme a prop", () => {
	const { rerender } = render(
		<Dialog isOpen title="Detalhes">
			Conteúdo
		</Dialog>,
	);
	expect(screen.getByRole("dialog")).toHaveTextContent("Conteúdo");
	rerender(<Dialog isOpen={false} />);
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
test("overlay fecha e corpo não fecha", () => {
	const onClose = vi.fn();
	render(<Dialog isOpen onClose={onClose} title="Detalhes" />);
	fireEvent.click(screen.getByRole("dialog"));
	expect(onClose).not.toHaveBeenCalled();
	fireEvent.click(screen.getByRole("dialog").parentElement!);
	expect(onClose).toHaveBeenCalledTimes(1);
});
test("renderiza ícone declarativo e footer", () => {
	render(<Dialog isOpen icon={{ iconName: "info" }} footer="Continuar" />);
	expect(screen.getByLabelText("info")).toBeInTheDocument();
	expect(screen.getByText("Continuar")).toBeInTheDocument();
});
