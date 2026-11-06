# AGENTS.md — `src/components/Core`

Componentes **container**: orquestram fluxo da jornada, formulário, prefetch, navegação, render dinâmico.

## O que vai aqui (vs. `Elements/` e `UI/`)

| Categoria | Característica |
|---|---|
| **`Core/`** (aqui) | Container com lógica/estado. Conhece store, services, navegação. Pode ter controller (`useXxxController`). |
| `Elements/` | Componente 1:1 com tipo de elemento da jornada. Sem fetch, sem store global. |
| `UI/` | Componente puramente apresentacional. Sem domínio, sem store. |

## Padrão Controller

Containers grandes seguem o padrão **componente + controller hook**:

```
JourneyBuilder/
├── index.tsx                          ← JSX, gates de loading/error, renderiza JourneyStepForm
├── useJourneyBuilderController.ts     ← estado do journey, prefetch, navegação
├── useJourneyPrefetch.ts              ← prefetch journey-level (parameters)
├── usePrefetch.ts                     ← query base de prefetch
├── JourneyWrapper/                    ← header/progress/back
├── StepSkeleton/                      ← loading placeholder do prefetch
└── StepError/                         ← estado de erro do prefetch

JourneyStepForm/
├── index.tsx                          ← form + render de elementos
├── useJourneyStepFormController.ts    ← coordenação de submit, erro e navegação
├── useStepFormState.ts               ← formulário, hidratação e prefill
├── validateStepDataQuality.ts        ← validações de contatos
└── executeStepServices.ts            ← sessão, payloads e sequência de serviços
```

Regras:
- `index.tsx` é fino: chama o controller, monta provider, renderiza filhos.
- Toda lógica complexa (efeitos, callbacks memoizados, leitura/escrita de store, navegação) fica no `useXxxController.ts`.
- Sub-hooks adicionais (`useXxxPrefetch`, `usePrefetch`) ficam **na mesma pasta** se forem usados só por aquele container.
- Sub-componentes específicos (`StepError`, `StepSkeleton`) ficam em sub-pasta dentro do container.

## Context Providers

Quando um Core precisa expor API para descendentes (ex.: `useJourneyStepForm`), use o padrão:

```ts
const Ctx = createContext<ContextValue | null>(null)

export function useJourneyStepForm() {
  const context = useContext(Ctx)
  if (!context) throw new Error('useJourneyStepForm must be used within a JourneyStepFormProvider')
  return context
}
```

Mantenha o `Provider` no mesmo `index.tsx` do container que cria o contexto.

## Server vs Client

- Cores que tocam store/form/efeitos: `'use client'` no topo.
- Cores que só montam markup (ex.: `Header` puramente layout): podem ficar server.
- Páginas (em `src/app/`) consomem o Core como server component quando possível; o `'use client'` é "empurrado" para dentro.

## Render dinâmico de elementos

[JourneyRenderElements/index.tsx](JourneyRenderElements/index.tsx) é o **único lugar** que mapeia `type` da jornada → componente. Ao adicionar um novo Element:

1. Importar de `@/components/Elements`.
2. Adicionar entrada no objeto `renderers` (chave = `type` do schema).

Se faltar, cai no `UnregisteredComponent` (não silenciar).

## Barrel

Cada Core é exportado por nome em [src/components/Core/index.ts](index.ts). Adicione novos sempre lá.

## Anti-padrões

- ❌ Lógica de fetch/store dentro do `index.tsx` quando existe controller — mova para o hook.
- ❌ Importar `Elements/` direto dentro de outro `Elements/` — só `Core/` pode compor `Elements/`.
- ❌ Criar Provider fora do container que o consome.
- ❌ Duplicar o mapa de renderers — `JourneyRenderElements` é a fonte única.

## Testes e preservação dos contratos

Specs deste escopo ficam em `test/src/components/Core/`, fora de src, com sufixo `.spec`. Consultar o AGENTS da raiz e `test/AGENTS.md`; não criar setup, fixtures ou declarações de testes nesta pasta. Preservar os contratos da versão de produção e corrigir imports/casing ao mover arquivos. Não substituir dependências corporativas para declarar aprovação; registrar limites da validação.

Manter os contratos nativos ao refatorar: sessão antes das chamadas, sequência por índice, payload explícito vazio, estado atualizado entre serviços, tratamento de erro e ações de sucesso. Regredir esses caminhos com formulário/TanStack reais e mocks explícitos de fronteiras. Eventos de analytics podem falhar sem bloquear a jornada, mas não devem usar catch vazio nem registrar dados pessoais.
