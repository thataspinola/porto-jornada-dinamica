# AGENTS.md — `src/components/UI`

Componentes **puramente apresentacionais**, sem regra de negócio nem conhecimento da jornada.

## Regra de ouro

Se o componente importa de `@/store`, `@/services`, `@/validation`, `@/hooks` (cross-feature) ou conhece `JourneyDefinition`, **ele não pertence a `UI/`**. Mova para `Core/` ou `Elements/`.

## Estrutura

```
UI/
├── index.ts                ← barrel
├── Button/
│   └── Button.tsx          ← arquivo nomeado OU index.tsx (não padronizado)
├── Input/
│   └── index.tsx
├── Loader/
│   ├── index.tsx
│   ├── styles.scss         ← também aceito .scss puro aqui
│   └── types.ts
└── ProgressBar/
    ├── index.tsx
    └── types.ts
```

## Convenções

- Named exports (`export function Button(...)`).
- Props tipadas inline ou em `types.ts` na pasta — sem importar tipos de domínio.
- Sem `'use client'` a menos que precise de hook/evento DOM.
- Estilos via `*.module.scss` preferencialmente; `.scss` puro só quando estiver replicando estilo global de um pacote do design system.
- Quando possível, encapsule componentes do `@porto-stack/ui` aqui em vez de espalhar pelo projeto.

## Quando criar um UI novo

Pergunte-se:
1. Esse componente é genérico o suficiente para ser usado fora desta tela?
2. Ele funciona com qualquer dado, sem assumir shape da jornada?
3. Não tem side-effect, store, ou fetch?

Se "sim" para os três → `UI/`. Caso contrário → `Core/` (com lógica) ou `Elements/` (1:1 com elemento da jornada).

## Barrel

Adicione novos componentes em [src/components/UI/index.ts](index.ts) com export nomeado.

## Anti-padrões

- ❌ Importar `useJourneyStore`, `callService`, ou qualquer coisa de `@/validation`.
- ❌ Hardcode de textos específicos de uma jornada (use props).
- ❌ Lógica condicional baseada em `type` de elemento.
- ❌ `useEffect` para data fetching.

## Testes e preservação dos contratos

Specs deste escopo ficam em `test/src/components/UI/`, fora de src, com sufixo `.spec`. Consultar o AGENTS da raiz e `test/AGENTS.md`; não criar setup, fixtures ou declarações de testes nesta pasta. Preservar os contratos da versão de produção e corrigir imports/casing ao mover arquivos. Não substituir dependências corporativas para declarar aprovação; registrar limites da validação.
