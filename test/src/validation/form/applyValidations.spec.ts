import { describe, expect, it } from 'vitest'

import { requiredString } from '@/validation/primitives'

import { applyValidations } from '@/validation/form/applyValidations'

const firstMessage = (
  schema: ReturnType<typeof requiredString>,
  value: string
) => schema.safeParse(value).error?.issues[0].message

describe('applyValidations', () => {
  it('should keep the schema unchanged when there are no validations', () => {
    const schema = applyValidations(requiredString(), [])

    expect(schema.safeParse('a').success).toBe(true)
  })

  it('should apply MIN_LENGTH', () => {
    const schema = applyValidations(requiredString(), [
      { type: 'MIN_LENGTH', value: 4, message: 'Deve ter 4 dígitos.' }
    ])

    expect(schema.safeParse('0001').success).toBe(true)
    expect(firstMessage(schema, '001')).toBe('Deve ter 4 dígitos.')
  })

  it('should apply MAX_LENGTH', () => {
    const schema = applyValidations(requiredString(), [
      { type: 'MAX_LENGTH', value: 3, message: 'Deve ter no máximo 3 dígitos.' }
    ])

    expect(schema.safeParse('123').success).toBe(true)
    expect(firstMessage(schema, '1234')).toBe('Deve ter no máximo 3 dígitos.')
  })

  it('should apply REGEX', () => {
    const schema = applyValidations(requiredString(), [
      { type: 'REGEX', value: '^[0-9]+$', message: 'Insira apenas números.' }
    ])

    expect(schema.safeParse('123').success).toBe(true)
    expect(firstMessage(schema, '12a')).toBe('Insira apenas números.')
  })

  it('should report the required message before the validations', () => {
    const schema = applyValidations(requiredString(), [
      { type: 'MIN_LENGTH', value: 4, message: 'Deve ter 4 dígitos.' }
    ])

    expect(firstMessage(schema, '')).toBe('Insira um valor válido.')
  })
})
