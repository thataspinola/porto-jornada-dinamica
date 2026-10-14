import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DebugFloatingButton } from "@/components/Core/DebugFloatingButton";
import NotFound from "@/components/Core/ElementNotFound/ElementNotFound";
import { CustomDataAnalytics } from "@/components/Core/CustomDataAnalytics";
import ErrorView from "@/app/error";
import { JourneyParseError } from "@/components/Core/JourneyParseError";
import { StepNotFound } from "@/components/Core/StepNotFound";

describe("diagnóstico e recuperação", () => {
	it("debug mostra dados tipados, atualiza conteúdo e fecha", () => {
		const { rerender } = render(<DebugFloatingButton data={{}} />);
		fireEvent.click(screen.getByTitle("Debug Journey Data"));
		expect(
			screen.getByText("Nenhum dado capturado ainda..."),
		).toBeInTheDocument();
		rerender(
			<DebugFloatingButton
				data={{
					name: "Ana",
					count: 2,
					allowed: true,
					missing: null,
					nested: {},
				}}
			/>,
		);
		expect(screen.getByText("5 campos")).toBeInTheDocument();
		expect(screen.getByText('"Ana"')).toHaveClass("debug-string");
		expect(screen.getByText("true")).toHaveClass("debug-boolean");
		expect(screen.getByText("null")).toHaveClass("debug-null");
		expect(screen.getByText("2")).toHaveClass("debug-number");
		fireEvent.click(screen.getByTitle("Debug Journey Data"));
		expect(screen.queryByText("Journey Debugger")).toBeNull();
	});
	it("página ausente oferece link para home", () => {
		render(<NotFound />);
		expect(screen.getByText("Ops, página não encontrada")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Ir para a página inicial" }),
		).toHaveAttribute("href", "/");
	});
	it("erro de página permite reset", () => {
		const reset = vi.fn();
		render(<ErrorView error={new Error("Falha")} reset={reset} />);
		fireEvent.click(screen.getByRole("button", { name: /Tentar/i }));
		expect(reset).toHaveBeenCalledOnce();
	});
	it.each([
		JourneyParseError,
		StepNotFound,
	])("erro de configuração tem alerta acessível", (Component) => {
		render(<Component />);
		expect(screen.getByRole("alert")).not.toBeEmptyDOMElement();
	});
	it("analytics inicializa dataLayer e envia apenas quando o evento muda", () => {
		delete (window as Partial<Window>).dataLayer;
		const event = { event: "page_view" };
		const { rerender } = render(<CustomDataAnalytics event={event} />);
		expect(window.dataLayer).toEqual([event]);
		rerender(<CustomDataAnalytics event={event} />);
		expect(window.dataLayer).toHaveLength(1);
		rerender(<CustomDataAnalytics event={{ event: "next" }} />);
		expect(window.dataLayer).toHaveLength(2);
	});
});
