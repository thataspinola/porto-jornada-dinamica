# Jornada Dinâmica

Aplicação Next.js e React que interpreta definições declarativas de jornadas, valida formulários e integra serviços e analytics. Os contratos e componentes originais são a referência para alterações e para a transferência ao projeto de produção.

## Preparação

Use Node conforme `engines` do `package.json`. Instale as dependências com `npm install` no ambiente com acesso ao registro corporativo e ao certificado configurado em `.npmrc`. Os pacotes `@porto-stack/ui`, `@porto-stack/icons`, `@porto-stack/utils` e o preset Biome são dependências reais: não há substituição global por componentes de teste ou por presets alternativos.

Configure as variáveis usadas pelos módulos originais, sem versionar valores ou credenciais:

| Integração | Variáveis |
| --- | --- |
| Carbon | `NEXT_PUBLIC_SENSEDIA_CLOUD_URL`, `NEXT_PUBLIC_JORNADA_DINAMICA` |
| reCAPTCHA | `NEXT_PUBLIC_RECAPTCHA_SITE_K`, `RECAPTCHA` |
| Cookies e ambiente | `NEXT_PUBLIC_COOKIE_DOMAIN`, `NEXT_PUBLIC_NODE_ENV` |
| Analytics e metadados | `GTM-ENCRYPTION`, `NEXT_PUBLIC_GA_COOKIE_SESSION_ID`, `NEXT_PUBLIC_IP_SERVICE` |
| Autorização | `NEXT_PUBLIC_SERVICE_AUTHORIZATION_PATH`, `CREDENTIALS` |

Segredos permanecem no servidor. Reutilize os parâmetros, conteúdo de jornadas e configuração de hospedagem do projeto original. Não substitua endpoints ou respostas para contornar ausência de configuração.

## Estrutura

```text
src/
  app/                 Rotas e layouts
  components/
    Core/              Orquestração da jornada
    Elements/          Integração com formulário e schemas
    UI/                Componentes visuais e design system
  contexts/            Providers
  features/            REFF e FCDC
  hooks/               Efeitos, navegação, consultas e ações
  lib/                 Carbon e configuração do cache
  scripts/             Integrações de scripts
  services/            Adapters do backend
  store/               Estado e hidratação
  utils/               Transformações e builders
  validation/
    schemas/           Estrutura declarativa
    fields/            Validação de domínio
    primitives/        Validadores genéricos
    form/              Montagem dos formulários
test/
  src/                 Specs que espelham os módulos de src
  e2e/                 Testes no navegador
  setup.ts             Setup do Vitest
```

Todos os specs ficam na pasta externa `test`; não há testes dentro de `src`. Use `.spec.ts` e `.spec.tsx`, com `.integration.spec` e `.functional.spec` quando aplicável. Preserve os nomes, componentes compostos, `index.tsx`, barrels e arquivos de estilos presentes no código original.

## Responsabilidades e contratos

`JourneyBuilder` compõe o formulário. `useJourneyController` reúne os dados da etapa; `useJourneyActions` valida, executa condições e coordena chamadas. `useJourneyNavigation` mantém o contrato original `navigateTo`/`goBack`. `useJourneyService` prepara metadados e reCAPTCHA; `callService` e `callApi` usam o contrato Carbon com headers de produto, módulo e ação. Não há adapter alternativo de elegibilidade por URL independente.

Os schemas de formulário continuam usando o registry e seus refinamentos. A hidratação preserva defaults ausentes na sessão. O cache TanStack é criado por provider para evitar compartilhamento de dados entre renderizações de servidor.

Aplique SOLID por responsabilidade e direção de dependências: UI apresenta; Elements integram formulário; hooks coordenam efeitos; services adaptam o protocolo; validators e utils não renderizam UI. Evite duplicação de hooks, dependências circulares, abstrações sem uso real e regras comerciais inventadas.

Serviços declarativos precisam de `product` na jornada e referências com `module` e `action`. As definições de conteúdo devem corresponder aos contratos do backend de produção. Uma definição antiga contendo apenas o nome de serviço não é convertida em endpoint presumido.

A fonte estática de bancos contém apenas o cadastro fornecido no código original. Sua completude depende desse cadastro; não foram inventados dados adicionais.

