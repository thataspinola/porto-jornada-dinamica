import type { ServiceResponse } from "./cpfService";

export const asyncActionsRegistry = {
  "consultar-elegibilidade": async (value: string) => {
    const response = await fetch(`/api/elegibilidade?cpf=${value}`);
    if (!response.ok) throw new Error("CPF não elegível");
    return response.json();
  },
  "buscar-cep": async (cep: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return response.json();
  },
  consultar_cpf: async (formData: any): Promise<ServiceResponse> => {
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
  },
};
