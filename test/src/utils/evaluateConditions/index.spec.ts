import type { ConditionRule } from '@/validation/schemas/elements/conditions.schema'

import {
  evaluateCheck,
  evaluateConditions,
  evaluateRule
} from '@/utils/evaluateConditions'

const baseCtx = {
  fields: {},
  parameters: {},
  services: {},
  business: {},
  formErrors: {}
}

describe('evaluateCheck', () => {
  it('returns true for EQUAL when literal matches reference', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'age' },
          op: 'EQUAL',
          right: { value: 30 }
        },
        { ...baseCtx, fields: { age: 30 } }
      )
    ).toBe(true)
  })

  it('coerces numeric strings for EQUAL', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'age' },
          op: 'EQUAL',
          right: { value: 30 }
        },
        { ...baseCtx, fields: { age: '30' } }
      )
    ).toBe(true)
  })

  it('NOT_EQUAL inverts EQUAL', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'age' },
          op: 'NOT_EQUAL',
          right: { value: 30 }
        },
        { ...baseCtx, fields: { age: 31 } }
      )
    ).toBe(true)
  })

  it('GREATER_THAN compares as numbers using parameters reference', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN',
          right: { from: 'parameters', path: 'maximumClientAgeForInsurance' }
        },
        {
          ...baseCtx,
          fields: { age: 70 },
          parameters: { maximumClientAgeForInsurance: 65 }
        }
      )
    ).toBe(true)
  })

  it('GREATER_THAN_OR_EQUAL returns true when equal', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN_OR_EQUAL',
          right: { value: 65 }
        },
        { ...baseCtx, fields: { age: 65 } }
      )
    ).toBe(true)
  })

  it('LESS_THAN returns false when not lesser', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'age' },
          op: 'LESS_THAN',
          right: { value: 30 }
        },
        { ...baseCtx, fields: { age: 30 } }
      )
    ).toBe(false)
  })

  it('LESS_THAN_OR_EQUAL returns true when equal', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'age' },
          op: 'LESS_THAN_OR_EQUAL',
          right: { value: 30 }
        },
        { ...baseCtx, fields: { age: 30 } }
      )
    ).toBe(true)
  })

  it('numeric comparisons return false when value is not parseable', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'name' },
          op: 'GREATER_THAN',
          right: { value: 10 }
        },
        { ...baseCtx, fields: { name: 'João' } }
      )
    ).toBe(false)
  })

  it('INCLUDES matches substring', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'email' },
          op: 'INCLUDES',
          right: { value: '@porto' }
        },
        { ...baseCtx, fields: { email: 'cliente@porto.com.br' } }
      )
    ).toBe(true)
  })

  it('EXISTS returns true for non-empty value and ignores right', () => {
    expect(
      evaluateCheck(
        { left: { from: 'fields', path: 'age' }, op: 'EXISTS' },
        { ...baseCtx, fields: { age: 0 } }
      )
    ).toBe(true)
  })

  it('EXISTS returns false for empty string', () => {
    expect(
      evaluateCheck(
        { left: { from: 'fields', path: 'name' }, op: 'EXISTS' },
        { ...baseCtx, fields: { name: '  ' } }
      )
    ).toBe(false)
  })

  it('NOT_EXISTS returns true when value is missing', () => {
    expect(
      evaluateCheck(
        { left: { from: 'fields', path: 'age' }, op: 'NOT_EXISTS' },
        baseCtx
      )
    ).toBe(true)
  })

  it('boolean EQUAL works for switches', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'fields', path: 'insuranceEnabled' },
          op: 'EQUAL',
          right: { value: true }
        },
        { ...baseCtx, fields: { insuranceEnabled: true } }
      )
    ).toBe(true)
  })

  it('supports nested paths via dot notation', () => {
    expect(
      evaluateCheck(
        {
          left: { from: 'services', path: 'eligibility.data.score' },
          op: 'GREATER_THAN',
          right: { value: 500 }
        },
        {
          ...baseCtx,
          services: { eligibility: { data: { score: 750 } } }
        }
      )
    ).toBe(true)
  })
})

describe('evaluateRule', () => {
  it('returns true when all checks pass (AND)', () => {
    const rule: ConditionRule = {
      checks: [
        {
          left: { from: 'fields', path: 'insuranceEnabled' },
          op: 'EQUAL',
          right: { value: true }
        },
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN',
          right: { from: 'parameters', path: 'maximumClientAgeForInsurance' }
        }
      ],
      action: { kind: 'notify', title: 't', description: 'd' }
    }
    expect(
      evaluateRule(rule, {
        ...baseCtx,
        fields: { insuranceEnabled: true, age: 70 },
        parameters: { maximumClientAgeForInsurance: 65 }
      })
    ).toBe(true)
  })

  it('returns false when any check fails', () => {
    const rule: ConditionRule = {
      checks: [
        {
          left: { from: 'fields', path: 'insuranceEnabled' },
          op: 'EQUAL',
          right: { value: true }
        },
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN',
          right: { value: 65 }
        }
      ],
      action: { kind: 'notify', title: 't', description: 'd' }
    }
    expect(
      evaluateRule(rule, {
        ...baseCtx,
        fields: { insuranceEnabled: false, age: 70 }
      })
    ).toBe(false)
  })
})

describe('evaluateConditions', () => {
  it('returns matched=false when rules is undefined', () => {
    expect(evaluateConditions(undefined, baseCtx)).toEqual({ matched: false })
  })

  it('returns matched=false when rules is empty', () => {
    expect(evaluateConditions([], baseCtx)).toEqual({ matched: false })
  })

  it('returns first matching rule', () => {
    const ruleA: ConditionRule = {
      id: 'A',
      checks: [
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN',
          right: { value: 100 }
        }
      ],
      action: { kind: 'notify', title: 'a', description: 'a' }
    }
    const ruleB: ConditionRule = {
      id: 'B',
      checks: [
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN',
          right: { value: 60 }
        }
      ],
      action: { kind: 'notify', title: 'b', description: 'b' }
    }
    const ruleC: ConditionRule = {
      id: 'C',
      checks: [
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN',
          right: { value: 30 }
        }
      ],
      action: { kind: 'notify', title: 'c', description: 'c' }
    }
    const result = evaluateConditions([ruleA, ruleB, ruleC], {
      ...baseCtx,
      fields: { age: 70 }
    })
    expect(result.matched).toBe(true)
    if (result.matched) {
      expect(result.rule.id).toBe('B')
    }
  })

  it('returns matched=false when no rule matches', () => {
    const rule: ConditionRule = {
      checks: [
        {
          left: { from: 'fields', path: 'age' },
          op: 'GREATER_THAN',
          right: { value: 100 }
        }
      ],
      action: { kind: 'notify', title: 't', description: 'd' }
    }
    expect(
      evaluateConditions([rule], {
        ...baseCtx,
        fields: { age: 30 }
      })
    ).toEqual({ matched: false })
  })
})
