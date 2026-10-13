# AGENTS.md — `src/services`

Camada de comunicação com backend. **Server-side por padrão** (`'use server'` no topo).

## Estrutura

```bash
services/
├── index.ts                    ← barrel: re-exporta callService
├── serviceRegistry.ts          ← ponto de entrada único ('use server')
├── types.ts                    ← ServiceResult<T> compartilhado
├── apiService/                 ← chamada genérica autenticada (HTTP)
│   ├── index.ts                ← callApi
│   └── types.ts                ← ApiServiceInput
├── EntryCalculationService/
├── initService/
└── ipService/
```

## Padrão de um service

Todo service segue o contrato:

```ts
'use server'

import type { ServiceResult } from '../types'

export async function nomeDoService(
  input: NomeDoServiceInput,
  recaptchaToken: string // quando aplicável
): Promise<ServiceResult<TData>> {
  try {
    // ...
    return { success: true, data }
  } catch (error) {
    return { success: false, error: 'mensagem' }
  }
}
```

Regras:

- **Sempre** retorne `ServiceResult` — nunca lance erro para fora. O caller usa a flag `success`.
- **Sempre** use `'use server'` no topo. Se precisar de código client-side, não é um service.
- Use `authorizedApi` de `@/lib/axios/axiosInstance` (já tem auth + retry).
- Pegue env com `next-runtime-env` → `env()` — **não** com `process.env` direto.
- Passe `traceId` e metadata (`sessionId`, `ipAddress`, `userAgent`) quando o backend exigir — use `getTraceId()` de `@/utils`.

## Sanitização de input

A camada de service **não** sanitiza mais o payload. Cada elemento de formulário é responsável por armazenar o valor já limpo (dígitos, alfanumérico, ISO date, etc.) enquanto exibe a versão formatada para o usuário — veja os elementos em `src/components/Elements`. O `serviceConfig` recebe `input.fields` como estão no form e envia direto ao backend.

## Recaptcha

Services chamados pelo client passam pelo hook `useJourneyService` (`src/hooks/useJourneyService.ts`) que gera o token e injeta. Dentro do service, repasse para o header `X-Recaptcha-Token` + `X-Recaptcha-Action`.

## serviceRegistry e callService

`serviceRegistry.ts` é o ponto único exportado por `index.ts`. Hoje só roteia para `callApi`. Se surgir um novo tipo de backend (ex.: GraphQL, gRPC), adicione a estratégia aqui — não exponha `callApi` direto.

## Como adicionar um novo service

1. Crie pasta `services/nomeService/` com `index.ts` (`'use server'`) e `types.ts`.
2. Exporte do barrel `services/index.ts` se for de uso externo.
3. Se for um serviço HTTP padrão, prefira **expandir `apiService`** em vez de duplicar lógica.
4. Lado cliente: consuma via `useJourneyService` (hook) — não chame o service diretamente do componente.

## Anti-padrões

- ❌ Lançar exceções ao invés de retornar `{ success: false, error }`.
- ❌ Usar `process.env` direto. Sempre `env()` do `next-runtime-env`.
- ❌ Importar `axios` cru — use `authorizedApi` de `@/lib/axios`.
- ❌ Misturar lógica de UI/React aqui.
- ❌ Concatenar URL sem `env('NEXT_PUBLIC_SENSEDIA_CLOUD_URL')` + path.
