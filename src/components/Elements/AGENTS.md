# AGENTS.md — `src/components/Elements`

Componentes que renderizam um **tipo de elemento da jornada** (1:1 com o `discriminatedUnion` de `validation/schemas`).

## Estrutura de cada Element

Padrão de uma pasta `XxxElement/`:

```
XxxElement/
├── index.tsx                ← componente, default export NÃO; named export
├── types.ts                 ← Props derivados do JourneyDefinition
├── XxxElement.module.scss   ← ou styles.module.scss (ambos aceitos)
└── index.spec.tsx           ← opcional; coloque quando houver lógica não-trivial
```

## Convenções

### `index.tsx`
- Começa com `'use client'` (todos os Elements usam `react-hook-form` via `useFormContext`).
- Export **named**: `export function XxxElement(...)`. Nunca `export default`.
- Recebe `{ element }: XxxElementProps` — não desestruture o `element.config` na assinatura, faça dentro do corpo.
- Use `Controller` ou `useFormContext` do `react-hook-form` para campos controlados.
- Sem chamadas de API, sem `useEffect` de fetch. Side-effects vêm do `Core` ou de hooks dedicados.

### `types.ts`
Padrão obrigatório — sempre derive o tipo do schema da jornada:

```ts
import type { JourneyDefinition } from '@/validation/schemas'

type XxxElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'XXX' }
>

export type XxxElementProps = {
  element: XxxElementType
}
```

**Não duplique** o shape do `config`. Se precisar dele em vários lugares, exporte um alias derivado.

### SCSS
- Use `*.module.scss` (CSS Modules). Importe como `import styles from './X.module.scss'`.
- Classes em camelCase para casar com o tipo gerado por `@types/scss.d.ts`.

## Como adicionar um novo Element

Sequência completa quando o JSON da jornada ganha um novo `type`:

1. **Schema da definição** — crie `src/validation/schemas/elements/<nome>.schema.ts` e adicione ao `discriminatedUnion` em `journeyElement.schema.ts`. Ver [src/validation/AGENTS.md](../../validation/AGENTS.md).
2. **Schema do form** — adicione handler em `src/validation/form/elementRegistry.ts` (ou em `form/registry/` se for complexo).
3. **Componente** — crie `src/components/Elements/XxxElement/` seguindo o padrão acima.
4. **Barrel** — adicione `export { XxxElement } from './XxxElement'` em [src/components/Elements/index.ts](index.ts).
5. **Registro do renderer** — adicione a entrada no `renderers` de [src/components/Core/JourneyRenderElements/index.tsx](../Core/JourneyRenderElements/index.tsx).

> Todos os 5 passos são necessários. Sem (1)+(2) o Zod não aceita o JSON; sem (4)+(5) o `JourneyStepForm` não consegue renderizar.

## Anti-padrões

- ❌ Importar de `@/store/...` diretamente no Element. Estado vem via form/props ou de um hook dedicado.
- ❌ Definir o tipo do `config` manualmente em vez de derivar de `JourneyDefinition`.
- ❌ Adicionar `useEffect` para fazer fetch — use `useJourneyService`, `@tanstack/react-query`, ou suba para o `Core`.
- ❌ Lógica de máscara duplicada — use `@/utils/mask/*`.
- ❌ Mensagens de erro/labels hardcoded em inglês.
