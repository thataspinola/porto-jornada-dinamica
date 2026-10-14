import { carbonClient } from "@/lib/carbonClient";
import type { ApiRequest } from "./types";
export async function apiService<T>(request: ApiRequest): Promise<T> {
	const response = await carbonClient.request<T>({
		url: request.url,
		method: request.method ?? "GET",
		data: request.body,
		headers: request.headers,
		signal: request.signal,
		maxRedirects: request.maxRedirects,
	});
	return response.data;
}

import axios from "axios";
import type { ApiServiceInput } from "./types";
import type { ServiceResult } from "@/services/types";
export async function callApi(
	input: ApiServiceInput,
	recaptchaToken: string,
): Promise<ServiceResult> {
	if (recaptchaToken && !input.recaptchaHeader)
		return {
			success: false,
			error: "INVALID_CONFIGURATION",
			message: "Cabeçalho reCAPTCHA não configurado",
		};
	try {
		const data = await apiService({
			...input,
			maxRedirects: 0,
			headers: {
				...input.headers,
				...(recaptchaToken && input.recaptchaHeader
					? { [input.recaptchaHeader]: recaptchaToken }
					: {}),
			},
		});
		return { success: true, data };
	} catch (error) {
		if (axios.isAxiosError(error))
			return {
				success: false,
				error: error.response?.data?.code ?? "CONNECTION_ERROR",
				statusCode: error.response?.status,
				message: error.response?.data?.message,
			};
		return { success: false, error: "INTERNAL_SERVER_ERROR" };
	}
}
