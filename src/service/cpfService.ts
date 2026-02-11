// services/registry.ts

// Tipo de resposta esperado da sua API para padronizar erros
export type ServiceResponse = {
  success: boolean;
  data?: any;
  errors?: Record<string, string>; // ex: { cpf: "CPF inválido", nome: "Obrigatório" }
};

const consultarCpfService = async (formData: any): Promise<ServiceResponse> => {
  console.log("Chamando API com:", formData);

  if (formData.cpf === "111.111.111-11") {
    return {
      success: false,
      errors: {
        cpf: "Este CPF possui restrições. Entre em contato.",
      },
    };
  }

  return { success: true, data: { status: "aprovado" } };
};

const criarLeadService = async (formData: any): Promise<ServiceResponse> => {
  return { success: true };
}

export const ServiceRegistry: Record<string, Function> = {
  "consultar_cpf": consultarCpfService,
  "criar_lead": criarLeadService,
};
