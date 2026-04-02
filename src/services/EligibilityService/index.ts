import type { ServiceResult } from "../types";

type ServiceHandler = (input: unknown) => Promise<ServiceResult>;

export const eligibility: ServiceHandler = async (input: unknown) => {
	console.log("Eligibility service called with input:", input);
	return { success: true, data: { eligible: true } };
};
