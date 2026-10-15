import { describe, expect, it } from 'vitest'

import {
  optionalBoolean,
  optionalNumber,
  optionalString,
  requiredNumber,
  requiredString,
  requiredTrueBoolean,
} from '@/validation/primitives'

describe('primitivos', () => {
  it('valida texto obrigatório e converte texto vazio opcional', () => {
    expect(requiredString().parse('Porto')).toBe('Porto')
    expect(requiredString().safeParse('').success).toBe(false)
    expect(optionalString().parse(' ')).toBeUndefined()
    expect(optionalString().parse(undefined)).toBeUndefined()
    expect(optionalString().parse('Porto')).toBe('Porto')
    expect(optionalString().safeParse(0).success).toBe(false)
  })

  it('exige consentimento booleano explícito', () => {
    expect(requiredTrueBoolean().parse(true)).toBe(true)
    expect(requiredTrueBoolean().safeParse(false).success).toBe(false)
    expect(requiredTrueBoolean().safeParse(undefined)).toBeUndefined()
    expect(optionalBoolean().parse(false)).toBe(false)
    expect(optionalBoolean().parse(undefined)).toBeUndefined()
    expect(optionalBoolean().safeParse(0).success).toBe(false)
  })

  it.each([requiredNumber, optionalNumber])(
    'rejeita valores não finitos',
    (schema) => {
      expect(schema().parse(0)).toBe(0)
      expect(schema().safeParse(Infinity).success).toBe(false)
      expect(schema().safeParse(NaN).success).toBe(false)
      expect(schema().safeParse('1').success).toBe(false)
    }
  )

  it('distingue número opcional e obrigatório', () => {
    expect(optionalNumber().parse(undefined)).toBeUndefined()
    expect(requiredNumber().safeParse(undefined).success).toBe(false)
  })
})
