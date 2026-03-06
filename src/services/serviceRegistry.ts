"use server";

export type ServiceResult = {
	success: boolean;
	error?: string;
	data?: unknown;
};

type ServiceHandler = (input: unknown) => Promise<ServiceResult>;

const eligibility: ServiceHandler = async (input: unknown) => {
	console.log("Eligibility service called with input:", input);
	return { success: true, data: { eligible: true } };
};

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
