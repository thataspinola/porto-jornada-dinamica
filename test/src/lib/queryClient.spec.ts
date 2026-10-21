import { createQueryClient } from '@/lib/queryClient'
it('isola dados de cache por instância do provider', () => {
  const first = createQueryClient()
  const second = createQueryClient()
  first.setQueryData(['customer'], { id: 'fixture' })
  expect(first.getQueryData(['customer'])).toEqual({ id: 'fixture' })
  expect(second.getQueryData(['customer'])).toBeUndefined()
  first.clear()
  second.clear()
})
