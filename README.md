# @porto/react-ssr-corp-hubv-dinamic-journey

Projeto gerado via [Tech Store](https://portostage.portoseguro.brasil/) para executar jornadas declaradas em JSON: renderização por `type`, formulário dinâmico, navegação entre etapas, chamadas de serviço e persistência de estado.

## Pré-requisitos

A configuração de instalação fica em [.npmrc](./.npmrc), com Nexus corporativo e certificado em [config/nexus/certificate.crt](./config/nexus/certificate.crt). As dependências `@porto-stack/*` exigem acesso ao registro corporativo.

Para execução dos comandos `npm` é necessário a instalação das dependências do projeto Dynamic Journey.

```bash
npm install
```

## Stack

- Node.js >= 20.19.0
- Next.js 16 (App Router) e React 19 → UI e runtime
- React Hook Form: controle de formulário
- Zod: validação estrutural (jornada) e validação do formulário (gerada dinamicamente)
- Zustand para estado global do runner e TanStack Query para cache de consultas
- Vitest 4.1.9 e Testing Library; Playwright como driver do Chromium nos E2E
- Biome para lint/formatação e Stylelint para SCSS

## Como rodar

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`.

O preset Biome corporativo é usado quando instalado. Fora desse ambiente, [scripts/run-biome.mjs](./scripts/run-biome.mjs) usa [config/biome.local.json](./config/biome.local.json). A validação do perfil corporativo continua dependendo da VDI/Nexus. O repositório atualmente não possui lockfile versionado.

## Scripts

```bash
npm run dev         # dev server
npm run build       # build de produção
npm run start       # roda a build
npm run lint        # biome check
npm run format      # biome format
npm run test        # vitest (watch)
npm run test:run    # vitest run (CI)
```

Se o problema estiver no Turbopack (Next dev):

```bash
npm run dev:webpack
```

Com a configuração atual e a porta padrão:

| Recurso                      | URL                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Catálogo na página inicial   | <http://localhost:3000/contrate>                                             |
| Catálogo na rota de jornadas | <http://localhost:3000/contrate/contrate>                                    |
| FCDC                         | <http://localhost:3000/contrate/contrate/financiamento-de-veiculos/>         |
| REFF                         | <http://localhost:3000/contrate/contrate/emprestimo-com-garantia-de-veiculo> |
| Health                       | <http://localhost:3000/contrate/api/health>                                  |

O diretório de build é `dist/react-ssr-corp-hubv-dinamic-journey`. O prefixo HTTP é definido por `basePath`.

Para usar Webpack no desenvolvimento, execute `npm run dev-webpack`. Para produção local:

```sh
npm run build
npm run start
```

O build gera a aplicação standalone. O `postbuild` copia `public` e os arquivos estáticos para ela por meio de [scripts/copy-standalone.mjs](./scripts/copy-standalone.mjs).

## Documentação

Guias específicos vivem em [`docs/`](./docs):

- [Conditions em `SERVICE_CALL` e `NAVIGATION`](./docs/conditions.md) - bloquear chamadas/navegação com regras declarativas (AND/OR), aplicar `notify`, `fieldError` ou `redirect`.

Padrões de cada pasta do `src/` estão documentados nos `AGENTS.md` locais (ver [AGENTS.md raiz](./AGENTS.md)).

## Contribuindo

### Estratégia de branches

Fluxo de branches adotado:

- Base: `master`
- Início da sprint: criar `release-dd/mm/aaaa` a partir da `master`
- Features/Bugs: criar `feature/HDV-XXXX` a partir da `release-dd/mm/aaaa`
- Deploy: branches de `feature/HDV-XXXX` podem subir para `dev` e `hml` (homologação)
- Fechamento da sprint: tudo que estiver homologado volta para a `release-dd/mm/aaaa`
- Final: merge da `release-dd/mm/aaaa` para `master`

Sugestão prática de rotina:

- Criar branch:

```bash
get checkout master
git pull
git checkout -b release-26/03/2026
git push -u origin release-26/03/2026
git checkout -b feature/HDV-1234 origin/release-26/03/2026
```

- Antes de abrir PR:

```bash
npm run format
npm run lint
npm run test:run
npm run build
```

- PR alvo:
  - `feature/HDV-XXXX` → `release-dd/mm/aaaa`
  - `release-dd/mm/aaaa` → `master` (fechamento da sprint)

## Árvore de pastas (resumo)

```bash
src/
  app/ # Next App Router
  components/
    Core/
      JourneyBuilder/
      JourneyRenderElements/
      JourneyStepForm/
    Elements/
      ConditionalWrapperElement/
      NavigationElement/
      ServiceCallElement/
    UI/
      Button/
      Input/
      Typography/
  constants/
  contexts/
    QueryClientProvider/
  features/
    fcdc/
      components/
      validation/
    reff/
      components/
      validation/
  hooks/
    queries/
    serviceErrorHandlers/
    test/
    useJourneyController.ts
    useJourneySteps.ts
    useJourneyForm.ts
    useJourneyNavigation.ts
  lib/
  mock/
    jsonContent/
  scripts/
    gtm/
    lexis/
    recaptchaClient/
    vwo/
  services/
    EligibilityService/
    apiService/
    test/
    serviceRegistry.ts
  store/
    test/
    journeyStore.ts
  styles/
  utils/
    joinPaths/
      index.ts
    test/
  validation/
    fields/
    form/
      registry/
      test/
      buildJourneyFormSchema.ts
      buildStepFormSchema.ts
      elementRegistry.ts
    primitives/
    schemas/
      elements/
      journey.schema.ts
      journeyStep.schema.ts
      journeyElement.schema.ts
test/
  e2e/
    journeys.spec.ts
```

Os specs ficam em uma pasta `test` ao lado do módulo. Por exemplo: `src/components/UI/Button/test/Button.spec.tsx`. O diretório `test/e2e` reúne os testes da aplicação no navegador.

| Pasta                                    | Responsabilidade                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `src/app`                                | Rotas, layout, catálogo e leitura das jornadas                                  |
| `src/components/Core`                    | Orquestração da jornada, formulário e renderer                                  |
| `src/components/Elements`                | Componentes dos elementos declarados no JSON                                    |
| `src/components/UI`                      | Componentes de apresentação                                                     |
| `src/features/fcdc`, `src/features/reff` | Componentes e schemas específicos dos produtos                                  |
| `src/hooks`                              | Controle da jornada, consultas e tratamento de erros                            |
| `src/contexts`, `src/lib`                | Provider, cliente de consultas e cliente HTTP                                   |
| `src/services`                           | Adaptadores e despacho de chamadas de serviço                                   |
| `src/store`                              | Estado Zustand                                                                  |
| `src/utils`                              | Helpers, templates, navegação e analytics                                       |
| `src/validation`                         | Schemas estruturais, validadores de campos, primitivas e montagem do formulário |
| `public/jsonContent`                     | JSONs lidos pela aplicação                                                      |
| `src/mock/jsonContent`                   | Conteúdo de referência para desenvolvimento                                     |

## Arquitetura da jornada

### Definição e renderização

Uma jornada tem `id`, `name`, `slug` e `steps`; cada etapa tem `slug` e `elements`.

- Jornada: [src/validation/schemas/journey.schema.ts](./src/validation/schemas/journey.schema.ts).
- Etapa: [src/validation/schemas/journeyStep.schema.ts](./src/validation/schemas/journeyStep.schema.ts).
- Union de elementos: [src/validation/schemas/journeyElement.schema.ts](./src/validation/schemas/journeyElement.schema.ts).
- Leitura de conteúdo: [src/utils/readJourneyContent/index.ts](./src/utils/readJourneyContent/index.ts).
- Exemplo FCDC: [public/jsonContent/financiamento-de-veiculos.json](./public/jsonContent/financiamento-de-veiculos.json).
- Exemplo REFF: [public/jsonContent/emprestimo-com-garantia-de-veiculo.json](./public/jsonContent/emprestimo-com-garantia-de-veiculo.json).

[JourneyBuilder](./src/components/Core/JourneyBuilder/JourneyBuilder.tsx) usa [useJourneyController](./src/hooks/useJourneyController.ts), que compõe `useJourneySteps`, `useJourneyForm` e `useJourneyNavigation`. O componente percorre os elementos da etapa e chama [renderJourneyElement](./src/components/Core/JourneyRenderElements/renderJourneyElement.tsx). Tipos sem renderer específico são encaminhados a [ConfiguredElement](./src/components/Elements/ConfiguredElement/ConfiguredElement.tsx).

Fluxo simplificado:

```bash
JourneyRunner → renderJourneyElement(element, ctx) → componente do elemento
```

### Estado e navegação

O runner persiste dados em store para reuso e debug:

- `stepSlug`: step atual
- `fields`: valores dos formulários
- `error`: erros "de alto nível" (ex.: error de service)
- `business`: contexto/metadata (ex.: base_url, journeyId, stepSlug)
- `services`: resultados de SERVICE_CALL

[src/store/journeyStore.ts](./src/store/journeyStore.ts) exporta o hook `useJourneyStore` e o alias `journeyStore`, usado com `getState` e `subscribe`. Importe o hook por `@/store`.

O estado contém `fields`, `error`, `business`, `services`, `parameters`, `errors` e `_hasHydrated`. A persistência em `sessionStorage` guarda `fields`, `error`, `business` e `services`.

[useJourneySteps](./src/hooks/useJourneySteps.ts) identifica a etapa pelo último segmento da URL e sincroniza `business.journeyId`, `business.journeySlug` e `business.stepSlug`. [redirectTo](./src/utils/redirectTo/index.ts) usa `history.pushState` para destinos internos e publica o evento de navegação; destinos HTTP(S) externos usam `location.assign`.

[NavigationElement](./src/components/Elements/NavigationElement/NavigationElement.tsx) monta o href com `NEXT_PUBLIC_BASE_URL` e [joinPaths](./src/utils/joinPaths/index.ts). O prefixo de implantação do Next vem de `basePath`. Confira as URLs efetivas ao alterar a implantação.

Estado: `src/store/journeyStore.ts`
Hook: `src/store/useJourneyStore.ts`

### Validação e prefill

A validação estrutural usa o barrel `@/validation/schemas`:

```ts
import { journeySchema } from '@/validation/schemas'

const journey = journeySchema.parse({
  id: 'exemplo',
  name: 'Jornada de exemplo',
  slug: 'jornada-de-exemplo',
  steps: [],
})
```

As responsabilidades são separadas em:

- `schemas`: estrutura declarativa da jornada e dos elementos.
- `fields`: regras de domínio, como CPF, CEP, telefone e nascimento.
- `primitives`: validadores genéricos.
- `form`: montagem do schema a partir dos elementos.
- `form/registry`: handlers de campos.

[buildJourneyFormSchema](./src/validation/form/buildJourneyFormSchema.ts) reúne os schemas de cada etapa e retorna `schema` e `stepFields`. [buildStepFormSchema](./src/validation/form/buildStepFormSchema.ts) percorre os elementos, inclusive filhos em `config.elements`, e usa [elementRegistry](./src/validation/form/elementRegistry.ts) para escolher a validação do campo.

[useJourneyForm](./src/hooks/useJourneyForm.ts) integra o schema ao React Hook Form com `zodResolver`, validação em `onChange` e cálculo de `canProceed` por etapa. `useJourneyController` também exige a hidratação do store para liberar `canProceed`. `SERVICE_CALL` usa esse indicador para desabilitar o botão; `goNext` valida os campos da etapa antes de navegar ou chamar serviço.

O prefill resolve `defaultValue` ou `defaultValueFrom` e preserva campos já preenchidos pelo usuário:

```json
{
  "defaultValueFrom": {
    "service": "eligibility",
    "path": "data.customer.name"
  }
}
```

O caminho precisa corresponder ao contrato real do serviço.

## Actions, condições e integrações

### NAVIGATION e SERVICE_CALL

- `NAVIGATION`: [componente](./src/components/Elements/NavigationElement/NavigationElement.tsx), [schema](./src/validation/schemas/elements/navigation.schema.ts).
- `SERVICE_CALL`: [componente](./src/components/Elements/ServiceCallElement/ServiceCallElement.tsx), [schema](./src/validation/schemas/elements/serviceCall.schema.ts).
- Execução: [src/hooks/useJourneyNavigation.ts](./src/hooks/useJourneyNavigation.ts).
- Despacho de serviços: [src/services/serviceRegistry.ts](./src/services/serviceRegistry.ts).

O registry atual aceita:

1. `callService("eligibility", context)`: consulta o adaptador de elegibilidade.
2. `callService(request, token)`: chama a API configurada após validar a origem.

Para registrar outro serviço por nome, implemente seu adaptador em `src/services` e adicione o despacho no ramo de string de `callService`. Preserve `ServiceResult`, trate falhas e teste o contrato.

A elegibilidade exige a variável **servidora** `ELIGIBILITY_URL`. O endpoint recebe `{ serviceName, fields, business }` e deve responder `{ eligible: boolean }` ou erro com `{ code: "NOT_ELIGIBLE", message?: string }`. Sem configuração, o adaptador retorna indisponibilidade.

A chamada genérica exige `SERVICE_ALLOWED_ORIGINS`, com origens exatas separadas por vírgula. Quando houver token reCAPTCHA, informe `request.recaptchaHeader` conforme o contrato do BFF. URLs inválidas ou origens não autorizadas são recusadas.

### Condições

[evaluateConditions](./src/utils/evaluateConditions/index.ts) trata a visibilidade de wrappers: uma lista simples combinada com AND. Consulte [docs/conditions.md](./docs/conditions.md).

[evaluateConditionRules](./src/utils/evaluateConditions/rules.ts) trata regras de ação, com AND entre checks da regra e OR entre regras. [useConditionGuard](./src/hooks/useConditionGuard.ts) aplica `notify`, `fieldError`, `redirect` ou `fullscreen` quando o consumidor chama `evaluate`. A integração desse hook deve ser explícita no consumidor.

### UI declarada no JSON

Os schemas de UI ficam em [src/validation/schemas/elements/elementUi.schemas.ts](./src/validation/schemas/elements/elementUi.schemas.ts). Os componentes suportados repassam as propriedades declaradas em `config.ui`, como `variant`, `styles`, `size` e `width`.

### Negativa CPF em REFF e FCDC

As jornadas usam `taxvat` para CPF. `NOT_ELIGIBLE` grava erro de formulário do tipo `server`, tornando visível o wrapper `cpf-recommended-products-wrapper`.

O wrapper envia um único `view_promotion` com os dois cards em `items`: título em `item_name`, descrição em `promotion_name` e URL em `item_id`. Re-renders não reenviam o evento; `currency`, `value`, `price` e SKU não são acrescentados nesse contexto. Consulte [docs/conditional-tag.md](./docs/conditional-tag.md).

Os JSONs públicos são exemplos de desenvolvimento; definições comerciais e contratos de BFF precisam de homologação. Os componentes exibem os dados declarados no JSON. Scripts de terceiros são desabilitados por padrão e dependem de habilitação pela integração responsável.

## Como adicionar um elemento

1. Crie `src/validation/schemas/elements/<nome>.schema.ts` seguindo os schemas existentes. Para elementos específicos de produto, consulte também a estrutura de `src/features/fcdc/validation` ou `src/features/reff/validation`.
2. Registre o schema na union de `src/validation/schemas/journeyElement.schema.ts`.
3. Crie o componente em `src/components/Elements/<Nome>Element/<Nome>Element.tsx` ou na feature correspondente e exporte pelo barrel `index.ts`.
4. Integre-o em `src/components/Core/JourneyRenderElements/renderJourneyElement.tsx`, usando o contexto do formulário quando necessário.
5. Para campos, registre a validação em `src/validation/form/elementRegistry.ts`; handlers próprios ficam em `form/registry`.
6. Crie specs em uma pasta `test` e mantenha os quatro limites de cobertura.

## Testes e verificações

Todos os runners usam Vitest. Os testes locais incluem unitários, integração e funcionais; os E2E usam a aplicação standalone no Chromium.

| Comando                                      | Finalidade                             |
| -------------------------------------------- | -------------------------------------- |
| `npm run test:unit`                          | Unitários                              |
| `npm run test:integration`                   | Specs `.integration.spec.ts(x)`        |
| `npm run test:functional`                    | Specs `.functional.spec.tsx`           |
| `npm test`                                   | Todas as suítes locais                 |
| `npm run test:watch`                         | Modo watch                             |
| `npm run test:coverage` ou `npm run test:ci` | Cobertura V8 com quatro limites de 90% |
| `npm run test:e2e:install`                   | Instalar Chromium                      |
| `npm run test:e2e`                           | Build e E2E                            |
| `npm run test:all`                           | Cobertura local e E2E                  |
| `npm run type-check`                         | TypeScript                             |
| `npm run check:imports`                      | Imports, aliases e barrels             |
| `npm run check:empty`                        | Arquivos vazios                        |
| `npm run lint` / `lint:fix`                  | Lint Biome / correção automática       |
| `npm run format` / `format:check`            | Formatação Biome / conferência         |
| `npm run lint:style` / `format:style`        | Stylelint / correção dos estilos       |

O setup é [config/vitest/setup.ts](./config/vitest/setup.ts). O fluxo funcional de CPF está em [JourneyBuilder.functional.spec.tsx](./src/components/Core/JourneyBuilder/test/JourneyBuilder.functional.spec.tsx); os E2E estão em [test/e2e/journeys.spec.ts](./test/e2e/journeys.spec.ts).

A cobertura inclui todo o código de produção em `src`, inclusive módulos ainda sem testes; exclui apenas declarações `.d.ts` e pastas `test`. O comando falha se linhas, instruções, funções ou branches ficarem abaixo de 90%. Os relatórios são gerados em `coverage`. A cobertura local não contabiliza o código executado no processo Next do E2E.

Para usar Chromium já instalado na máquina ou pipeline, configure `CHROMIUM_EXECUTABLE_PATH`. Os E2E leem o `basePath` do manifest de build e usam backend HTTP local controlado; isso não representa homologação do backend corporativo nem do GTM real.

## Documentação e contribuição

Consulte [AGENTS.md](./AGENTS.md) e as regras locais de [Core](./src/components/Core/AGENTS.md), [Elements](./src/components/Elements/AGENTS.md), [UI](./src/components/UI/AGENTS.md), [hooks](./src/hooks/AGENTS.md), [services](./src/services/AGENTS.md), [store](./src/store/AGENTS.md), [utils](./src/utils/AGENTS.md), [validation](./src/validation/AGENTS.md) e [features](./src/features/AGENTS.md).

Use componentes em `PascalCase.tsx`, hooks em `useNome.ts`, schemas em `<nome>.schema.ts`, tipos em `types.ts` ou `<Componente>.types.ts`, barrels `index.ts` e testes `.spec.ts` / `.spec.tsx` dentro de `test`. Os imports entre pastas usam o alias `@/`; prefira os barrels públicos.

### GitHub

A branch principal deste repositório é `main`. Crie branches `feat/`, `fix/`, `refactor/` ou `chore/`, use Conventional Commits e abra PR para `main`.

Antes do PR, execute as verificações aplicáveis acima, incluindo TypeScript, lint e cobertura. O hook pre-push exige `test:ci`. Para exigir cobertura e E2E na integração contínua, configure a pipeline e a proteção da branch para executar `npm run test:all` e respeitar o código de saída.

### Fluxo corporativo

O ambiente corporativo utiliza GitLab/Jenkins e o fluxo:

- `master` como base.
- `release-dd/mm/aaaa` criada a partir de `master` no início da sprint.
- `feature/HDV-XXXX` criada a partir da release para features e correções.
- Features podem ser implantadas em `dev` e `hml`.
- Trabalho homologado retorna à release; no fechamento, a release é integrada à `master`.

Nesse ambiente, os alvos de merge são `feature → release` e `release → master`. A configuração da pipeline corporativa externa deve ser mantida pela equipe responsável.
