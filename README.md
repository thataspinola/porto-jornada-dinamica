# @porto/react-ssr-corp-hubv-dinamic-journey

Projeto gerado via [Tech Store](https://portostage.portoseguro.brasil/) para executar jornadas declaradas em JSON: renderização por `type`, formulário dinâmico, navegação entre etapas, chamadas de serviço e persistência de estado.

## Stack e pré-requisitos

- Node.js >= 20.19.0.
- Next.js 16 (App Router) e React 19.
- React Hook Form e Zod para controle e validação do formulário.
- Zustand para estado e TanStack Query para cache de consultas.
- Vitest 4.1.9 e Testing Library; Playwright como driver do Chromium nos E2E.
- Biome para lint/formatação e Stylelint para SCSS.

A configuração de instalação fica em [.npmrc](./.npmrc), com Nexus corporativo e certificado em [config/nexus/certificate.crt](./config/nexus/certificate.crt). As dependências `@porto-stack/*` exigem acesso ao registro corporativo. Instale as dependências no ambiente autorizado:

```sh
npm install
npm run dev
```

O preset Biome corporativo é usado quando instalado. Fora desse ambiente, [scripts/run-biome.mjs](./scripts/run-biome.mjs) usa [config/biome.local.json](./config/biome.local.json). A validação do perfil corporativo continua dependendo da VDI/Nexus. O repositório atualmente não possui lockfile versionado.

## URLs e execução local

```bash
npm run dev         # dev server
npm run build       # build de produção
npm run start       # roda a build
npm run lint        # biome check
npm run format      # biome format
npm run test        # vitest (watch)
npm run test:run    # vitest run (CI)
```

Com a configuração atual e a porta padrão:

| Recurso                      | URL                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Catálogo na página inicial   | <http://localhost:3000/contrate>                                                 |
| Catálogo na rota de jornadas | <http://localhost:3000/contrate/contrate>                                        |
| CPF de FCDC                  | <http://localhost:3000/contrate/contrate/financiamento-de-veiculos/cpf>          |
| CPF de REFF                  | <http://localhost:3000/contrate/contrate/emprestimo-com-garantia-de-veiculo/cpf> |
| Health                       | <http://localhost:3000/contrate/api/health>                                      |

O diretório de build é `dist/react-ssr-corp-hubv-dinamic-journey`. O prefixo HTTP é definido por `basePath`.

Para usar Webpack no desenvolvimento, execute `npm run dev-webpack`. Para produção local:

```sh
npm run build
npm run start
```

O build gera a aplicação standalone. O `postbuild` copia `public` e os arquivos estáticos para ela por meio de [scripts/copy-standalone.mjs](./scripts/copy-standalone.mjs).

## Árvore de pastas

Resumo dos diretórios e dos pontos de entrada existentes:

```text
config/
  nexus/
  vitest/
    setup.ts
docs/
public/
  jsonContent/
scripts/
src/
  @types/
  app/
    api/health/
    contrate/[[...slug]]/
    test/
  assets/
    fonts/
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

### Estado e navegação

[src/store/journeyStore.ts](./src/store/journeyStore.ts) exporta o hook `useJourneyStore` e o alias `journeyStore`, usado com `getState` e `subscribe`. Importe o hook por `@/store`.

O estado contém `fields`, `error`, `business`, `services`, `parameters`, `errors` e `_hasHydrated`. A persistência em `sessionStorage` guarda `fields`, `error`, `business` e `services`.

[useJourneySteps](./src/hooks/useJourneySteps.ts) identifica a etapa pelo último segmento da URL e sincroniza `business.journeyId`, `business.journeySlug` e `business.stepSlug`. [redirectTo](./src/utils/redirectTo/index.ts) usa `history.pushState` para destinos internos e publica o evento de navegação; destinos HTTP(S) externos usam `location.assign`.

[NavigationElement](./src/components/Elements/NavigationElement/NavigationElement.tsx) monta o href com `NEXT_PUBLIC_BASE_URL` e [joinPaths](./src/utils/joinPaths/index.ts). O prefixo de implantação do Next vem de `basePath`. Confira as URLs efetivas ao alterar a implantação.

Estado: `src/store/journeyStore.ts`
Hook: `src/store/useJourneyStore.ts`

## Validação

### 1) Validação estrutural do JSON (Zod)

Antes de executar, o JSON é validado/parseado via `journeySchema` (inclui validação do shape de cada elemento por `type`).

Exemplo (jornada mock):

```ts
import { journeySchema } from '@/validation/schemas'

export const sampleJourney = journeySchema.parse({
  id: 'j1',
  name: 'Minha Jornada',
  slug: 'minha-jornada',
  steps: [
    /* ... */
  ],
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

- `schema`: um Zod object "flat" (cada field é uma key)
- `stepFields`: mapeamento `{ [stepId]: string[] }` com os nomes dos campos do step

O schema é consumido por `useJourneyForm`, que cria o RHF com `zodResolver(schema)`:

- `src/hooks/useJourneyForm.ts`

## Contexto e roteamento interno

O runner mantém o step atual em `stepSlug` (Zustand) e também atualiza a URL via `window.history.pushState`.
Se existir `business.base_url`, ela é usada como prefixo (útil quando o app roda sob um path).

Helper: `src/utils/joinPaths/index.ts`

## Actions: NAVIGATION e SERVICE_CALL

As actions são elementos que disparam efeitos:

### NAVIGATION

Objetivo: navegar para um step (slug/url), respeitando validação do step atual.

- Elemento: `src/components/Elements/NavigationElement/NavigationElement.tsx`
- Schema: `src/validation/schemas/elements/navigation.schema.ts`
- Execução: `goNext` em `src/hooks/useJourneyNavigation.ts`

### SERVICE_CALL

Objetivo: chamar um serviço registrado e, em sucesso, navegar para um step alvo.

- Elemento: `src/components/Elements/ServiceCallElement/ServiceCallElement.tsx`
- Schema: `src/validation/schemas/elements/serviceCall.schema.ts`
- Execução: `goNext` com `type: "service"` em `src/hooks/useJourneyNavigation.ts`
- Registry de serviços: `src/services/serviceRegistry.ts`

Exemplo de implementação de um novo serviço:

```ts
// src/services/serviceRegistry.ts
const myService: ServiceHandler = async (input) => {
  return { success: true, data: { ok: true, input } }
}

const handlers: Record<string, ServiceHandler> = {
  eligibility,
  myService,
}
```

## Bloqueio de ações quando o step está inválido (A1)

O hook `useJourneyForm` calcula `canProceed` para o step atual usando:

- `mode: "onChange"` e `reValidateMode: "onChange"` no RHF
- `schema.safeParse(watchedValues)` para checar erros nos campos do step atual

Trecho-chave: `src/hooks/useJourneyForm.ts`

Esse `canProceed` é passado para `NAVIGATION` e `SERVICE_CALL` via `ElementRenderContext` no registry:

- `src/components/Core/JourneyRenderElements/renderJourneyElement.tsx`

E então os elementos aplicam `disabled`/`aria-disabled` quando `!canProceed`.

## Prefill de inputs via services (`defaultValueFrom`)

Para pré-preencher um input com base no resultado de um `SERVICE_CALL`, use `defaultValueFrom`.
O hook `useJourneyForm` resolve o valor a partir do store `services[serviceName]` e aplica no campo **apenas se o usuário ainda não preencheu**.

Formato:

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
| `npm run check:names`                        | Nomes e localização dos specs          |
| `npm run check:empty`                        | Arquivos vazios                        |
| `npm run lint` / `lint:fix`                  | Lint Biome / correção automática       |
| `npm run format` / `format:check`            | Formatação Biome / conferência         |
| `npm run lint:style` / `format:style`        | Stylelint / correção dos estilos       |

O setup é [config/vitest/setup.ts](./config/vitest/setup.ts). O fluxo funcional de CPF está em [JourneyBuilder.functional.spec.tsx](./src/components/Core/JourneyBuilder/test/JourneyBuilder.functional.spec.tsx); os E2E estão em [test/e2e/journeys.spec.ts](./test/e2e/journeys.spec.ts).

A cobertura inclui todo o código de produção em `src`, inclusive módulos ainda sem testes; exclui apenas declarações `.d.ts` e pastas `test`. O comando falha se linhas, instruções, funções ou branches ficarem abaixo de 90%. Os relatórios são gerados em `coverage`. A cobertura local não contabiliza o código executado no processo Next do E2E.

Para usar Chromium já instalado na máquina ou pipeline, configure `CHROMIUM_EXECUTABLE_PATH`. Os E2E leem o `basePath` do manifest de build e usam backend HTTP local controlado; isso não representa homologação do backend corporativo nem do GTM real.

### Validação registrada em 14/10/2026

- Vitest 4.1.9: 625 testes locais em 122 arquivos passaram.
- Chromium 153: os 3 E2E passaram.
- TypeScript, imports, nomes, arquivos vazios, formatação, lint local e build passaram.

| Métrica V8 | Cobertura |
| ---------- | --------: |
| Linhas     |    95,65% |
| Instruções |    95,04% |
| Funções    |    94,39% |
| Branches   |    90,64% |

Esses resultados registram a versão validada naquela data. Mudanças posteriores devem executar novamente as verificações. O perfil e os pacotes corporativos exigem validação na VDI/Nexus.

## Documentação e contribuição

Consulte [AGENTS.md](./AGENTS.md) e as regras locais de [Core](./src/components/Core/AGENTS.md), [Elements](./src/components/Elements/AGENTS.md), [UI](./src/components/UI/AGENTS.md), [hooks](./src/hooks/AGENTS.md), [services](./src/services/AGENTS.md), [store](./src/store/AGENTS.md), [utils](./src/utils/AGENTS.md), [validation](./src/validation/AGENTS.md) e [features](./src/features/AGENTS.md).

Use componentes em `PascalCase.tsx`, hooks em `useNome.ts`, schemas em `<nome>.schema.ts`, barrels `index.ts` e testes `.spec.ts` / `.spec.tsx` dentro de `test`. Os imports entre pastas usam o alias `@/`; prefira os barrels públicos.

### GitHub

A branch principal deste repositório é `main`. Crie branches `feat/`, `fix/`, `refactor/` ou `chore/`, use Conventional Commits e abra PR para `main`.

```sh
git checkout main
git pull --ff-only
git checkout -b chore/minha-alteracao
```

Antes do PR, execute as verificações aplicáveis acima, incluindo TypeScript, lint e cobertura. O hook pre-push exige `test:ci`. Para exigir cobertura e E2E na integração contínua, configure a pipeline e a proteção da branch para executar `npm run test:all` e respeitar o código de saída.

### Fluxo corporativo

O ambiente corporativo utiliza GitLab/Jenkins e o fluxo:

- `master` como base.
- `release-dd/mm/aaaa` criada a partir de `master` no início da sprint.
- `feature/HDV-XXXX` criada a partir da release para features e correções.
- Features podem ser implantadas em `dev` e `hml`.
- Trabalho homologado retorna à release; no fechamento, a release é integrada à `master`.

É necessária a instalação das dependências do projeto.

```bash
npm install
```

## Development server

Rode `npm run dev` para executar o servidor local do projeto e acesse `http://localhost:3000/react-ssr-corp-hubv-dinamic-journey`.

## Build

Rode `npm run build` para executar o build do projeto. Os artefatos serão armazenados no diretório `dist/react-ssr-corp-hubv-dinamic-journey`.

## Unit tests

Todos os runners usam Vitest. Os comandos `test:unit`, `test:integration` e `test:functional` selecionam as suítes locais; `npm test` executa todas elas. `npm run test:coverage` e `test:ci` geram relatórios em `coverage` e falham quando linhas, instruções, funções ou branches ficam abaixo de 90%. O denominador inclui todo o código de produção em `src`, inclusive módulos ainda sem testes; apenas declarações de tipos `.d.ts` e as pastas `test` são excluídas. Configurar o limite não significa que ele já foi atingido.

Para E2E, instale as dependências e execute `npm run test:e2e:install` para instalar Chromium, depois `npm run test:e2e`. O comando faz build de produção, inicia aplicação e backend HTTP locais em portas livres e executa o navegador. `npm run test:all` exige cobertura local mínima e depois executa E2E. A cobertura V8 do Vitest local não contabiliza o código executado no processo Next do E2E.

O hook pre-push exige `test:ci`; configure a pipeline GitLab/Jenkins e a proteção da branch para exigir `npm run test:all`, sem ignorar seu código de saída. A pipeline corporativa externa não é alterada por esta configuração.

## Conteúdo e integração

As jornadas são lidas de `public/jsonContent`. Os JSONs recuperados de `src/mock` e as jornadas iniciais incluídas são exemplos de desenvolvimento; não substituem as definições comerciais homologadas. Os componentes exibem dados e opções declarados no JSON, sem calcular taxas ou aprovar propostas.

A elegibilidade exige a variável de ambiente **servidora** `ELIGIBILITY_URL`, com um endpoint que receba o contexto `{ serviceName, fields, business }` e retorne `{ eligible: boolean }` ou erro com `{ code: "NOT_ELIGIBLE", message?: string }`. Sem configuração, o fluxo retorna indisponibilidade e não aprova CPF. Esse contrato deve ser adaptado e validado com o BFF corporativo antes de uso real. Outros serviços precisam ser registrados em `src/services/serviceRegistry.ts`.

REFF e FCDC usam `taxvat` para CPF; a negativa exibe os dois produtos sugeridos e registra uma impressão conjunta. Scripts de terceiros são desabilitados por padrão e precisam ser habilitados pela integração responsável.
