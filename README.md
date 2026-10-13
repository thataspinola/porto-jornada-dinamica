# @porto/react-ssr-corp-hubv-dinamic-journey

Esse projeto foi gerado via [Tech Store](https://portostage.portoseguro.brasil/).

## Pré-requisitos

Para execução dos comandos `npm` é necessário a instalação das dependências do projeto Dynamic Journey.

```bash
npm install
```

Aplicação Next.js para **executar jornadas (flows) declaradas em JSON**, com:

- renderização dinâmica de elementos por `type`
- validação de formulário gerada automaticamente a partir da jornada (Zod)
- navegação entre steps e chamadas de serviço (actions `NAVIGATION` e `SERVICE_CALL`)
- persistência de estado (Zustand)

## Stack

- Next.js (App Router): UI e runtime
- React Hook Form: controle de formulário
- Zod: validação estrutural (jornada) e validação do formulário (gerada dinamicamente)
- Zustand: store global do runner
- Jest + Testing Library: testes
- Biome: lint/format
- Sass: estilos (`.scss`) dos componentes base

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

### Scripts

```bash
npm run dev        # dev server
npm run build      # build de produção
npm run start      # roda a build
npm run lint       # biome check
npm run format     # biome format
npm run test       # vitest (watch)
npm run test:run   # vitest run (CI)
```

Se o problema estiver no Turbopack (Next dev):

```bash
npm run dev-webpack
```

## Documentação

Guias específicos vivem em [`docs/`](./docs):

- [Conditions em `SERVICE_CALL` e `NAVIGATION`](./docs/conditions.md) — bloquear chamadas/navegação com regras declarativas (AND/OR), aplicar `notify`, `fieldError` ou `redirect`.

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
git checkout master
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
  - `release-dd/mm/aaaa` → `master` (fechamento de sprint)

## Árvore de pastas (resumo)

```bash
src/
  app/                         # Next App Router
  components/
    JourneyRunner.tsx           # orquestração do flow (steps/actions/validação)
    elementRegistry.tsx         # roteia element.type -> componente
    elements/
      Button|Link|Input|Typography/  # componentes base de UI (SCSS)
      *Element.tsx              # elementos do flow (adapters)
  hooks/
    useJourneyRunnerController.ts  # compõe os hooks abaixo (ponto de entrada)
    useJourneySteps.ts          # gerenciamento de steps e slug
    useJourneyForm.ts           # schema RHF, prefill e canProceed
    useJourneyNavigation.ts     # navegação, validação e SERVICE_CALL
  mock/
    sampleJourney.ts            # jornada de exemplo (parseada pelo Zod)
  services/
    serviceRegistry.ts          # registry de serviços (SERVICE_CALL)
  store/
    journeyStore.ts             # estado Zustand (getState / subscribe)
    useJourneyStore.ts          # hook Zustand do runner
  utils/
    joinPaths.ts                # helper de URL/path
  validation/
    schemaValidation/           # schemas Zod da jornada (estrutura)
    validations/                # geração do schema do formulário por jornada
```

## Conceitos principais

### JourneyDefinition (o "JSON da jornada")

Uma jornada tem `id/name/slug` e uma lista de `steps`. Cada step possui `slug` e uma lista de `elements`.

- Schema: `src/validation/schemaValidation/journeySchema.ts`
- Step schema: `src/validation/schemaValidation/journeyStepSchema.ts`
- Element union (discriminatedUnion por `type`): `src/validation/schemaValidation/journeyElementSchema.ts`
- Exemplo: `src/mock/sampleJourney.ts`

### Renderização dinâmica (elementRegistry)

A UI é montada percorrendo `step.elements` e renderizando cada elemento baseado no campo `type`.

- Registry: `src/components/elementRegistry.tsx`

Fluxo simplificado:

```bash
JourneyRunner -> renderJourneyElement(element, ctx) -> componente do elemento
```

### Store (Zustand)

O runner persiste dados em store para reuso e debug:

- `stepSlug`: step atual
- `fields`: valores do formulário
- `error`: erros "de alto nível" (ex: erro de service)
- `business`: contexto/metadata (ex: base_url, journeyId, stepSlug)
- `services`: resultados de SERVICE_CALL

Estado: `src/store/journeyStore.ts`

Hook: `src/store/useJourneyStore.ts`

## Validação

### 1) Validação estrutural do JSON (Zod)

Antes de executar, o JSON é validado/parseado via `journeySchema` (inclui validação do shape de cada elemento por `type`).

Exemplo (jornada mock):

```ts
import { journeySchema } from '@/validation/schemaValidation/journey.schema'

export const sampleJourney = journeySchema.parse({
  id: 'j1',
  name: 'Minha Jornada',
  slug: 'minha-jornada',
  steps: [
    /* ... */
  ],
})
```

### 2) Validação do formulário (gerada a partir da jornada)

O schema do formulário é gerado dinamicamente com base nos elementos do step (ex.: `TEXT_INPUT.required`).

- Builder: `src/validation/validations/buildJourneyFormSchema.ts`

Ele retorna:

- `schema`: um Zod object "flat" (cada field é uma key)
- `stepFields`: mapeamento `{ [stepId]: string[] }` com os nomes dos campos do step

O schema é consumido por `useJourneyForm`, que cria o RHF com `zodResolver(schema)`:

- `src/hooks/useJourneyForm.ts`

## Contexto e roteamento interno

O runner mantém o step atual em `stepSlug` (Zustand) e também atualiza a URL via `window.history.pushState`.

Se existir `business.base_url`, ela é usada como prefixo (útil quando o app roda sob um path).

Helper: `src/utils/joinPaths.ts`

## Actions: NAVIGATION e SERVICE_CALL

As actions são elementos que disparam efeitos:

### NAVIGATION

Objetivo: navegar para um step (slug/url), respeitando validação do step atual.

- Elemento: `src/components/elements/NavigationElement.tsx`
- Schema: `src/validation/schemaValidation/navigationElementSchema.ts`
- Execução: `goNext` em `src/hooks/useJourneyNavigation.ts`

### SERVICE_CALL

Objetivo: chamar um serviço registrado e, em sucesso, navegar para um step alvo.

- Elemento: `src/components/elements/ServiceCallElement.tsx`
- Schema: `src/validation/schemaValidation/serviceCallElementSchema.ts`
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

- `src/components/elementRegistry.tsx`

E então os elementos aplicam `disabled`/`aria-disabled` quando `!canProceed`.

## Prefill de inputs via services (`defaultValueFrom`)

Para pré-preencher um input com base no resultado de um `SERVICE_CALL`, use `defaultValueFrom`.

O hook `useJourneyForm` resolve o valor a partir do store `services[serviceName]` e aplica no campo **apenas se o usuário ainda não preencheu**.

Formato:

```json
{
  "defaultValueFrom": {
    "service": "eligibility",
    "path": "data.input.fields.field_cpf-input_m7oqd4"
  }
}
```

Também existe `defaultValue` (string literal) para defaults fixos.

## UI via JSON (`config.ui`)

Alguns elementos aceitam um bloco `ui` no `config` para repassar props de UI (whitelist), sem permitir "spread" de props arbitrárias do JSON.

Schemas:

- `src/validation/schemaValidation/elementUiSchemas.ts`

Exemplo (SERVICE_CALL usando Button):

```json
{
  "type": "SERVICE_CALL",
  "config": {
    "label": "Continuar",
    "service": "eligibility",
    "targetStepOnSuccess": "placa",
    "ui": {
      "variant": "insurance",
      "styles": "primary",
      "size": "large",
      "width": "fluid"
    }
  }
}
```

## Como adicionar um novo tipo de elemento

1. Criar um schema em `src/validation/schemaValidation/*ElementSchema.ts`
2. Registrar o schema no `discriminatedUnion` em `journeyElementSchema.ts`
3. Criar um componente em `src/components/elements/*Element.tsx`
4. Renderizar no registry: `elementRegistry.tsx`
5. Se o elemento cria/usa um field de formulário, adicionar regra em `buildJourneyFormSchema.ts`

## Testes

- Integração do runner (validação + actions): `src/components/JourneyRunner.test.tsx`
- Service registry: `src/services/serviceRegistry.test.ts`
- Setup do ambiente de teste: `src/test/setup.ts`

É necessária a instalação das dependências do projeto.

```bash
npm install
```

## Development server

Rode `npm run dev` para executar o servidor local do projeto e acesse `http://localhost:3000/react-ssr-corp-hubv-dinamic-journey`.

## Build

Rode `npm run build` para executar o build do projeto. Os artefatos serão armazenados no diretório `dist/react-ssr-corp-hubv-dinamic-journey`.

## Unit tests

Rode `npm run test` para executar os testes unitários via [Jest](https://www.npmjs.com/package/jest). Os resultados serão armazenados no diretório `coverage`.

## Verificações

Execute `npm run check:imports`, `npm run check:empty`, `npm run check:names`, `npm run format:check`, `npm run type-check`, `npm run lint` e `npm test -- --runInBand`. O runner oficial é Jest; a configuração Vitest é legada.

## Conteúdo e integração

As jornadas são lidas de `public/jsonContent`. Os JSONs recuperados de `src/mock` e as jornadas iniciais incluídas são exemplos de desenvolvimento; não substituem as definições comerciais homologadas. Os componentes exibem dados e opções declarados no JSON, sem calcular taxas ou aprovar propostas.

A elegibilidade exige a variável de ambiente **servidora** `ELIGIBILITY_URL`, com um endpoint que receba o contexto `{ serviceName, fields, business }` e retorne `{ eligible: boolean }` ou erro com `{ code: "NOT_ELIGIBLE", message?: string }`. Sem configuração, o fluxo retorna indisponibilidade e não aprova CPF. Esse contrato deve ser adaptado e validado com o BFF corporativo antes de uso real. Outros serviços precisam ser registrados em `src/services/serviceRegistry.ts`.

REFF e FCDC usam `taxvat` para CPF; a negativa exibe os dois produtos sugeridos e registra uma impressão conjunta. Scripts de terceiros são desabilitados por padrão e precisam ser habilitados pela integração responsável.
