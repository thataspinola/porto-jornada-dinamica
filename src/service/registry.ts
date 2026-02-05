export const asyncActionsRegistry = {
  "consultar-elegibilidade-vida": async (value: string) => {
    const response = await fetch(`/api/elegibilidade?cpf=${value}`);
    if (!response.ok) throw new Error("CPF não elegível");
    return response.json();
  },
  "buscar-cep": async (cep: string) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return response.json();
  }
};
