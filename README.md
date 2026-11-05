# Jornada Dinâmica

Aplicação Next.js que executa jornadas declaradas em JSON: valida a definição com Zod, renderiza os elementos registrados, controla o formulário com React Hook Form e coordena serviços, navegação e estado da jornada.

## Ambiente e execução

Usar Node compatível com `package.json` (22.12+, 24 ou 26+, conforme a faixa declarada). As versões de produção e o lockfile são mantidos. O projeto usa React, TanStack Query, Zustand, SCSS e o design system `@porto-stack/*`; Biome é o lint/format e Vitest é o único runner de testes.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Preencher as variáveis com os valores aprovados do ambiente. No PowerShell, usar `Copy-Item .env.example .env.local`. A instalação exige acesso ao registry configurado em `.npmrc` e aos pacotes corporativos. Acesso à internet pública, sozinho, não garante instalação ou funcionamento dos serviços. Não substituir o design system ou a autenticação por implementações locais para declarar a aplicação validada.

O `basePath` é `/contrate`. Rotas de entrada:

- `http://localhost:3000/contrate/emprestimo-com-garantia-de-veiculo`
- `http://localhost:3000/contrate/financiamento-de-veiculos`

As etapas seguintes vêm do `slug` de cada step no JSON. A raiz sem uma jornada válida segue o tratamento de página não encontrada. Para testar com Webpack, usar `npm run dev:webpack`.

`npm run build` gera o standalone em `dist/react-ssr-corp-hubv-dinamic-journey/`; o postbuild copia os arquivos estáticos e `public/`. Executar com `npm run start`. O build verifica tipos; não usar `ignoreBuildErrors` para liberar código inválido.

## Estrutura

```text
src/
  app/                         rotas, layout e metadados Next.js
  components/
    Core/                      orquestração, formulário e renderizador
    Elements/                  componentes por tipo de elemento
    UI/                        apresentação e design system
  contexts/                    providers
  features/                    código específico de REFF/FCDC
  hooks/                       coordenação reutilizável
  lib/                         clientes e configuração de infraestrutura
  scripts/                     GTM, reCAPTCHA e outras integrações cliente
  services/                    contratos e transporte de servidor
  store/                       stores Zustand
  utils/                       utilitários e adaptadores
  validation/                  schemas, campos e schema do formulário
public/jsonContent/            definições de jornadas
test/
  src/                         specs espelhando os módulos de produção
  fixtures/                    dados de teste compartilhados
  e2e/                         navegador contra aplicação real
  setup.ts                     setup exclusivo de teste
  types.d.ts                   matchers exclusivos de teste
scripts/                       verificações e manutenção do projeto
docs/                          documentação
```

Preservar o padrão de produção: componentes em `index.tsx` ou arquivos nomeados com barrel `index.ts`, tipos em `.ts`, hooks `useNome.ts` e estilos `*.module.scss` (`styles.module.scss` e nome do componente são aceitos). Schemas usam `.schema.ts`/`.schemas.ts`. Testes usam somente `.spec.ts`/`.spec.tsx` dentro de `test/` na raiz; setup, tipos e helpers de teste também ficam fora de `src/`.

TypeScript também verifica declarações e parâmetros sem uso. `check:journeys` confere os tipos de elementos usados nos JSONs contra schemas e renderizadores; a validação completa da definição continua sendo do Zod. A conciliação dos componentes anteriores está em [Compatibilidade de componentes](docs/component-compatibility.md).

Usar `@/` para imports entre módulos e respeitar o casing real dos arquivos. Barrels não devem misturar código de servidor com dependências do cliente; importar diretamente quando necessário para manter essa fronteira. Regras adicionais estão no [AGENTS.md](AGENTS.md) e nos AGENTS por diretório.

## Contratos da jornada

O caminho de execução é JSON → [schemas](src/validation/schemas/journey.schema.ts) → [renderizador](src/components/Core/JourneyRenderElements/index.tsx) → elementos → [formulário](src/components/Core/JourneyStepForm/useJourneyStepFormController.ts). Ao adicionar um tipo, atualizar a união de schemas, o registro do renderer e a validação do formulário correspondente.

Preservar `executeJourneyService`, os descritores produto/módulo/ação, o `ServiceResult` no servidor e o `ServiceError` no hook cliente. As regras declarativas de erro seguem `useServiceErrorHandler`. Navegação usa `navigateTo`/`goBack`, mantendo os parâmetros previstos no contrato. O QueryClient é criado por provider, evitando compartilhar cache entre instâncias.

Não copiar lógica de transporte para componentes ou duplicar hooks de serviço. UI recebe dados e callbacks; coordenação fica nos controllers; transformação de evento fica em uma função pura. No formulário, `useStepFormState` cuida de hidratação/prefill, `validateStepDataQuality` valida contatos e `executeStepServices` preserva a sessão e a sequência dos serviços. Aplicar SOLID e Clean Code a essas responsabilidades, preservando os contratos existentes.

