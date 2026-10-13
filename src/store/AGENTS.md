# AGENTS.md — `src/store`

Stores **Zustand** globais. Uma store por arquivo, escopo bem definido.

## Stores existentes

| Store                                    | Responsabilidade                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [journeyStore.ts](journeyStore.ts)       | Estado da jornada do usuário: `fields`, `error`, `business`, `services`, `parameters`. Persistido. |
| [navigationStore.ts](navigationStore.ts) | Estado de navegação entre steps.                                                                   |

## Padrão de uma store

```ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type XxxState = {
  // shape do estado
  field: T
  // ações (sempre dentro do State, não em hooks separados)
  setField: (v: T) => void
  mergeField: (partial: Partial<T>) => void
  reset: () => void
}

export const useXxxStore = create<XxxState>()(
  persist(
    (set) => ({
      field: initial,
      setField: (v) => set({ field: v }),
      mergeField: (partial) =>
        set((state) => ({
          field: { ...state.field, ...partial },
        })),
      reset: () => set({ field: initial }),
    }),
    {
      name: 'xxx-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
```

## Convenções

- Hook nomeado `useXxxStore` (camelCase + sufixo `Store`).
- Ações **dentro** do state, não exportadas separadamente.
- Use o seletor com `useShallow` para evitar re-renders:

```ts
const { fields, mergeFields } = useXxxStore(
  useShallow((s) => ({
    fields: s.fields,
    mergeFields: s.mergeFields,
  }))
)
```

- Sempre tipar o State como `type` (não `interface`).
- Para hidratação no SSR, exponha `_hasHydrated: boolean` + `setHasHydrated` (ver `journeyStore`).

## Persistência

- Use `persist` + `createJSONStorage(() => sessionStorage)` para dados de jornada (não devem sobreviver entre abas).
- Use `localStorage` apenas quando o requisito for explicitamente cross-session.
- `name` da store: prefixo curto e único (`jornada-dinamica:journey`).

## Quando criar uma store nova

Antes de criar:

1. Pode ser estado local de componente? Use `useState`.
2. Pode ser server state (vem de API)? Use **TanStack Query**, não Zustand.
3. Pode caber em uma store existente? Adicione lá.
4. Só crie nova store se for um novo **domínio** transversal.

## Anti-padrões

- ❌ Múltiplas stores para o mesmo domínio.
- ❌ Cachear resposta de API em Zustand (use TanStack Query).
- ❌ Ler `localStorage` / `sessionStorage` direto fora do middleware `persist`.
- ❌ Exportar ações fora do `create` (quebra o padrão e o tree-shaking).
- ❌ Usar `set` sem o callback quando depende do estado anterior — sempre `set((state) => ...)`.
- ❌ Importar de `@/components` ou `@/services` aqui.
