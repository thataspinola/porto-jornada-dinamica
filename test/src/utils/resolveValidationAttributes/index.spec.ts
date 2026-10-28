import { resolveValidationAttributes } from '@/utils/resolveValidationAttributes'
it('expõe limites de comprimento e regex do schema declarativo', () =>
  expect(
    resolveValidationAttributes([
      { type: 'MIN_LENGTH', value: 2, message: 'Mínimo' },
      { type: 'MAX_LENGTH', value: 10, message: 'Máximo' },
      { type: 'REGEX', value: '[A-Z]', message: 'Formato' },
    ])
  ).toEqual({ minLength: 2, maxLength: 10, pattern: '[A-Z]' }))