### Promoção na negativa de CPF

Nas jornadas REFF e FCDC, `NOT_ELIGIBLE` aplica o erro `server` em `taxvat` pela regra do JSON. Isso torna visível o wrapper `cpf-recommended-products-wrapper`.

O wrapper envia `view_promotion` uma única vez por montagem quando fica visível, inclusive sob re-render/StrictMode. A função `buildRecommendedProductsPromotion` monta os dois cards no mesmo `items`, percorrendo GRID/GRID_ITEM e os filhos dos COMPOSABLE_CARD. Não altera `dispatchAlert`, que continua responsável pelo evento de falha.

| Campo | Origem/valor |
| --- | --- |
| `ev_action` | `ecommerce:visualizar:promocao:sucesso` |
| `items[].item_id` | URL do NAVIGATION do card |
| `items[].item_name` | título TEXT |
| `items[].promotion_name` | descrição TEXT |
| `items[].item_brand`, `affiliation` | `porto` |
| `items[].creative_name` | `produtos-recomendados` |
| `items[].creative_slot` | `cpf-negativa-elegibilidade` |

O `pushEvent` recebe `evAction` e serializa para `ev_action`. Não incluir `currency`, `value`, `price`, `sku` ou um campo de URL adicional. Outros wrappers e jornadas não disparam esse evento. Blocos incompletos não enviam itens parciais.

## Validação e testes

```sh
npm run check:imports
npm run check:empty
npm run check:names
npm run check:journeys
npm run format:check
npm run type-check
npm run lint
npm run test:coverage
```

`npm run verify` reúne essas verificações. [Comandos gerados](docs/commands.md) listam todos os scripts. Não usar `--passWithNoTests`: nenhuma suíte descoberta é falha, não sucesso.

| Comando | Escopo |
| --- | --- |
| `npm run test:unit` | unitários/componentes |
| `npm run test:integration` | colaboração entre módulos e contratos |
| `npm run test:functional` | fluxo de negativa de CPF, formulário e cards reais |
| `npm run test:e2e` | aplicação real em navegador |
| `npm run test:all` | cobertura e E2E |

Os limites mínimos são 90% para linhas, instruções, funções e branches, considerando todo o código de produção. Limites configurados não comprovam a cobertura: é necessário um relatório completo aprovado. Não excluir produção, reduzir os limites ou simular pacotes corporativos globalmente para elevar o resultado. Mocks pontuais de fronteiras em specs não comprovam integração com o backend.

Para E2E, definir `E2E_BASE_URL`, `E2E_REFF_URL` e `E2E_FCDC_URL` com URLs completas da aplicação e da etapa de CPF, e `E2E_NOT_ELIGIBLE_CPF` com um dado autorizado de homologação. A aplicação deve estar disponível e o backend deve devolver a negativa real; o teste não inicia um backend substituto. Instalar o navegador com Playwright; o script `test:e2e:install` instala Chromium. `E2E_BROWSER` aceita `chromium`, `firefox` e `webkit`; os dois últimos exigem `npx playwright install firefox` ou `npx playwright install webkit`. `E2E_CHANNEL=chrome`/`msedge` seleciona uma instalação disponível desses navegadores com Chromium. Não versionar dados pessoais, cookies ou traces com credenciais.

## Documentação e histórico

Executar `npm run docs:generate` após mudar scripts, e `npm run docs:check` para conferir o documento gerado. Manter [CHANGELOG.md](CHANGELOG.md) com efeitos revisados. `npm run changelog -- BASE..HEAD` gera um diário em `reports/change-journal.md` a partir do Git; o arquivo é regenerável e ignorado.

Commits novos seguem Conventional Commits (`feat`, `fix`, `test`, `docs`, etc.). `npm run commits:check -- BASE..HEAD` valida apenas o intervalo informado, sem exigir reescrita do histórico legado. O Lefthook existente mantém as verificações locais; CI/CD continua sendo o fluxo da equipe via GitLab/Jenkins, sem criação de outro pipeline.

O fluxo de produção utiliza `master`, branches `release-dd/mm/aaaa` e `feature/HDV-XXXX`, com homologação em dev/hml antes da integração. Preservar as regras de entrega da equipe e escolher a base real no ambiente em que o código será integrado.

Ao transferir alterações para o projeto original, não incluir `node_modules`, `.next`, `dist`, `coverage`, configurações alternativas do ambiente local ou caminhos absolutos. Pendências de dependências, testes e ambiente devem ser registradas com os comandos e resultados reais, sem afirmar validações que não ocorreram.

Guias: [condições](docs/conditions.md) e [ConditionalTag](docs/conditional-tag.md).
