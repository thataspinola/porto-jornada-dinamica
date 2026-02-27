import { authorizedApi } from "@/lib";
import { sanitize } from "@/utils";
import { optinService } from "./optinService";

export type HttpResponse = {
  success: boolean;
  data: any;
  errors: { [field: string]: string };
};

export const journeyRegistryServices = {
  elegibilityService: async (formData: any): Promise<HttpResponse> => {
    const response = await optinService({
      taxvat: String(sanitize.digits(formData.cpf_input)),
    });
    return {
      success: response.success,
      data: response,
      errors: { input_cpf: response.status },
    };
  },
  createLead: async (formData: any) => {
    return await authorizedApi.post("/v1/lead", formData);
  },
};
