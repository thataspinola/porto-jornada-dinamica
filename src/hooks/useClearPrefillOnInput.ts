"use client";
import { useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";
export function useClearPrefillOnInput(
	setValue: UseFormSetValue<Record<string, unknown>>,
	names: string[],
) {
	return useCallback(() => {
		for (const name of names) setValue(name, "", { shouldValidate: true });
	}, [names, setValue]);
}
