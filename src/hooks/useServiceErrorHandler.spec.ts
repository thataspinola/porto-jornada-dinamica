import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useServiceErrorHandler } from "./useServiceErrorHandler";
describe("useServiceErrorHandler", () => {
	it.each([
		"emprestimo-com-garantia-de-veiculo",
		"financiamento-de-veiculos",
	])("marca taxvat como server em %s", (slug) => {
		const setError = vi.fn();
		const { result } = renderHook(() => useServiceErrorHandler(setError));
		expect(result.current({ success: false, code: "NOT_ELIGIBLE" }, slug)).toBe(
			true,
		);
		expect(setError).toHaveBeenCalledWith("taxvat", {
			type: "server",
			message: "Produto indisponível para este CPF.",
		});
	});
	it("usa o nome do CPF configurado e preserva a mensagem do serviço", () => {
		const setError = vi.fn();
		const { result } = renderHook(() => useServiceErrorHandler(setError));
		result.current(
			{ success: false, error: "NOT_ELIGIBLE", message: "Não elegível" },
			"financiamento-de-veiculos",
			"cpf",
		);
		expect(setError).toHaveBeenCalledWith("cpf", {
			type: "server",
			message: "Não elegível",
		});
	});
	it.each([
		{ success: true, code: "NOT_ELIGIBLE" },
		{ success: false, code: "TIMEOUT" },
	])("não marca outros resultados: %j", (serviceResult) => {
		const setError = vi.fn();
		const { result } = renderHook(() => useServiceErrorHandler(setError));
		expect(result.current(serviceResult, "financiamento-de-veiculos")).toBe(
			false,
		);
		expect(setError).not.toHaveBeenCalled();
	});
	it("não altera outras jornadas", () => {
		const setError = vi.fn();
		const { result } = renderHook(() => useServiceErrorHandler(setError));
		expect(
			result.current({ success: false, code: "NOT_ELIGIBLE" }, "seguro-bike"),
		).toBe(false);
		expect(setError).not.toHaveBeenCalled();
	});
});
