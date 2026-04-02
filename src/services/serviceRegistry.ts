"use server";

import { eligibility } from "./EligibilityService";

import type { ServiceHandler, ServiceResult } from "./types";

const handlers: Record<string, ServiceHandler> = {
	eligibility,
};

export async function callService(
	serviceName: string,
	input: unknown,
): Promise<ServiceResult> {
	const handler = handlers[serviceName];
	if (!handler) {
		return { success: false, error: `Serviço não registrado: ${serviceName}` };
	}
	return handler(input);
}
