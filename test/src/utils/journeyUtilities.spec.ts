import { getByPath } from '@/utils/getByPath'
import { getStepData } from '@/utils/getStepData'
import { normalizeVertical } from '@/utils/normalizeVertical'
import formatCurrency from '@/utils/formatCurrency'
import { spacingParser, colorParser } from '@/utils/resolveStyle/parsers'
it('resolve caminhos e metadados de etapa sem mutar a lista', () => {
  expect(getByPath({ user: { name: 'Ana' } }, 'user.name')).toBe('Ana')
  expect(getByPath(null, 'x')).toBeUndefined()
  const steps = [{ slug: 'cpf' }, { slug: 'dados' }]
  expect(getStepData(steps, 'cpf')).toMatchObject({
    position: 0,
    isFirst: true,
    isLast: false,
    progress: 50,
  })
  expect(getStepData(steps, 'missing')).toBeNull()
  expect(steps).toHaveLength(2)
})
it('respeita tokens e valores aceitos pelo projeto original', () => {
  expect(normalizeVertical(' BANK ')).toBe('bank')
  expect(normalizeVertical('missing')).toBe('')
  expect(formatCurrency('123.45')).toBe('123,45')
  expect(spacingParser('sm')).toBe('var(--ui-spacing-sm)')
  expect(colorParser('neutral-100')).toBe('var(--ui-colors-neutral-100)')
})
