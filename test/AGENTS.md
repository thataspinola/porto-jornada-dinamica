# Testes da Jornada Dinâmica

Manter todos os specs em `test/` na raiz, com `.spec.ts`/`.spec.tsx`; não adicionar `.test`, `__test__`, specs, setup ou tipos de teste em `src/`. Espelhar os módulos em `test/src/`. Helpers e fixtures compartilhados ficam aqui, não na produção.

Usar Vitest e Testing Library. Testar comportamento com queries acessíveis, estados de carregamento/erro, contratos e limpeza dos efeitos. Unitários podem isolar fronteiras com mocks explícitos por spec; integração/funcionais devem registrar o que é real e o que é simulado. Não configurar aliases globais para substituir `@porto-stack/*` nem criar declarações de tipos falsas.

Preservar os testes fornecidos na versão de produção, atualizando imports quando movidos. Integração usa `.integration.spec.*`, funcional `.functional.spec.*`; E2E em `test/e2e/` usa Vitest com Playwright e aplicação real configurada. Não tratar ausência de testes, de pacotes corporativos ou de ambiente E2E como aprovação.

Cobertura mínima: 90% em linhas, instruções, funções e branches de todo o código fonte. Executar `npm run test:coverage`; não excluir produção ou reduzir limites. Documentar o relatório medido e suítes bloqueadas. Cobertura do cenário isolado não substitui a cobertura global.

Para a promoção de CPF, validar as duas jornadas, os dois itens no mesmo evento, ausência de campos monetários, visibilidade a partir do erro de servidor e disparo único em StrictMode/re-render. Também testar outro wrapper, outra jornada, validação local e dados incompletos.

E2E usa URLs e CPF de homologação autorizados via ambiente. Nunca versionar dados pessoais, cookies, tokens ou paths da máquina. Não acessar produção para gerar negativas de teste.
