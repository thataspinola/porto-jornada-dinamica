"use client";
import { useEffect } from "react";
import type { ServiceResult } from "@/services";
export function useServiceErrorEffect(
	result: ServiceResult | undefined,
	onError: (result: ServiceResult) => void,
) {
	useEffect(() => {
		if (result && !result.success) onError(result);
	}, [result, onError]);
}
