import { getTraceId } from '@/utils/traceId'
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: 'trace-cookie' }) }),
  headers: async () => new Headers(),
}))
it('reutiliza o trace da requisição', async () =>
  expect(await getTraceId()).toBe('trace-cookie'))
