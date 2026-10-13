# Conditions em `SERVICE_CALL` e `NAVIGATION`

Guia da config opcional `conditions`, que permite **bloquear uma chamada de serviço ou navegação** se uma regra (estilo _query_) for satisfeita, exibindo erro, foco em campo ou redirecionando o usuário.

> ⚠️ **Quando NÃO usar:** se a regra de negócio pode morar na API do produto, prefira lá. `conditions` é saía para regras que precisam ser aplicadas no front porque o backend não as cobre.

---

## Sumário

- [Conditions em `SERVICE_CALL` e `NAVIGATION`](#conditions-em-service_call-e-navigation)
  - [Sumário](#sumário)
  - [Quando usar](#quando-usar)
  - [Onde a regra é avaliada](#onde-a-regra-é-avaliada)
  - [Anatomia de uma `condition`](#anatomia-de-uma-condition)
  - [Operadores disponíveis](#operadores-disponíveis)
  - [Fontes de dados (`from`)](#fontes-de-dados-from)
  - [Ações disponíveis (`action`)](#ações-disponíveis-action)
    - [`notify`- popup de erro](#notify--popup-de-erro)
      - [`actionButton.onClickAction` - disparar uma ção no clique](#actionbuttononclickaction---disparar-uma-ção-no-clique)
    - [`fieldError` - destaca um campo do form](#fielderror---destaca-um-campo-do-form)
    - [`redirect` - navega para outro lugar](#redirect---navega-para-outro-lugar)
  - [Interpolação de mensagens (`{{path}}`)](#interpolação-de-mensagens-path)
  - [Lógica AND, OR e NOT](#lógica-and-or-e-not)
    - [AND (dentro de um regra)](#and-dentro-de-um-regra)
    - [OR (entre regras)](#or-entre-regras)
    - [NOT (negação)](#not-negação)
    - [AND + OR combinados](#and--or-combinados)
  - [Exemplos completos](#exemplos-completos)
    - [1. Bloquear avanço se seguro está ativo e idade excede o limite do prefetch](#1-bloquear-avanço-se-seguro-está-ativo-e-idade-excede-o-limite-do-prefetch)
    - [2. Não chamar a API se CEP está fora da área de cobertura, destacando o campo](#2-não-chamar-a-api-se-cep-está-fora-da-área-de-cobertura-destacando-o-campo)
    - [3. Redirecionar para página de "não elegível" quando score é baixo](#3-redirecionar-para-página-de-não-elegível-quando-score-é-baixo)
    - [4. OR - múltiplas faixas de idade inválidas, cada uma com mensagem própria](#4-or---múltiplas-faixas-de-idade-inválidas-cada-uma-com-mensagem-própria)
    - [5. AND + OR combinados - `(seguro AND idade > 65) OR (renda < 1500)`](#5-and--or-combinados---seguro-and-idade--65-or-renda--1500)
    - [6. `EXISTS` - exigir campo opcional preenchido antes de prosseguir](#6-exists---exigir-campo-opcional-preenchido-antes-de-prosseguir)
  - [Boas práticas](#boas-práticas)
  - [Limitações](#limitações)
  - [Arquivos de referência](#arquivos-de-referência)

---

## Quando usar

A config `conditions`cabe quando você precisa **gatear uma transição** (chamada de serviço ou mudança de step) com base em dados que já estão no estado da jornada:

- Valores que o usuário preencheu (`fields`)
- Dados de prefetch (`parameters`)
- Resultados de `SERVICE_CALL` anteriores (`services`)
- Metadata da jornada (`business`)

**Exemplo real:** o produto Financiamento de Veículos retorna um `maximumClientAgeForInsurance` no prefetch. Se o usuário ativou o financiamento protegido e tem idade acima desse limite, o front precisa bloquear o avanço com uma mensagem clara - sem chamar o backend.

---

## Onde a regra é avaliada

| Elemento                           | Quando o guard roda                                                                                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SERVICE_CALL`                     | Após validação do form e `commitFields()`, **antes** de `callServiceMutation`. Se uma regra casa, a chamada não é feita e a navegação para `targetStepOnSuccess` é abortada. |
| `NAVIGATION` com `validate: true`  | Após validação do form e `commitFields()`, **antes** de `navigateTo`.                                                                                                        |
| `NAVIGATION` com `validate: false` | Após sincronizar `getValues()`no store, **antes** de `navigateTo`.                                                                                                           |

Em todos os casos, se nenhuma regra casa, o fluxo segue normalmente.

---

## Anatomia de uma `condition`

```jsonc
"conditions": [
  {
    "id": "max-age-insurance", // opcional, útil para logs/debugs
    "checks": [ // array de checks combinados por AND
      {
        "left": { "from": "fields", "path": "has_protected_financing" },
        "op": "EQUAL",
        "right": { "value": true}
      },
      {
        "left": { "from": "fields", "path": "age" },
        "op": "GREATER_THAN",
        "right": { "from": "parameters", "path": "maximumClientAgeForInsurance" }
      }
    ],
    "action": { // o que fazer se a regra casar
      "kind": "notify",
      "title": "Idade não permitida para o financiamento protegido",
      "description": "A idade deve ser até {{parameters.maximumClientAgeForInsurance}} anos."
    }
  }
]
```

- `conditions` é uma **lista de regras**. As regras são avaliadas em order; **a primeira a casar vence** e dispara sua `action`. As demais são ignoradas.
- Dentro de uma regra, `checks` é uma **lista de comparações combinadas por AND**. Todos os checks precisam ser verdadeiros para a regra casar.
- `left` e `right` são **operandos**: ou uma referência (`{ from, path }`) ou um valor literal (`{ value }`).
- `op` é o operador (ver [tabela abaixo](#operadores-disponíveis)).
- `action` é o que acontece quando a regra casa (ver [ações disponíveis](#ações-disponíveis-action)).

---

## Operadores disponíveis

| Operador                | Descrição                                                                                 | Coerção                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `EQUAL`                 | Igualdade frouxa.                                                                         | Tenta numérica primeiro; senão compara como string.   |
| `NOT_EQUAL`             | Inverso de `EQUAL`.                                                                       | Idem.                                                 |
| `GREATER_THAN`          | `left > right`.                                                                           | Numérica (retorna `false` se algum lado não parseia.) |
| `GREATER_THAN_OR_EQUAL` | `left >= right`.                                                                          | Numérica.                                             |
| `LESS_THAN`             | `left < right`.                                                                           | Numérica.                                             |
| `LESS_THAN_OR_EQUAL`    | `left <= right`.                                                                          | Numérica.                                             |
| `INCLUDES`              | `String(left).includes(String(right))`. Útil para substring em texto.                     | Cast para string.                                     |
| `EXISTS`                | `left` está preenchido (não-null, não-string-vazia, array não-vazio). `right` é ignorado. | Sem coerção.                                          |
| `NOT_EXISTS`            | Inverso de `EXISTS`.                                                                      | Sem coerção.                                          |

**Notas sobre coerção:**

- `"30" EQUAL 30` → `true`
- `"abc" GREATER_THAN 10` → `false` (não dá para comparar como número)
- `0 EQUAL false` → `false`(sem coerção entre tipos diferentes, só número-string)

---

## Fontes de dados (`from`)

| Fonte         | Conteúdo                                                     | Origem                                                                                          |
| ------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `fields`      | Valores do formulários (após `commitFields()` ou auto-sync). | O que o usuário preencheu - inclusive `age` derivado automaticamente por `useBirthDateAgeSync`. |
| `paramenters` | Dados do prefetch do step (achatados).                       | Resultado de `prefetch` do step (ex.: `maximumClientAgeForInsurance`).                          |
| `services`    | Resultados de `SERVICE_CALL` anteriores.                     | Indexado pelo nome do serviço. Ex.: `services.elegibility.data.creditScore`.                    |
| `business`    | Metadata (`sessionId`, `ipAddress`, `userAgent`).            | Setado no boot da jornada.                                                                      |

`path` aceita **acesso aninhado por ponto**: `data.input.fields.foo`, `elegibility.data.creditScore`, etc. (implementado por `getByPath`).

---

## Ações disponíveis (`action`)

### `notify`- popup de erro

Usa o `notify()` do design system (`@porto-stack/ui/utils`).

```jsonc
"action" : {
  "kind": "notify",
  "title": "Título do popup",
  "description": "Descrição. Pode ter placeholders {{parameters.maxAge}}",
  "actionButton": { "children": "Tentar novamente" } // opcional
}
```

#### `actionButton.onClickAction` - disparar uma ção no clique

O `actionButton` aceita um `onClickAction` opcional, que descreve **de forma declarativa** o que acontece quando o usuário clica no botão do popup. Hoje o único `kind` suportado é `redirect` (mesma gramática de URL sdo `action.redirect`: `https://` → externo, `/` → home, caminho absoluto mantém, slug relativo resolve sob o prefixo da jornada atual).

```jsonc
"actionButton": {
  "children": "Refazer simulação",
  "onClickAction": {
    "kind": "redirect",
    "url": "/financiamento-de-veiculos/simulacao"
  }
}
```

> O popup fecha automaticamente ao clique (comportamento nativo do `Notifier`) e em seguida a ação é aplicada. Para URLs internas, a navegação é client-side via `router.push`; para externas, `window.location.assign`.

### `fieldError` - destaca um campo do form

Usa `setError` do react-hook-form. Se `focus: true`, também foca no campo.

```jsonc
"action": {
  "kind": "fieldError",
  "field": "date_of_birth",
  "message": "Idade incompatível com o produto.",
  "focus": true
}
```

> Se não houver form context (cenário raro em `NAVIGATION` solto), faz fallback para `notify`.

### `redirect` - navega para outro lugar

Segue as mesmas regras de URL do `NAVIGATION`:

- Começa com `http(s)://` → `window.location.assign` (página externa)
- `"/"` → router para a home
- Slug relativo (ex.: `"nao-elegivel"`) → resolvido sob o prefixo da jornada atual

```jsonc
"action": {
  "kind": "redirect",
  "url": "/nao-elegivel"
}
```

---

## Interpolação de mensagens (`{{path}}`)

Os campos `title`, `description` (do `notify`) e `message` (do `fieldError`) suportam placeholders `{{path}}` que resolvem contra o contexto unificado `{ fields, parameters, services, business }`.

```jsonc
"description": "Limite máximo: {{parameters.maximumClientAgeForInsurance}} anos. Sua idade: {{fields.age}}."
```

Se o valor for ausente, o placeholder é mantido literal (`{{...}}`) para evitar mensagens quebradas - o usuário verá o token. Em produção, prefira garantir que o caminho exista.

---

## Lógica AND, OR e NOT

A linguagem é deliberadamente simples. Você compõe lógica por meio de:

### AND (dentro de um regra)

Coloque vários `checks` na mesma regra. **Todos** precisam ser verdadeiros.

```jsonc
{
  "checks": [
    {
      "left": { "from": "fields", "path": "insurance" },
      "op": "EQUAL",
      "right": { "value": true },
    },
    {
      "left": { "from": "fields", "path": "age" },
      "op": "GREATER_THAN",
      "right": { "value": 65 },
    },
  ],
}
```

### OR (entre regras)

Crie **uma regra por alternativa**. A primeira que casar vence. Útil quando cada ramo OR exibe uma mensagem diferente.

```jsonc
"conditions": [
  {
    "checks": [{ "left": { "from": "fields", "path": "age" }, "op": "LESS_THAN", "right": { "value": 18 } }],
    "action": { "kind": "notify", "title": "Menor de idade", "description": "..."}
  },
  {
    "checks": [{ "left": { "from": "fields", "path": "age" }, "op": "GREATER_THAN", "right": { "value": 80 } }],
    "action": { "kind": "notify", "title": "Idade acima do limite", "description": "..." }
  }
]
```

Se as duas alternativas precisam exibir a **mesma** mensagem, dá para duplicar a `action` ou - se você quer só uma "regra OR" - mover a lógica pro lado certo do operador (ex.: `LESS_THAN_OR_EQUAL` e `GRATER_THAN_OR_EQUAL` com `NOT_EQUAL` substituindo `EQUAL`, etc.). Como o objetivo é configuração, não código, repetir a `action` costuma ser mais legível.

### NOT (negação)

Use o operador inverso:

| Em vez de          | Use                     |
| ------------------ | ----------------------- |
| `NOT EQUAL`        | `NOT_EQUAL`             |
| `NOT EXISTIS`      | `NOT_EXISTS`            |
| `NOT GREATER_THAN` | `LESS_THAN_OR_EQUAL`    |
| `NOT LESS_THAN`    | `GREATER_THAN_OR_EQUAL` |

### AND + OR combinados

Cada regra é um AND. Múltiplas regras formam um OR. Para `(A AND B) OR (C AND D)`:

```jsonc
"conditions": [
  { "checks": [A,B], "action": { ... } },
  { "checks": [C,D], "action": { ... } }
]
```

---

## Exemplos completos

### 1. Bloquear avanço se seguro está ativo e idade excede o limite do prefetch

```jsonc
{
  "type": "NAVIGATION",
  "config": {
    "label": "Continuar",
    "url": "/cep",
    "validate": true,
    "conditions": [
      {
        "id": "age-exceeds-insurance-limit",
        "checks": [
          {
            "left": { "form": "fields", "path": "has_protected_financing" },
            "op": "EQUAL",
            "right": { "value": true },
          },
          {
            "left": { "from": "fields", "path": "age" },
            "op": "GREATER_THAN",
            "right": {
              "from": "parameters",
              "path": "maximumClientAgeForInsurance",
            },
          },
        ],
        "action": {
          "kind": "notify",
          "title": "Idade não permitida para o financiamento protegido",
          "description": "A idade deve ser de até {{parameters.maximumClientAgeForInsurance}} anos. Desative o financiamento protegido na etapa de simulação para continuar.",
          "actionButton": {
            "children": "Refazer simulação",
            "onClickButton": {
              "kind": "redirect",
              "url": "/financiamento-de-veiculos/simulacao",
            },
          },
        },
      },
    ],
  },
}
```

### 2. Não chamar a API se CEP está fora da área de cobertura, destacando o campo

```jsonc
{
  "type": "SERVICE_CALL",
  "config": {
    "label": "Simular",
    "headers": {
      "porto-product": "...",
      "porto-action": "...",
      "porto-module": "...",
    },
    "targetStepOnSuccess": "/resultado",
    "conditions": [
      {
        "checks": [
          {
            "left": { "from": "fields", "path": "addressZipCode" },
            "op": "INCLUDES",
            "right": { "value": "00000" },
          },
        ],
        "action": {
          "kind": "fieldError",
          "field": "addressZipCode",
          "message": "CEP fora da área de cobertura.",
          "focus": true,
        },
      },
    ],
  },
}
```

### 3. Redirecionar para página de "não elegível" quando score é baixo

```jsonc
{
  "type": "NAVIGATION",
  "config": {
    "label": "Continuar",
    "url": "/proposta",
    "validate": true,
    "conditions": [
      {
        "checks": [
          {
            "left": {
              "from": "services",
              "path": "eligibility.data.creditScore",
            },
            "op": "LESS_THAN",
            "right": { "value": 400 },
          },
        ],
        "action": {
          "kind": "redirect",
          "url": "/nao-elegivel",
        },
      },
    ],
  },
}
```

### 4. OR - múltiplas faixas de idade inválidas, cada uma com mensagem própria

```jsonc
"conditions": [
  {
    "id": "underage",
    "checks": [{ "left": { "from": "fields", "path": "age" }, "op": "LESS_THAN", "right": { "value": 18} }],
    "action": { "kind": "notify", "title": "Menor de idade", "description": "Você precisa ter pelo menos 18 anos." }
  },
  {
    "id": "over-limit",
    "checks": [{ "left": { "from": "fields", "path": "age" }, "op": "GREATER_THAN", "right": { "value": 80 } }],
    "action": { "kind": "notify", "title": "Idade acima do limite", "description": "Limite de idade para este produto é 80 anos." }
  }
]
```

### 5. AND + OR combinados - `(seguro AND idade > 65) OR (renda < 1500)`

```jsonc
"conditions": [
  {
    "id": "insurance-and-age",
    "checks": [
      { "left": { "from": "fields", "path": "has_protected_financing" }, "op": "EQUAL", "right": { "value": true } },
      { "left": { "from": "fields", "path": "age" }, "op": "GREATER_THAN", "right": { "value": 65 } }
    ],
    "action": { "kind": "notify", "title": "...", "description": "..." }
  },
  {
    "id": "low-income",
    "checks": [
      { "left": { "from": "fields", "path": "monthlyIncome" }, "op": "LESS_THAN", "right": { "value": 1500 } }
    ],
    "action": { "kind": "notify", "title": "Renda insuficiente", "description": "Renda mínima de R$ 1.500." }
  }
]
```

### 6. `EXISTS` - exigir campo opcional preenchido antes de prosseguir

```jsonc
"conditions": [
  {
    "checks": [
      { "left": { "from": "fields", "path": "email" }, "op": "NOT_EXISTS" }
    ],
    "action": {
      "kind": "fieldError",
      "field": "email",
      "message": "Informe seu e-mail antes de continuar.",
      "focus": true
    }
  }
]
```

---

## Boas práticas

- **Dê um `id` descritivo** em cada regra. Facilita logging futuro e revisão do JSON.
- **Prefira referências (`{ from, path }`) a literais hardcoded** quando o valor vier de prefetch. Garante que mudanças no backend se propaguem sem novo deploy.
- **Mensagens em português** (padrão do projeto). Use interpolação para incluir o valor que provocou o bloqueio - ajuda o usuário a entender o motivo.
- **Ordene regras da mais específico para a mais genérica**, já que a primeira que casa vence.
- **Não use `conditions` para validação de formato** (CPF, e-mail, etc.). Isso é responsabilidade dos schemas em `src/validation/fields`.

---

## Limitações

A linguagem foi mantida simples de propósito. **Não há** suporte (ainda) a:

- Operadores `IN`, `BETWEEN`, regex
- Múltiplas ações por regra (uma única `action` por regra)
- AND/OR explicítos em sintaxe aninhada (`$and`, `$or` estilo Mongo) - use múltiplas regras
- Ações compostas tipo "notify + setError ao mesmo tempo"
- `conditions` em elementos que não sejam `SERVICE_CALL` or `NAVIGATION`
- `actionButton.onClickAction` aceita apenas `kind: 'redirect'` por ora; e o `url` não sofre interpolação `{{...}}` (mesma decisão do `action.redirect`)

Se algum desses for necessário, abra discussão antes de estender - o `ConditionAction` for pensado para evoluir aditivamente (`action` → `actions: [...]`, novos operadores no enum) sem quebrar o JSON existente.

---

## Arquivos de referência

| Arquivo                                                                                                                                       | Responsabilidade                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [src/validation/schemas/elements/conditions.schema.ts](../src/validation/schemas/elements/conditions.schema.ts)                               | Schemas Zod (operandos, checks, regras, ações).                                                   |
| [src/validation/schemas/elements/serviceCall.schema.ts](../src/validation/schemas/elements/serviceCall.schema.ts)                             | Inclui `conditions` na config do `SERVICE_CALL`.                                                  |
| [src/validation/schemas/elements/navigation.schema.ts](../src/validation/schemas/elements/navigation.schema.ts)                               | Inclui `conditions`na config do `NAVIGATION`.                                                     |
| [src/utils/evaluateConditions/index.ts](../src/utils/evaluateConditions/index.ts)                                                             | Avaliador puro (`evaluateCheck`, `evaluateRule`, `evaluateConditions`).                           |
| [src/utils/evaluateConditions/index.spec.ts](../src/utils/evaluateConditions/index.spec.ts)                                                   | Testes Vitest cobrindo operadores, coerção e first-match.                                         |
| [src/hooks/useConditionalGuard.ts](../src/hooks/useConditionGuard.ts)                                                                         | Hook React que lê store, avalia, interpola mensagens e aplica a ação (incl. redirect via router). |
| [src/components/Core/JourneyStepForm/useJourneyStepFormController.ts](../src/components/Core/JourneyStepForm/useJourneyStepFormController.ts) | Integração no `onValid` (branches `service_call` e `navigation` com `validate:true`).             |
| [src/components/Elements/NavigationElement/index.tsx](../src/components/Elements/NavigationElement/index.tsx)                                 | Integração para `validate: false` (avalia direto no clique).                                      |
| [public/jsonContent/financiamento-de-veiculos.json](../public/jsonContent/financiamento-de-veiculos.json)                                     | Exemplo real em produção (step `/dados-pessoais` → `cep`).                                        |
