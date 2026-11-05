import { resolveConditionalTag } from './resolveConditionalTag'
import type { ConditionalTagRule } from './types'

const rules: ConditionalTagRule[] = [
  {
    label: 'Aprovado',
    variant: 'green',
    negative: true,
    when: { field: 'customer.status', equals: 'approved' }
  },
  {
    label: 'Pendente',
    variant: 'yellow',
    when: { field: 'customer.status', notEquals: 'approved' }
  }
]

describe('resolveConditionalTag', () => {
  it('returns undefined when there are no rules', () => {
    expect(
      resolveConditionalTag({ conditionalRules: undefined, fields: {} })
    ).toBeUndefined()
  })

  it('returns undefined when the rules list is empty', () => {
    expect(
      resolveConditionalTag({ conditionalRules: [], fields: {} })
    ).toBeUndefined()
  })

  it('returns undefined when fields is missing', () => {
    expect(
      resolveConditionalTag({ conditionalRules: rules, fields: undefined })
    ).toBeUndefined()
  })

  it('resolves the first rule that matches with equals', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: rules,
        fields: { customer: { status: 'approved' } }
      })
    ).toEqual({ label: 'Aprovado', variant: 'green', negative: true })
  })

  it('resolves a notEquals rule when the value differs', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: rules,
        fields: { customer: { status: 'pending' } }
      })
    ).toEqual({ label: 'Pendente', variant: 'yellow', negative: undefined })
  })

  it('normalizes values before comparing (case and spaces)', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: [
          {
            label: 'Ativado',
            when: { field: 'feature', equals: 'ON' }
          }
        ],
        fields: { feature: '  on  ' }
      })
    ).toEqual({ label: 'Ativado', variant: undefined, negative: undefined })
  })

  it('compares boolean values as normalized strings', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: [
          {
            label: 'Ligado',
            when: { field: 'flag', equals: true }
          }
        ],
        fields: { flag: true }
      })
    ).toEqual({ label: 'Ligado', variant: undefined, negative: undefined })
  })

  it('reads nested paths via getByPath', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: [
          {
            label: 'OK',
            when: { field: 'a.b.c', equals: 'yes' }
          }
        ],
        fields: { a: { b: { c: 'yes' } } }
      })
    ).toMatchObject({ label: 'OK' })
  })

  it('returns undefined when no rule matches', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: [
          {
            label: 'Match',
            when: { field: 'status', equals: 'x' }
          }
        ],
        fields: { status: 'y' }
      })
    ).toBeUndefined()
  })

  it('ignores a rule without equals or notEquals', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: [
          {
            label: 'Invalid',
            when: { field: 'status' }
          }
        ],
        fields: { status: 'anything' }
      })
    ).toBeUndefined()
  })

  it('applies resolveLabel to the matched label', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: [
          {
            label: 'Olá, {{name}}',
            when: { field: 'ready', equals: true }
          }
        ],
        fields: { ready: true },
        resolveLabel: (template) => template?.replace('{{name}}', 'Maria')
      })
    ).toEqual({ label: 'Olá, Maria', variant: undefined, negative: undefined })
  })

  it('returns undefined when resolveLabel produces an empty label', () => {
    expect(
      resolveConditionalTag({
        conditionalRules: [
          {
            label: 'anything',
            when: { field: 'ready', equals: true }
          }
        ],
        fields: { ready: true },
        resolveLabel: () => ''
      })
    ).toBeUndefined()
  })
})
