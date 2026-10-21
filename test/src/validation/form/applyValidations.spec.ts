import { z } from 'zod'

import {
  applyValidations,
  applyOptionalValidations,
} from '@/validation/form/applyValidations'

test('valida limites e padrão declarativos', () => {
  const rules = [
    { type: 'MIN_LENGTH', value: 2, message: 'Mínimo' },
    { type: 'MAX_LENGTH', value: 4, message: 'Máximo' },
    { type: 'REGEX', value: '^[A-Z]+$', message: 'Formato' },
  ] as const

  const s = applyValidations(z.string(), [...rules])
  expect(s.safeParse('AB').success).toBe(true)

  for (const v of ['A', 'ABCDE', 'ab'])
    expect(s.safeParse(v).success).toBe(false)

  expect(applyOptionalValidations([...rules]).safeParse('').success).toBe(true)

  expect(
    applyOptionalValidations([...rules], { trim: true }).parse(' AB ')
  ).toBe('AB')
})
