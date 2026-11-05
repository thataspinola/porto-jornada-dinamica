# ConditionalTag — tag com resolução condicional

Componente de UI que renderiza uma `Tag` podendo **resolver dinamicamente** `label`, `variant` e `negative` a partir de um conjunto de regras (`conditionalRules`) avaliadas contra um objeto de dados (`fields`).

> ℹ️ **Uso isolado:** o componente é agnóstico de jornada. Ele não conhece store, form ou schema — recebe tudo por props. Pode ser usado em qualquer tela que precise de uma tag que muda conforme o estado.

---

## Sumário

- [Quando usar](#quando-usar)
- [Como a tag é resolvida](#como-a-tag-é-resolvida)
- [Anatomia de uma regra (`conditionalRules`)](#anatomia-de-uma-regra-conditionalrules)
- [Props do componente](#props-do-componente)
- [Operadores do `when`](#operadores-do-when)
- [Origem dos valores (`fields` + `field`)](#origem-dos-valores-fields--field)
- [Interpolação de label (`resolveLabel`)](#interpolação-de-label-resolvelabel)
- [Comportamento de fallback](#comportamento-de-fallback)
- [Exemplos completos](#exemplos-completos)
- [Boas práticas](#boas-práticas)
- [Limitações](#limitações)
- [Arquivos de referência](#arquivos-de-referência)

---

## Quando usar

`ConditionalTag` cabe quando o texto/estilo da tag **depende de um dado em runtime** e você não quer espalhar `if/else` no componente pai:

- Status derivado de um valor (`aprovado`, `pendente`, `recusado`)
- Flag booleana que liga/desliga um rótulo (`ativado`/`desativado`)
- Rótulo que precisa interpolar um valor dinâmico no texto

Se a tag é **estática** (label e cor fixos), use o `Tag` direto — não há ganho em usar `ConditionalTag`.

---

## Como a tag é resolvida

1. Se `conditionalRules` e `fields` existem, as regras são avaliadas **em ordem**.
2. A **primeira regra cujo `when` casa vence** e define `label`, `variant` e `negative`.
3. A regra resolvida **sobrescreve** as props diretas (`children`, `variant`, `negative`).
4. Se nenhuma regra casa (ou não há regras), o componente usa as props diretas.
5. Sem conteúdo final (nem label resolvida, nem `children`), nada é renderizado (`null`).

---

## Anatomia de uma regra (`conditionalRules`)

```jsonc
"conditionalRules": [
  {
    "label": "Aprovado",                 // texto exibido quando a regra casa
    "variant": "green",                  // variante visual da Tag (opcional)
    "negative": true,                    // estilo de contraste invertido (opcional)
    "when": {                             // condição da regra
      "field": "customer.status",        // caminho consultado em `fields`
      "equals": "approved"               // casa quando valor atual for igual
    }
  }
]
```

- `conditionalRules` é uma **lista de regras**, avaliadas em ordem; a **primeira que casa vence**.
- `when` exige **`equals` ou `notEquals`** — pelo menos um dos dois.
- `label`, `variant` e `negative` da regra são aplicados apenas quando ela casa.

---

## Props do componente

Além de **todas as props de `Tag`** (`variant`, `negative`, `size`, `children`, etc.), o componente aceita:

| Prop | Tipo | Descrição |
|---|---|---|
| `conditionalRules` | `ConditionalTagRule[]` | Lista de regras condicionais avaliadas em ordem. |
| `fields` | `Record<string, unknown>` | Objeto consultado pelas regras (via `when.field`). |
| `resolveLabel` | `(template?: string) => string \| undefined` | Transforma/interpola a label resolvida antes de renderizar. |

---

## Operadores do `when`

| Operador | Descrição | Casa quando |
|---|---|---|
| `equals` | Igualdade normalizada. | valor atual do campo é **igual** ao informado. |
| `notEquals` | Diferença normalizada. | valor atual do campo é **diferente** do informado. |

**Normalização:** antes de comparar, os dois lados passam por `String(...)` + `trim()` + `toLowerCase()`. Isso evita divergência por maiúsculas/minúsculas e espaços extras.

- `"Approved" equals "approved"` → casa
- `" true " equals true` → casa
- `notEquals` é o inverso direto de `equals`.

---

## Origem dos valores (`fields` + `field`)

O valor atual é lido com `getByPath(fields, when.field)`, então `field` aceita **acesso aninhado por ponto**:

| `field` | Lê de `fields` |
|---|---|
| `status` | `fields.status` |
| `customer.status` | `fields.customer.status` |
| `service.response.approved` | `fields.service.response.approved` |

Como o caminho vem por configuração, o mesmo componente funciona com qualquer shape de dados sem alterar código.

---

## Interpolação de label (`resolveLabel`)

`resolveLabel` é opcional e serve para **transformar a label** da regra antes de renderizar — por exemplo, trocar placeholders por valores reais.

```tsx
resolveLabel={(template) =>
  template?.replace('{{customer.name}}', 'Maria')
}
```

- Se **não** informado, a label da regra é usada como está.
- Se informado, o retorno da função vira o texto final da tag.

---

## Comportamento de fallback

| Cenário | Resultado |
|---|---|
| Sem `conditionalRules` ou sem `fields` | Usa `children` / `variant` / `negative` diretos. |
| Com regras, mas nenhuma casa | Usa `children` / `variant` / `negative` diretos. |
| Regra casa | Usa `label` / `variant` / `negative` da regra. |
| Sem conteúdo final | Renderiza `null`. |

---

## Exemplos completos

### 1. Uso direto (sem regras)

```tsx
<ConditionalTag variant="green" negative>
  Aprovado
</ConditionalTag>
```

### 2. Resolução condicional por status

```tsx
<ConditionalTag
  fields={{ customer: { status: 'approved' } }}
  conditionalRules={[
    {
      label: 'Aprovado',
      variant: 'green',
      negative: true,
      when: { field: 'customer.status', equals: 'approved' }
    },
    {
      label: 'Pendente',
      variant: 'yellow',
      negative: true,
      when: { field: 'customer.status', notEquals: 'approved' }
    }
  ]}
/>
```

Resultado esperado:

- `customer.status = "approved"` → `Aprovado`
- qualquer outro valor → `Pendente`

### 3. Flag booleana (ativado/desativado)

```tsx
<ConditionalTag
  fields={{ feature: true }}
  conditionalRules={[
    {
      label: 'Ativado',
      variant: 'green',
      when: { field: 'feature', equals: true }
    },
    {
      label: 'Desativado',
      variant: 'red',
      when: { field: 'feature', notEquals: true }
    }
  ]}
/>
```

### 4. Label interpolada

```tsx
<ConditionalTag
  fields={{ customer: { name: 'Maria', status: 'approved' } }}
  resolveLabel={(template) =>
    template?.replace('{{customer.name}}', 'Maria')
  }
  conditionalRules={[
    {
      label: 'Aprovado para {{customer.name}}',
      variant: 'green',
      when: { field: 'customer.status', equals: 'approved' }
    }
  ]}
/>
```

---

## Boas práticas

- **Ordene as regras da mais específica para a mais genérica**, já que a primeira que casa vence.
- **Cubra o caso contrário** com uma regra `notEquals` quando quiser sempre exibir alguma tag.
- **Use `resolveLabel` apenas quando há placeholder** — para labels estáticas ele é desnecessário.
- **Deixe a tag estática usar o `Tag` direto**; reserve `ConditionalTag` para quando há decisão em runtime.
- **Mensagens em português** (padrão do projeto).

---

## Limitações

O componente foi mantido simples de propósito. **Não há** suporte a:

- Operadores além de `equals` / `notEquals` (sem `greaterThan`, `includes`, regex, etc.).
- Múltiplos checks combinados por AND dentro de uma regra (uma regra = um `when`).
- Renderização de mais de uma tag simultânea (resolve para uma única tag).

Para lógica de gate mais rica (AND/OR, faixas numéricas, ações), veja [conditions.md](conditions.md), que cobre `SERVICE_CALL` e `NAVIGATION`.

---

## Arquivos de referência

| Arquivo | Responsabilidade |
|---|---|
| [src/components/UI/ConditionalTag/ConditionalTag.tsx](../src/components/UI/ConditionalTag/ConditionalTag.tsx) | Componente: aplica regra resolvida ou props diretas. |
| [src/components/UI/ConditionalTag/resolveConditionalTag.ts](../src/components/UI/ConditionalTag/resolveConditionalTag.ts) | Resolvedor puro (`when`, normalização, first-match). |
| [src/components/UI/ConditionalTag/types.ts](../src/components/UI/ConditionalTag/types.ts) | Tipos (`ConditionalTagRule`, `ConditionalTagProps`). |
| [src/components/UI/Tag/Tag.tsx](../src/components/UI/Tag/Tag.tsx) | `Tag` base encapsulada pelo componente. |
