# Serviços

Preservar os contratos reais de produção. `callService` delega ao `callApi`, que usa o CarbonClient de `src/lib/carbonClient.ts` e retorna `ServiceResult` (`success`, `data`, `error`, `statusCode`, `sessionRestarted`). Não substituir por outro endpoint, cliente ou formato de retorno.

O hook cliente `useJourneyService` gera reCAPTCHA/metadados, chama o serviço, atualiza os resultados por módulo/ação e converte falhas em `ServiceError`. `useServiceErrorHandler` resolve as ações declarativas do JSON; `NOT_ELIGIBLE` de CPF aplica o erro de servidor em taxvat. Não duplicar esse caminho em outro hook ou componente.

Código de transporte permanece no servidor, com env/cookies/headers e o contrato de autenticação existente. Não importar clientes de servidor no bundle cliente. Usar imports diretos quando um barrel causar mistura de fronteiras ou ciclos. Não alterar a semântica dos cookies, metadata, recaptcha ou retry sem requisito e regressão.

Testes ficam em `test/src/services/`, com `.spec`; validar contratos e falhas de autenticação/serviço conforme o escopo. Mocks de fronteiras em uma spec não certificam o backend real. Não criar implementações alternativas, aliases globais ou declarações falsas dos pacotes `@porto-stack/*` para contornar indisponibilidade de registry. Segredos e dados pessoais não entram em fixtures.
