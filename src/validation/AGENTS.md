# AGENTS.md — `src/validation`

Regras para qualquer alteração dentro desta pasta. Leia antes de mexer.

## Mapa de responsabilidades

| Pasta | O que vai aqui | O que NÃO vai aqui |
|---|---|---|
| `schemas/` | Schemas Zod que descrevem a **estrutura do JSON da jornada** (definição declarativa). | Validações do formulário do usuário, regras de negócio. |
| `schemas/elements/` | Um arquivo por tipo de elemento da jornada (`<nome>.schema.ts`). | Schemas de step/journey/raiz. |
| `primitives/` | Blocos Zod **genéricos e sem domínio** (`requiredString`, `optionalBoolean`, etc.). | Qualquer regra de negócio (CPF, CEP, telefone, etc.). |
| `fields/` | Validadores de **campos com regra de domínio** (`cpf`, `cep`, `phone`, `birthDate`). | Primitivos genéricos. UI. |
| `form/` | Orquestração que monta o schema dinâmico do formulário a partir da definição da jornada. | Validadores em si. |
| `form/registry/` | Handlers **complexos** do `elementRegistry` (com `refine` ou helpers próprios). | Handlers triviais de uma linha. |

## Convenções de nome de arquivo

- Schemas da jornada: `<nome>.schema.ts` (ex.: `journey.schema.ts`, `elements/biologicalSex.schema.ts`).
- UI schemas agrupados: `elementUi.schemas.ts` (plural só quando o arquivo agrupa vários).
- Não use o sufixo `Element` no nome do arquivo dentro de `elements/` — a pasta já comunica isso.
- Primitivos e fields: nome do que exportam, em camelCase (ex.: `requiredString.ts`, `cpf.ts`).
- Handlers do registry: nome do elemento em camelCase (ex.: `priceSimulation.ts`).

## Imports — sempre use os barrels

```ts
// ✅ correto
import { requiredString, optionalString } from '@/validation/primitives'
import { cpf, cep, phone } from '@/validation/fields'
import { buildStepFormSchema } from '@/validation/form'
import type { JourneyDefinition } from '@/validation/schemas'

// ❌ evite caminhos profundos
import { cpf } from '@/validation/fields/cpf'
import type { JourneyDefinition } from '@/validation/schemas/journey.schema'
```

- Sempre `@/validation/...`. Nunca `../../validation/...`.
- Imports entre arquivos da **mesma pasta** podem (e devem) ser relativos `./xxx`.

## Onde adicionar coisas novas

### Novo primitivo Zod genérico
1. Crie `primitives/<nome>.ts` exportando uma função.
2. Adicione `export { <nome> } from './<nome>'` em `primitives/index.ts`.

### Novo validador de campo com regra de negócio
1. Crie `fields/<nome>.ts`.
2. Adicione `export { <nome> } from './<nome>'` em `fields/index.ts`.

### Novo tipo de elemento da jornada
1. Crie o schema Zod em `schemas/elements/<nome>.schema.ts` estendendo `baseElementSchema`.
2. Inclua-o no `discriminatedUnion` de `schemas/journeyElement.schema.ts`.
3. Adicione o handler em `form/elementRegistry.ts`:
   - **Trivial** (sem `refine`, ≤ 4 linhas) → inline no `elementRegistry.ts`.
   - **Complexo** (tem `refine`, helpers próprios, multi-linha) → arquivo em `form/registry/<nome>.ts` tipado com `ElementHandler<'TIPO'>`, referenciado por nome no registry.

### Novo helper só usado por um handler
Mantenha **dentro** do arquivo do handler em `form/registry/`. Não crie pasta `utils/` aqui — se virar realmente reutilizável, mova para `src/utils/`.

## Anti-padrões proibidos

- ❌ Criar pasta `validations/` ou `schemaValidation/` novamente (ambiguidade resolvida no refactor).
- ❌ Misturar regra de negócio em `primitives/`.
- ❌ Adicionar lógica de UI, fetch, store ou navegação aqui.
- ❌ Importar de `form/` dentro de `primitives/`, `fields/` ou `schemas/` (a dependência é unidirecional: `form` → tudo o resto; nada depende de `form`).
- ❌ Deixar handler do registry com mais de ~15 linhas inline — extraia para `form/registry/`.

## Direção das dependências

```
schemas/  ← form/
primitives/ ← form/, fields/ (fields pode usar primitives)
fields/  ← form/
form/registry/ → primitives/, fields/, schemas/ (via tipo)
```

Resumo: `schemas/`, `primitives/` e `fields/` **não devem** importar de `form/`.

## Mensagens de erro

Em português, padrão do projeto:
- Obrigatório: `'Campo obrigatório'`
- Formato inválido genérico: `'<Coisa> inválido(a)'` (ex.: `'CPF inválido'`, `'E-mail inválido'`)
- Tamanho: `'Deve ter N dígitos'`

## Validação antes de subir

```sh
npx tsc --noEmit
npx biome check src
```

## Testes e preservação dos contratos

Specs deste escopo ficam em `test/src/validation/`, fora de src, com sufixo `.spec`. Consultar o AGENTS da raiz e `test/AGENTS.md`; não criar setup, fixtures ou declarações de testes nesta pasta. Preservar os contratos da versão de produção e corrigir imports/casing ao mover arquivos. Não substituir dependências corporativas para declarar aprovação; registrar limites da validação.
