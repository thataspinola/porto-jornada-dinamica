# AGENTS.md — `src/features`

Código **vertical por feature**: tudo que é específico de uma jornada/produto vive aqui, isolado do resto.

## Quando usar `features/`

Crie uma feature quando o código:
- É específico de **uma jornada/produto** (ex.: FCDC, financiamento, seguro).
- Tem hooks/serviços/componentes que **não fazem sentido** em outras jornadas.
- Pode evoluir/sumir sem afetar as demais.

Se o código serve a múltiplas jornadas, ele pertence a `components/`, `hooks/`, `services/` ou `utils/` no nível raiz.

## Estrutura sugerida por feature

```
features/<feature>/
├── components/           ← componentes específicos da feature
├── hooks/
│   ├── queries/          ← hooks com useQuery/useMutation
│   └── useXxx.ts         ← hooks comuns da feature
├── services/             ← (opcional) services específicos
├── utils/                ← (opcional) utils específicos
└── types.ts              ← (opcional) tipos compartilhados na feature
```

Não crie pastas vazias por antecipação. Comece pelo que você precisa hoje.

## Queries TanStack

Hooks de query/mutation ficam em `<feature>/hooks/queries/`:

```ts
// features/fcdc/hooks/queries/useInstallments.ts
import { useQuery } from '@tanstack/react-query'

export function useInstallments() {
  return useQuery({
    queryKey: ['fcdc-installments'],
    queryFn: async () => { /* ... */ }
  })
}
```

Convenções:
- `queryKey` começa com o nome da feature (`['fcdc-...']`).
- Helpers de transformação (ex.: `transformInstallmentValueIntoCurrency`) podem ser exportados do mesmo arquivo se forem usados junto.
- Para mutations, use `useMutation` e devolva o `mutation` inteiro (não desestruture demais).

## Isolamento

Regras de dependência:

| De → Para | Permitido? |
|---|---|
| `features/<X>` → `@/components/UI`, `@/utils`, `@/lib`, `@/validation`, `@/hooks`, `@/store`, `@/services` | ✅ |
| `features/<X>` → `features/<Y>` (outra feature) | ❌ |
| `@/components/Core` ou `@/components/Elements` → `features/<X>` | ❌ (Core/Elements são compartilhados) |
| `src/app/<rota-da-feature>` → `features/<X>` | ✅ |

Se duas features precisam compartilhar código, **promova para o nível raiz** (`@/utils`, `@/hooks`, etc.), não cruze entre features.

## Anti-padrões

- ❌ Importar de outra feature.
- ❌ Colocar código genérico em `features/` para "não poluir" o raiz.
- ❌ Duplicar a query no app inteiro — se for transversal, vire hook em `@/hooks/`.
- ❌ Misturar `'use server'` e `'use client'` no mesmo arquivo.

## Testes e preservação dos contratos

Specs deste escopo ficam em `test/src/features/`, fora de src, com sufixo `.spec`. Consultar o AGENTS da raiz e `test/AGENTS.md`; não criar setup, fixtures ou declarações de testes nesta pasta. Preservar os contratos da versão de produção e corrigir imports/casing ao mover arquivos. Não substituir dependências corporativas para declarar aprovação; registrar limites da validação.
