import { describe, expect, it } from 'vitest'

import { resolveValidationAttributes } from '@/utils/resolveValidationAttributes'

describe('resolveValidationAttributes', () => {
  it('should return no attributes when there are no validations', () => {
    expect(resolveValidationAttributes([])).toEqual({})
  })

  it('should map each validation type to its input attribute', () => {
    expect(
      resolveValidationAttributes([
        { type: 'MIN_LENGTH', value: 4, message: 'mínimo' },
        { type: 'MAX_LENGTH', value: 10, message: 'máximo' },
        { type: 'REGEX', value: '^[0-9]+$', message: 'formato' }
      ])
    ).toEqual({ minLength: 4, maxLength: 10, pattern: '^[0-9]+$' })
  })

  it('should ignore types that have no matching attribute', () => {
    expect(
      resolveValidationAttributes([
        { type: 'MIN_LENGTH', value: 2, message: 'mínimo' }
      ])
    ).toEqual({ minLength: 2 })
  })
})
