# AGENTS.md — Jornada Dinâmica

Regras gerais do projeto. Cada pasta importante tem seu próprio `AGENTS.md` com regras específicas (sempre leia o mais próximo do arquivo que você está editando).

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** com `strict: false` mas com `forceConsistentCasingInFileNames`
- **Zod** para schemas/validações
- **react-hook-form** + `@hookform/resolvers/zod`
- **Zustand** (com `persist`) para estado global
- **QueryClient** local e hooks de consulta para data fetching
- **Biome** para lint + format (não use ESLint/Prettier)
- **Vitest** + Testing Library
- **SCSS Modules** (`*.module.scss`) para estilos por componente
- Componentes locais em `src/components/UI` como base visual

## Comandos

```sh
npm run dev          # next dev --turbopack
npm run build        # next build
npm run lint         # biome lint ./src (sem alterar arquivos)
npm run lint:fix     # biome lint --write ./src
npm run format       # biome format --write ./src
npm run format:check # biome format ./src
npm run check:imports # valida resolução dos imports locais
npm run check:empty  # valida ausência de arquivos vazios
npm run check:names  # valida nomes e extensões em src/
npm run type-check   # tsc --noEmit
npm run test         # vitest
npm run test:watch   # vitest --watch
```

**Antes de finalizar qualquer alteração:** rode `npm run type-check` e `npm run lint`.

## Estrutura de alto nível

```bash
src/
├── app/             ← rotas Next (App Router), pages, layouts, error boundaries.
├── components/
│   ├── Core/        ← componentes de orquestração (containers com lógica)
│   ├── Elements/    ← componentes de elemento de jornada (1:1 com schema)
│   └── UI/          ← componentes de apresentação pura (sem regra de negócio)
├── features/        ← código vertical por feature (ex.: fcdc)
├── hooks/           ← hooks reutilizáveis cross-feature
├── lib/             ← infra (axios, query client, auth)
├── scripts/         ← integrações third-party client-side (GTM, VWO, etc.)
├── services/        ← chamadas server-side ('use server'); ver AGENTS.md local
├── store/           ← Zustand stores globais
├── utils/           ← funções puras reutilizáveis
└── validation/      ← schemas Zod da jornada + form schema builder
```

## Convenções universais

### Imports

- **Sempre** use o alias `@/...` para imports cross-folder. Nunca `../../../`.
- Imports relativos `./xxx` só dentro da mesma pasta.
- Importe pelo **barrel** da pasta (`@/utils`, `@/components/UI`) em vez de caminho profundo.
- Ordem (Biome organiza automaticamente): externos → `@/...` → relativos.

### Nomes

- Arquivos de componente React: `PascalCase` (ou `index.tsx` dentro de pasta `PascalCase/`).
- Hooks: `useNomeDoHook.ts` em camelCase.
- Funções e variáveis: camelCase.
- Tipos e componentes: PascalCase.
- Schemas Zod: `<nome>.schema.ts` (apenas em `src/validation/schemas/`).
- Constantes globais: `SCREAMING_SNAKE_CASE`.
- Mensagens de UI e erro em **português** (padrão do projeto).

### Componentes

- Server Component por padrão. Use `"use client"` **apenas** quando precisar de hook React, evento DOM, ou store cliente.
- Server actions e código `next-runtime-env` ficam em arquivos com `"use server"` no topo.
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

| Tarefa                                         | AGENTS.md a consultar                                                                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Adicionar/editar elemento da jornada           | [src/components/Elements/AGENTS.md](src/components/Elements/AGENTS.md) e [src/validation/AGENTS.md](src/validation/AGENTS.md) |
| Mexer em container/orquestrador (form, render) | [src/components/Core/AGENTS.md](src/components/Core/AGENTS.md)                                                                |
| Criar componente visual reutilizável           | [src/components/UI/AGENTS.md](src/components/UI/AGENTS.md)                                                                    |
| Chamar backend (API)                           | [src/services/AGENTS.md](src/services/AGENTS.md)                                                                              |
| Criar/editar validação ou schema               | [src/validation/AGENTS.md](src/validation/AGENTS.md)                                                                          |
| Criar função util / máscara                    | [src/utils/AGENTS.md](src/utils/AGENTS.md)                                                                                    |
| Estado global (Zustand)                        | [src/store/AGENTS.md](src/store/AGENTS.md)                                                                                    |
| Hook customizado                               | [src/hooks/AGENTS.md](src/hooks/AGENTS.md)                                                                                    |
| Código de feature isolada                      | [src/features/AGENTS.md](src/features/AGENTS.md)                                                                              |

## Disciplina

- Não adicione features, refatorações ou "melhorias" além do que foi pedido.
- Não crie helpers/abstrações para uso único.
- Não valide cenários impossíveis — só nas bordas do sistema.
- Não crie markdowns de documentação sem ser pedido.
