"use server";
import axios from "axios";
import type { ServiceResult } from "@/services/types";
export async function eligibility(input: unknown): Promise<ServiceResult> {
	const url = process.env.ELIGIBILITY_URL;
	if (!url)
		return {
			success: false,
			code: "SERVICE_NOT_CONFIGURED",
			message: "Serviço temporariamente indisponível",
			error: "Serviço de elegibilidade não configurado",
		};
	try {
		const response = await axios.post(url, input, { timeout: 15000 });
		if (response.data?.eligible === false)
			return {
				success: false,
				code: "NOT_ELIGIBLE",
				message: "Produto indisponível para este CPF.",
			};
		if (response.data?.eligible !== true)
			return {
				success: false,
				code: "INVALID_RESPONSE",
				error: "Resposta de elegibilidade inválida",
			};
		return { success: true, data: response.data };
	} catch (error) {
		if (
			axios.isAxiosError(error) &&
			error.response?.data?.code === "NOT_ELIGIBLE"
		)
			return {
				success: false,
				code: "NOT_ELIGIBLE",
				message: error.response.data.message,
			};
		return {
			success: false,
			code: "SERVICE_ERROR",
			error: "Falha ao consultar elegibilidade",
		};
	}
}
