import { authorizedApi } from "@/lib";
import { optinService } from "./optinService";

export type HttpResponse = {
  success: boolean;
  data: any;
  errors: { [field: string]: string };
}

export const journeyRegistryServices = {
  elegibilityService: async (formData: any): Promise<HttpResponse> => {
    const response = await optinService({ taxvat: formData.input_cpf });
    return {
      success: response.optinMarketing,
      data: response,
      errors: { input_cpf: response.status }
    };
  },
  createLead: async (formData: any) => {
    return await authorizedApi.post('/v1/lead', formData);
  }
};
