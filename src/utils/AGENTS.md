# AGENTS.md — `src/utils`

Funções **puras, sem dependências de React, sem side-effects globais**. Reutilizáveis em qualquer camada (server, client, services, components).

## Estrutura

Padrão: **uma pasta por util, com `index.ts` (implementação) e `index.spec.ts` (teste)**.

```bash
utils/
├── index.ts                    ← barrel raiz (re-exporta tudo)
├── <util>/
│   ├── index.ts                ← implementação
│   └── index.spec.ts           ← teste (obrigatório quando util tem ramos lógicos)
└── mask/                       ← exceção: agrupa máscaras correlatas
    ├── birthDate/
    ├── cep/
    ├── cnpj/
    ├── cpf/
    ├── phone/
    ├── plate/
    ├── onlyLetters.ts
    └── onlyNumbers.ts
```

## Convenções

- **Função pura**: mesmas entradas → mesma saída, sem mutar args, sem I/O.
- **Named exports** com o mesmo nome do arquivo/pasta: `cepMask`, `getByPath`.
- Sem `"use client"` / `"use server"` — utils rodam dos dois lados.
- Sem importar de `@/components`, `@/store`, `@/hooks`, `@/services`. Utils estão na camada mais baixa.
- Pode importar de outras `utils/` (use caminho relativo `./outraUtil`).
- Pode importar tipos de `@/validation/schemas` (apenas tipos, nunca runtime).

## Máscaras (`mask/*`)

Cada máscara recebe `string` e devolve `string` formatada. Exemplo:

```ts
// utils/mask/cpf/index.ts
export const cpfMask = (value: string): string => {
  /* ... */
}
```

Quando criar uma máscara nova:

1. `utils/mask/<nome>/index.ts` + `index.spec.ts`.
2. Adicione no barrel raiz `utils/index.ts`: `export { xxxMask } from './mask/<nome>'`.
3. Use no `Element` correspondente via `import { xxxMask } from '@/utils'`.

## Sanitize

`utils/sanitize` (`sanitize`) expõe um objeto `sanitize` com utilitários puros (`digits`, `text`, `email`, `alphanumeric`, `pureAscii`, `dom`, `isoDate`, `currencyToNumber`). Use direto no callsite (elementos de form, hooks de data quality, etc.) para limpar strings antes de armazenar/comparar.

## Testes

- Cobertura esperada: ramos lógicos + edge cases (input vazio, formato inválido, limites).
- Use `describe('<utilName>', ...)` e `it('should ...', ...)`.
- Veja exemplos em `utils/mask/cpf/index.spec.ts`.

## Barrel

Toda função exportada do utils precisa estar em [utils/index.ts](index.ts) — assim os imports ficam `import { x, y, z } from '@/utils'`.

## Anti-padrões

- ❌ Hooks React (`useXxx`) aqui — vão para `@/hooks/` ou para o controller do container.
- ❌ Acesso a `window`/`document` sem guarda. Se o util é client-only, repense se ele é mesmo um util.
- ❌ Importar de `@/services`, `@/store`, `@/components`.
- ❌ Funções com side-effects (fetch, localStorage, mutação global).
- ❌ Criar nova pasta de util só para uma função de uma linha — coloque inline no callsite.
