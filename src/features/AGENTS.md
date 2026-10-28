# Features

Leia o AGENTS.md da raiz. Preserve os contratos de REFF e FCDC, seus componentes e regras específicas. Não invente taxas, condições comerciais, elegibilidade, produtos ou dados de cadastro.

Use schemas em validation/schemas, regras de formulário em validation/form e a infraestrutura de serviço original. Evite cópia de lógica comum entre verticais; extraia somente responsabilidades compartilhadas reais.

As referências a CPF e negativa de elegibilidade fazem parte dos requisitos. O evento de promoção exige os dois produtos exibidos, URL em item_id, título e descrição do card; não fabrique campos monetários.

Specs ficam em `test/src/features`, espelhando a vertical e o módulo. Ausência de contrato ou dados de produção deve ser tratada como pendência, nunca substituída por um resultado comercial fictício.
