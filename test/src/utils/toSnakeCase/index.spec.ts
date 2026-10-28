import { toSnakeCase } from '@/utils/toSnakeCase'
it('converte nomes de propriedades sem perder os valores', () => {
  expect(toSnakeCase('evAction')).toBe('ev_action')
  expect(toSnakeCase({ evAction: 'success', value: 0 })).toEqual({
    ev_action: 'success',
    value: 0,
  })
})
