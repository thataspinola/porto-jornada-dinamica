"use client";
import { useCallback, useRef, useState } from "react";
import { callService, type ServiceResult } from "@/services";
export function useJourneyService() {
	const pending = useRef(false);
	const [isLoading, setLoading] = useState(false);
	const [result, setResult] = useState<ServiceResult>();
	const execute = useCallback(async (name: string, input: unknown) => {
		if (pending.current) return;
		pending.current = true;
		setLoading(true);
		try {
			const response = await callService(name, input);
			setResult(response);
			return response;
		} finally {
			pending.current = false;
			setLoading(false);
		}
	}, []);
	return { execute, isLoading, result };
}
