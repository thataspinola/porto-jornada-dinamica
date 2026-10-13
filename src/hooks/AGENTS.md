# AGENTS.md — `src/hooks`

Hooks React **reutilizáveis cross-feature**.

## O que vai aqui

- Hooks usados por mais de uma feature/container.
- Adaptadores entre store + service + recaptcha (ex.: `useJourneyService`).
- Wrappers de bibliotecas externas com configuração do projeto.

## O que NÃO vai aqui

- Hooks usados por **um único** container → colocar **na pasta do container** (ex.: `Core/JourneyStepForm/useJourneyStepFormController.ts`).
- Hooks específicos de uma feature → `src/features/<feature>/hooks/`.
- Queries TanStack específicas de feature → `src/features/<feature>/hooks/queries/`.

## Convenções

- Nome: `useXxx.ts` (camelCase). Export nomeado.
- Sempre `'use client'` no topo.
- Tipos de input/output exportados quando úteis externamente (`export type JourneyServiceInput = ...`).
- Use `useCallback`/`useMemo` quando o hook retorna funções/objetos para consumo em deps de outros hooks.
- Para ler store, use `useShallow` para evitar re-renders desnecessários.

## Padrão

```ts
'use client'

import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

import { callService } from '@/services'
import { useJourneyStore } from '@/store/journeyStore'

export type UseXxxInput = {
  /* ... */
}

export function useXxx() {
  const slice = useJourneyStore(useShallow((s) => ({ a: s.a, b: s.b })))

  const action = useCallback(
    async (input: UseXxxInput) => {
      // composição: store + service + utils
    },
    [slice]
  )

  return { action /* state derivado */ }
}
```

## Quando promover um hook para `src/hooks/`

Mova de container/feature para cá **somente quando**:

- Mais de uma feature precisa dele, **e**
- Ele não carrega lógica específica de uma feature, **e**
- A API é estável.

Até lá, mantenha colocalizado.

## Anti-padrões

- ❌ Hook com `'use server'` — hook é por definição client-side.
- ❌ Misturar várias responsabilidades em um único hook (fetch + form + navigation). Separe.
- ❌ Esquecer `useCallback` em funções retornadas que entram em deps.
- ❌ Acessar store sem `useShallow` quando retorna múltiplos campos.
