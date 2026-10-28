import {
  ensureAnalyticsUserId,
  getAnalyticsUserId,
} from '@/utils/ensureAnalyticsUserId'
import { useJourneyStore } from '@/store/journeyStore'
import { encryptGtmClientId } from '@/utils/encrypt'
vi.mock('@/utils/encrypt', () => ({ encryptGtmClientId: vi.fn() }))
afterEach(() => useJourneyStore.getState().reset())
it('reutiliza identificador existente sem recriptografar', async () => {
  useJourneyStore
    .getState()
    .mergeBusiness({ metadata: { analyticsUserId: 'existing' } })
  expect(await ensureAnalyticsUserId('fixture')).toBe('existing')
  expect(encryptGtmClientId).not.toHaveBeenCalled()
})
it('não gera identificador sem documento e persiste somente o resultado cifrado', async () => {
  expect(await ensureAnalyticsUserId(undefined)).toBeUndefined()
  vi.mocked(encryptGtmClientId).mockResolvedValue('encrypted')
  expect(await ensureAnalyticsUserId('fixture')).toBe('encrypted')
  expect(getAnalyticsUserId()).toBe('encrypted')
})
