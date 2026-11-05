import { beforeEach, vi } from 'vitest'

import { useJourneyStore } from '@/store/journeyStore'

import { encryptGtmClientId } from '@/utils/encrypt'
import { ensureAnalyticsUserId } from '@/utils/ensureAnalyticsUserId'

vi.mock('@/utils/encrypt', () => ({
  encryptGtmClientId: vi.fn()
}))

describe('ensureAnalyticsUserId', () => {
  beforeEach(() => {
    useJourneyStore.getState().reset()
    vi.mocked(encryptGtmClientId).mockReset()
  })

  it('should return the stored analyticsUserId without encrypting again', async () => {
    useJourneyStore.getState().mergeBusiness({
      metadata: { analyticsUserId: 'stored-user-id' }
    })

    await expect(ensureAnalyticsUserId('12345678901')).resolves.toBe(
      'stored-user-id'
    )
    expect(encryptGtmClientId).not.toHaveBeenCalled()
  })

  it('should encrypt the cpf and persist analyticsUserId when it is missing', async () => {
    vi.mocked(encryptGtmClientId).mockResolvedValue('encrypted-cpf')

    await expect(ensureAnalyticsUserId('12345678901')).resolves.toBe(
      'encrypted-cpf'
    )

    expect(encryptGtmClientId).toHaveBeenCalledWith('12345678901')
    expect(useJourneyStore.getState().business.metadata.analyticsUserId).toBe(
      'encrypted-cpf'
    )
  })

  it('should return undefined when there is no stored value and no cpf', async () => {
    await expect(ensureAnalyticsUserId(undefined)).resolves.toBeUndefined()
    expect(encryptGtmClientId).not.toHaveBeenCalled()
  })
})
