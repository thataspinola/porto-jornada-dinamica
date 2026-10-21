# Hooks

Leia o AGENTS.md da raiz. Hooks coordenam estado e efeitos, delegando transformação a utils, validação aos schemas e protocolo aos services.

Preserve as APIs originais: `useJourneyNavigation` expõe `navigateTo`/`goBack`; `useJourneyService` expõe `executeJourneyService`; os handlers de erro recebem ações declarativas. Ajuste consumidores em vez de reintroduzir APIs de demonstração.

Evite duplicação de hooks, dependências circulares, callbacks instáveis e efeitos sem limpeza. Impeça chamadas duplicadas e atualizações ou redirecionamentos após desmontagem. Não deixe resposta obsoleta substituir dados da consulta atual.

Erros de formulário e serviços devem ser reais. Dados simulados só podem existir como fixtures explícitas nos specs ou sob o contrato de desenvolvimento já previsto, nunca como fallback de produção.

Specs ficam em `test/src/hooks`. Teste hidratação, defaults, cache, navegação e erro de CPF com os contratos atuais.
