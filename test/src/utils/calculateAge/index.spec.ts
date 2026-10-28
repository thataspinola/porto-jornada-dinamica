import { calculateAge } from '@/utils/calculateAge'
afterEach(() => vi.useRealTimers())
it('calcula idade com data fixa e rejeita datas inválidas', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 9, 21))
  expect(calculateAge('2000-10-22')).toBe(25)
  expect(calculateAge('22/10/2000')).toBe(25)
  expect(calculateAge('2000-02-30')).toBeNull()
  expect(calculateAge('2999-01-01')).toBeNull()
})
