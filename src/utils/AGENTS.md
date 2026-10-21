# Utils

Leia o AGENTS.md da raiz. Prefira funções puras com contratos pequenos. Separe acesso a navegador ou servidor da transformação dos dados e não exporte módulos de servidor por barrels usados pelo cliente.

Mantenha os formatos originais de valores, tokens, cookies e mensagens nativas. Corrija erros de transcrição com testes de entrada e saída. Não invente defaults comerciais para ocultar dados ausentes.

`pushEvent` recebe o contrato com `evAction`, retorna `void` e normaliza as chaves do payload. Campos não informados são omitidos. `buildRecommendedProductsPromotion` concentra a regra dos dois cards de CPF e não se aplica a outros wrappers ou jornadas.

Specs ficam em `test/src/utils`. Cubra limites, valores ausentes, transformação e preservação de dados; não teste apenas existência de funções nem copie a implementação para o teste.
