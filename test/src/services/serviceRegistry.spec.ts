import { callService } from '@/services/serviceRegistry'
import { callApi } from '@/services/apiService'
import type { ApiServiceInput } from '@/services/apiService/types'
vi.mock('@/services/apiService', () => ({ callApi: vi.fn() }))
const input: ApiServiceInput = {
  variant: 'web',
  serviceConfig: { headers: { 'porto-action': 'fixture' } },
  fields: {},
  business: { metadata: {} },
}
it('não chama backend sem token', async () => {
  vi.mocked(callApi).mockClear()
  expect(await callService(input, '')).toMatchObject({
    success: false,
    error: 'INVALID_INPUT',
  })
  expect(callApi).not.toHaveBeenCalled()
})
it('encaminha o contrato nativo ao adapter Carbon', async () => {
  vi.mocked(callApi).mockResolvedValue({ success: true, data: {} })
  expect(await callService(input, 'token')).toMatchObject({ success: true })
  expect(callApi).toHaveBeenCalledWith(input, 'token')
})
