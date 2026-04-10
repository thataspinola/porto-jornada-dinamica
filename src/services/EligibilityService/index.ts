import type { ServiceResult } from "../types";

type ServiceHandler = (input: unknown) => Promise<ServiceResult>;

export const eligibility: ServiceHandler = async (input: unknown) => {
  return { success: true, data: { eligible: true } };
};
