"use client";
import { useCallback, useState } from "react";
export function useAddressErrorHandler() {
	const [error, setError] = useState("");
	const handleError = useCallback(
		(error: unknown) =>
			setError(
				error instanceof Error
					? error.message
					: "Não foi possível carregar os dados.",
			),
		[],
	);
	return { error, handleError, clearError: () => setError("") };
}
