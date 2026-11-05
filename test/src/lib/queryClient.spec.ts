import { createQueryClient } from '@/lib/queryClient'
import { ServiceError } from '@/services/types'

it('isola dados por cliente sem alterar a política de retry', () => {
  const first = createQueryClient()
  const second = createQueryClient()
  first.setQueryData(['session'], { private: true })
  expect(second.getQueryData(['session'])).toBeUndefined()
  const retry = first.getDefaultOptions().queries?.retry
  expect(typeof retry).toBe('function')
  if (typeof retry === 'function') {
    expect(retry(0, new ServiceError('UNAVAILABLE', 503))).toBe(true)
    expect(retry(2, new ServiceError('UNAVAILABLE', 503))).toBe(false)
    expect(retry(0, new ServiceError('NOT_ELIGIBLE', 422))).toBe(false)
    expect(retry(0, new Error('other'))).toBe(false)
  }
  first.clear()
  second.clear()
})
