"use client";
import { useCallback } from "react";
import type { ServiceResult } from "@/services";
export type SetFormError = (field: string, error: {
	type: "server";
	message: string;
}) => void;
export function useServiceErrorHandler(setFormError: SetFormError) {
	return useCallback((result: ServiceResult, journeySlug: string, cpfField = "taxvat") => {
		const code = result.code ?? result.error;
		if (result.success || code !== "NOT_ELIGIBLE" ||
			!["emprestimo-com-garantia-de-veiculo", "financiamento-de-veiculos"].includes(journeySlug))
			return false;
		setFormError(cpfField, {
			type: "server", message: result.message ?? "Produto indisponível para este CPF.",
		});
		return true;
	}, [setFormError]);
}
