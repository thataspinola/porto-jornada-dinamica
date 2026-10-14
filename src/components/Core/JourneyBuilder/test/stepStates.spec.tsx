import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FullScreenErrorView } from "@/components/Core/JourneyBuilder/FullScreenErrorView";
import { StepError } from "@/components/Core/JourneyBuilder/StepError";
import { StepInlineError } from "@/components/Core/JourneyBuilder/StepInlineError";
import { StepSkeleton } from "@/components/Core/JourneyBuilder/StepSkeleton";
import { JourneyWrapper } from "@/components/Core/JourneyBuilder/JourneyWrapper";
import { PrefetchedStep } from "@/components/Core/JourneyBuilder/PrefetchedStep";
import { prefetchActions } from "@/utils/prefetchActions";

vi.mock("@/utils/prefetchActions", () => ({ prefetchActions: vi.fn() }));
describe("estados da etapa", () => {
	it.each([
		StepError,
		StepInlineError,
		FullScreenErrorView,
	])("apresenta erro acessível e permite tentar novamente", (Component) => {
		const retry = vi.fn();
		const { rerender } = render(<Component onRetry={retry} />);
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Não foi possível carregar os dados.",
		);
		fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
		expect(retry).toHaveBeenCalledOnce();
		rerender(<Component message="Sem conexão" />);
		expect(screen.getByRole("alert")).toHaveTextContent("Sem conexão");
		expect(screen.queryByRole("button")).toBeNull();
	});
	it("skeleton informa estado ocupado e wrapper mantém o conteúdo", () => {
		render(
			<JourneyWrapper>
				<StepSkeleton />
			</JourneyWrapper>,
		);
		expect(screen.getByText("Carregando etapa...")).toHaveAttribute(
			"aria-busy",
			"true",
		);
	});
	it("prefetch mostra loading e apresenta conteúdo após sucesso", async () => {
		vi.mocked(prefetchActions).mockResolvedValue([{ success: true }]);
		render(
			<PrefetchedStep actions={[{ service: "lookup" }]}>
				<p>Pronto</p>
			</PrefetchedStep>,
		);
		expect(screen.getByText("Carregando...")).toBeInTheDocument();
		await waitFor(() => expect(screen.getByText("Pronto")).toBeInTheDocument());
	});
	it.each([
		"failure",
		"rejection",
	])("prefetch propaga %s sem mostrar conteúdo", async (failure) => {
		if (failure === "failure")
			vi.mocked(prefetchActions).mockResolvedValue([{ success: false }]);
		else vi.mocked(prefetchActions).mockRejectedValue(new Error("Falha"));
		render(
			<PrefetchedStep actions={[]}>
				<p>Pronto</p>
			</PrefetchedStep>,
		);
		await waitFor(() =>
			expect(screen.getByRole("alert")).toHaveTextContent(
				"Não foi possível carregar os dados",
			),
		);
		expect(screen.queryByText("Pronto")).toBeNull();
	});
});
