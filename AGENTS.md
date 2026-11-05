# AGENTS.md — Jornada Dinâmica

Regras gerais do projeto. Cada pasta importante tem seu próprio `AGENTS.md` com regras específicas (sempre leia o mais próximo do arquivo que você está editando).

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** com `strict: false` mas com `forceConsistentCasingInFileNames`
- **Zod** para schemas/validações
- **react-hook-form** + `@hookform/resolvers/zod`
- **Zustand** (com `persist`) para estado global
- **TanStack Query** para data fetching
- **Biome** para lint + format (não use ESLint/Prettier)
- **Vitest** + Testing Library
- **SCSS Modules** (`*.module.scss`) para estilos por componente
- **@porto-stack/ui** e **@porto-stack/icons** como design system

## Comandos

```sh
npm run dev          # next dev --turbopack
npm run build        # next build
npm run lint         # biome check ./src ./test
npm run format       # biome format --write ./src ./test
npm run type-check   # tsc --noEmit
npm run test         # vitest run
npm run test:watch   # vitest
```

**Antes de finalizar qualquer alteração:** rode `npm run type-check` e `npm run lint`.

## Estrutura de alto nível

```
src/
├── app/              ← rotas Next (App Router). Pages, layouts, error boundaries.
├── components/
│   ├── Core/         ← componentes de orquestração (containers com lógica)
│   ├── Elements/     ← componentes de elemento de jornada (1:1 com schema)
│   └── UI/           ← componentes de apresentação pura (sem regra de negócio)
├── features/         ← código vertical por feature (ex.: fcdc)
├── hooks/            ← hooks reutilizáveis cross-feature
├── lib/              ← infra (axios, query client, auth)
├── scripts/          ← integrações third-party client-side (GTM, VWO, etc.)
├── services/         ← chamadas server-side ('use server'); ver AGENTS.md local
├── store/            ← Zustand stores globais
├── utils/            ← funções puras reutilizáveis
└── validation/       ← schemas Zod da jornada + form schema builder
```

## Convenções universais

### Imports
- **Sempre** use o alias `@/...` para imports cross-folder. Nunca `../../../`.
- Imports relativos `./xxx` só dentro da mesma pasta.
- Prefira o barrel da pasta quando não misturar fronteiras cliente/servidor ou gerar ciclos. Imports diretos são necessários nesses casos.
- Ordem (Biome organiza automaticamente): externos → `@/...` → relativos.

### Nomes
- Arquivos de componente React: `PascalCase` (ou `index.tsx` dentro de pasta `PascalCase/`).
- Hooks: `useNomeDoHook.ts` em camelCase.
- Funções e variáveis: camelCase.
- Tipos e componentes: PascalCase.
- Schemas Zod: `<nome>.schema.ts` em `src/validation/schemas/` ou na validação da feature correspondente.
- Constantes globais: `SCREAMING_SNAKE_CASE`.
- Mensagens de UI e erro em **português** (padrão do projeto).

### Componentes
- Server Component por padrão. Use `'use client'` **apenas** quando precisar de hook React, evento DOM, ou store cliente.
- Server actions e código `next-runtime-env` ficam em arquivos com `'use server'` no topo.
- Estilo via `*.module.scss` ao lado do componente. Importe como `import styles from './X.module.scss'`.

### TypeScript
- Evite `any`. Quando inevitável, comente com `// biome-ignore lint/suspicious/noExplicitAny: <motivo>` e justifique.
- Prefira tipos derivados (`Extract<Union, ...>`, `infer`, `z.infer<>`) ao invés de duplicar shapes.
- Não adicione docstrings/comentários em código que não está sendo alterado.

### Git
- Branches: `feat/...`, `refactor/...`, `fix/...`, `chore/...`.
- Use `git mv` ao mover/renomear arquivos para preservar histórico.
- Não use `--force`, `--no-verify`, `git reset --hard` em código compartilhado sem confirmação.

## Onde aprender padrões específicos

| Tarefa | AGENTS.md a consultar |
|---|---|
| Adicionar/editar elemento da jornada | [src/components/Elements/AGENTS.md](src/components/Elements/AGENTS.md) e [src/validation/AGENTS.md](src/validation/AGENTS.md) |
| Mexer em container/orquestrador (form, render) | [src/components/Core/AGENTS.md](src/components/Core/AGENTS.md) |
| Criar componente visual reutilizável | [src/components/UI/AGENTS.md](src/components/UI/AGENTS.md) |
| Chamar backend (API) | [src/services/AGENTS.md](src/services/AGENTS.md) |
| Criar/editar validação ou schema | [src/validation/AGENTS.md](src/validation/AGENTS.md) |
| Criar função util / máscara | [src/utils/AGENTS.md](src/utils/AGENTS.md) |
| Estado global (Zustand) | [src/store/AGENTS.md](src/store/AGENTS.md) |
| Hook customizado | [src/hooks/AGENTS.md](src/hooks/AGENTS.md) |
| Código de feature isolada | [src/features/AGENTS.md](src/features/AGENTS.md) |

## Disciplina

- Não adicione features, refatorações ou "melhorias" além do que foi pedido.
- Não crie helpers/abstrações para uso único.
- Não valide cenários impossíveis — só nas bordas do sistema.
- Não crie markdowns de documentação sem ser pedido.

## Testes, validação e manutenção

- Todos os testes, setup, fixtures e tipos exclusivos de teste ficam em `test/` na raiz, fora de `src/`. Usar `.spec.ts`/`.spec.tsx`; não usar `.test` ou `__test__`. Consultar [test/AGENTS.md](test/AGENTS.md).
- Preservar os testes da versão de produção ao movê-los. Usar somente Vitest, sem `--passWithNoTests`. Integração usa `.integration.spec.*`, funcional `.functional.spec.*`; E2E fica em `test/e2e/` e usa aplicação real com Playwright.
- Executar check:imports, check:empty, check:names, check:journeys, format:check, type-check, lint e test:coverage. `npm run verify` reúne essas verificações. Manter no mínimo 90% em linhas, instruções, funções e branches de toda a produção, sem excluir arquivos para atingir a meta. Relatar suítes bloqueadas e cobertura não medida.
- Manter o padrão de componentes da base (`index.tsx` ou arquivo nomeado com barrel), tipos `.ts`, schemas `.schema.ts` e estilos existentes. Não reintroduzir implementações antigas por cima dos contratos de produção.
- Não criar aliases globais, tipos falsos ou substitutos de pacotes corporativos para simular validação. Não versionar dados de homologação, credenciais, artefatos gerados ou paths de máquina.
- O wrapper de sugestões de CPF só envia a promoção em REFF/FCDC, uma vez por montagem após ficar visível. Montagem do payload fica no util puro, sem alterar dispatchAlert.
- Atualizar README/AGENTS e CHANGELOG com as alterações; gerar docs:generate e validar docs:check. Commits seguem Conventional Commits. O diário `npm run changelog -- BASE..HEAD` é regenerável. Preservar Lefthook e a entrega GitLab/Jenkins.

- `noUnusedLocals` e `noUnusedParameters` ficam ativos no TypeScript. Não manter serviços mockados sem referências ou desativar esses checks para contornar código morto.
- Executar `check:journeys` ao alterar schemas, renderizadores ou JSONs; ele confere a cobertura dos tipos e não substitui a validação Zod completa. Consultar `docs/component-compatibility.md` antes de reintroduzir componentes do protótipo.
