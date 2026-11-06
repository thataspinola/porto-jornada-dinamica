import { env } from 'next-runtime-env'
import { vi } from 'vitest'

import {
  resolveGoogleAnalyticsMetadata,
  resolveGoogleClientId
} from '@/utils/parseGoogleClientId'

vi.mock('next-runtime-env', () => ({
  env: vi.fn()
}))

describe('resolveGoogleClientId', () => {
  it('should read _ga without matching _ga_* cookies', () => {
    document.cookie = '_ga_S9FTJ8D526=GS2.1.s1'
    document.cookie = '_ga=GA1.1.898370475.1784572594'

    expect(resolveGoogleClientId()).toBe('898370475.1784572594')
  })
})

describe('resolveGoogleAnalyticsMetadata', () => {
  it('should send gaClientId and gaMeasurementSessionId using the env measurement code', () => {
    vi.mocked(env).mockReturnValue('PGMXQZ7PG8')
    document.cookie = '_ga=GA1.1.898370475.1784572594'
    document.cookie = '_ga_PGMXQZ7PG8=GS2.1.s1749474123$o1$g1$t1'

    expect(resolveGoogleAnalyticsMetadata()).toEqual({
      gaClientId: '898370475.1784572594',
      gaMeasurementSessionId: '1749474123'
    })
  })
})
