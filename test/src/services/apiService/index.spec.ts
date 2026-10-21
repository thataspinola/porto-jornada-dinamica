import { callApi } from '@/services/apiService'
import { carbonClient } from '@/lib/carbonClient'
const { cookieStore } = vi.hoisted(() => ({
  cookieStore: { get: vi.fn(), set: vi.fn() },
}))
vi.mock('next/headers', () => ({ cookies: async () => cookieStore }))
vi.mock('@/lib/carbonClient', () => ({ carbonClient: { post: vi.fn() } }))
vi.mock('@/utils/traceId', () => ({ getTraceId: async () => 'trace-fixture' }))
vi.mock('next-runtime-env', () => ({
  env: (name: string) =>
    name === 'NEXT_PUBLIC_JORNADA_DINAMICA' ? 'journey' : undefined,
}))
it('envia payload e headers ao Carbon e mantém a resposta do serviço', async () => {
  vi.mocked(carbonClient.post).mockResolvedValue({
    data: { data: { eligible: false } },
    headers: {},
  })
  const result = await callApi(
    {
      variant: 'web',
      serviceConfig: {
        headers: { 'porto-action': 'eligibility', 'porto-module': 'customer' },
      },
      fields: { taxvat: 'fixture' },
      business: { metadata: {} },
    },
    'token'
  )
  expect(result).toMatchObject({
    success: true,
    data: { data: { eligible: false } },
  })
  expect(carbonClient.post).toHaveBeenCalledWith(
    '/journey',
    expect.objectContaining({ payload: { taxvat: 'fixture' } }),
    expect.objectContaining({
      headers: expect.objectContaining({
        'X-Recaptcha-Token': 'token',
        'X-Recaptcha-Action': 'eligibility',
      }),
    })
  )
})