## Promoção após negativa de CPF

Nas jornadas `emprestimo-com-garantia-de-veiculo` e `financiamento-de-veiculos`, a negativa `NOT_ELIGIBLE` deve resultar em erro de formulário `server` no CPF. Regras declaradas no componente e na jornada têm precedência. Quando não existe regra específica, a integração aplica o erro ao campo CPF dessas duas jornadas.

Quando `cpf-recommended-products-wrapper` fica visível, o builder de promoção coleta os dois `COMPOSABLE_CARD` e seus elementos `TEXT` e `NAVIGATION`. O wrapper impede repetição em re-render e StrictMode. Outros wrappers e jornadas não entram nesse tagueamento.

O contrato original de `pushEvent` recebe `evAction` e retorna `void`; o payload enviado ao dataLayer usa chaves em snake_case:

```text
event = view_promotion
ev_action = ecommerce:visualizar:promocao:sucesso
items[].item_id = URL da navegação
items[].item_name = título
items[].promotion_name = descrição
items[].item_brand = porto
items[].affiliation = porto
items[].creative_name = produtos-recomendados
items[].creative_slot = cpf-negativa-elegibilidade
```

Os dois cards são enviados no mesmo evento. `currency`, `value`, preço e SKU não são fabricados. `dispatchAlert` continua tratando somente eventos de falha. O dataLayer deve ser inicializado pela integração GTM da aplicação; não duplique o script quando o host de produção já o fornece.

## Comandos e validação

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Desenvolvimento Next |
| `npm run build` / `npm start` | Build e execução standalone |
| `npm run type-check` | TypeScript, incluindo testes |
| `npm run lint` / `npm run lint:fix` | Biome com preset corporativo |
| `npm run format:check` / `npm run format` | Conferir ou aplicar formatação |
| `npm run lint:style` | Conferir SCSS |
| `npm run check:imports` | Resolução de imports em src e test |
| `npm run check:names` | Nomes e localização externa dos specs |
| `npm run check:empty` | Arquivos vazios |
| `npm test` | Suíte Vitest |
| `npm run test:unit` | Testes unitários |
| `npm run test:integration` | Integração |
| `npm run test:functional` | Fluxos funcionais |
| `npm run test:coverage` | Cobertura V8 |
| `npm run test:e2e:install` | Instalar Chromium do Playwright |
| `npm run test:e2e` | Navegador contra a aplicação configurada |
| `npm run test:all` | Cobertura e E2E |

A cobertura inclui todo código de produção em `src`, excluindo somente declarações de tipos. Os limites globais são 90% para linhas, instruções, funções e branches. O limite configurado não substitui uma execução bem-sucedida; resultados precisam ser medidos após cada integração.

Os mocks pontuais de rede e efeitos externos ficam restritos aos specs. O Vitest não redireciona pacotes corporativos para implementações alternativas. Os mesmos comandos e contratos devem funcionar no ambiente de desenvolvimento e na pipeline do projeto.

Para E2E, configure `E2E_BASE_URL` com a URL da aplicação no ambiente de testes, incluindo o `basePath`, e instale Chromium. Para os fluxos de negativa, configure também `E2E_REFF_URL`, `E2E_FCDC_URL` (URLs das etapas de CPF) e `E2E_NOT_ELIGIBLE_CPF` (dado de homologação autorizado). Os testes não iniciam um backend alternativo nem usam caminhos de navegador específicos de uma máquina. Configure dados e serviços de homologação para validar os fluxos comerciais completos.

## Transferência e manutenção

Transfira código-fonte, testes, configurações e documentação aplicáveis. Não transfira `node_modules`, `.next`, `dist`, `coverage`, credenciais ou arquivos gerados de uma execução. Preserve as versões, os contratos do backend e a infraestrutura de hospedagem do projeto original.

Siga [AGENTS.md](./AGENTS.md), as instruções próximas ao módulo e [test/AGENTS.md](./test/AGENTS.md). Use Conventional Commits. Execute os checks e a suíte com as dependências corporativas reais antes de integrar alterações à branch principal. Falhas ou bloqueios devem permanecer explícitos na entrega.
