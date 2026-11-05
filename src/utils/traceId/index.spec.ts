import { isUint8Array } from 'node:util/types'
import { cookies, headers } from 'next/headers'
import { type Mock, vi } from 'vitest'

import { getTraceId } from '.'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
  headers: vi.fn()
}))

const mockedCookies = cookies as unknown as Mock
const mockedHeaders = headers as unknown as Mock
const mockedCookieGet = vi.fn()
const mockedHeaderGet = vi.fn()

const mockedPortoHubTraceIdHeaderValue = '20-2jf27DD-v59mQG4-Q1l2VVFkM1RB'
const mockedCarbonTraceIdHeaderValue = '20-2jf27DD-v59mQG4-MjBmaGhTVnVJ'
const mockedPortoHubTraceIdCookieValue = '20-2jf27DD-v59mQG4-QkVYaE1NWVM3'
const mockedRandomGeneratedTraceId = '20-2jf27DD-v59mQG4-dTNhelduUU8'

beforeEach(() => {
  mockedCookieGet.mockReset()
  mockedHeaderGet.mockReset()
  mockedHeaders.mockImplementation(async () => ({ get: mockedHeaderGet }))
  mockedCookies.mockImplementation(async () => ({ get: mockedCookieGet }))

  vi.spyOn(crypto, 'getRandomValues').mockImplementation((inputArray) => {
    if (isUint8Array(inputArray)) {
      for (let i = 0; i < inputArray.length; i++) {
        inputArray[i] = i
      }
    }
    return inputArray
  })

  vi.useFakeTimers({ now: new Date('2025-12-12T08:00:00.000Z') })

  mockedHeaderGet.mockImplementation((name) => {
    if (name === 'x-forwarded-for') {
      return '131.229.146.37'
    }
  })
})

afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe('getTraceId', () => {
  it('should return portoHubTraceId cookie when it exists and porto-hub-trace-id/carbon-trace-id headers are absent', async () => {
    mockedCookieGet.mockImplementation((name) => {
      if (name === 'portoHubTraceId') {
        return { value: mockedPortoHubTraceIdCookieValue }
      }
    })

    await expect(getTraceId()).resolves.toBe(mockedPortoHubTraceIdCookieValue)
  })

  it('should return portoHubTraceId cookie when it exists and both porto-hub-trace-id and carbon-trace-id headers are present', async () => {
    mockedCookieGet.mockImplementation((name) => {
      if (name === 'portoHubTraceId') {
        return { value: mockedPortoHubTraceIdCookieValue }
      }
    })
    mockedHeaderGet.mockImplementation((name) => {
      if (name === 'x-forwarded-for') return '131.229.146.37'
      if (name === 'porto-hub-trace-id') return mockedPortoHubTraceIdHeaderValue
      if (name === 'carbon-trace-id') return mockedCarbonTraceIdHeaderValue
    })

    await expect(getTraceId()).resolves.toBe(mockedPortoHubTraceIdCookieValue)
  })

  it('should return portoHubTraceId cookie when it exists and only porto-hub-trace-id header is present', async () => {
    mockedCookieGet.mockImplementation((name) => {
      if (name === 'portoHubTraceId') {
        return { value: mockedPortoHubTraceIdCookieValue }
      }
    })
    mockedHeaderGet.mockImplementation((name) => {
      if (name === 'x-forwarded-for') return '131.229.146.37'
      if (name === 'porto-hub-trace-id') return mockedPortoHubTraceIdHeaderValue
    })

    await expect(getTraceId()).resolves.toBe(mockedPortoHubTraceIdCookieValue)
  })

  it('should return portoHubTraceId cookie when it exists and only carbon-trace-id header is present', async () => {
    mockedCookieGet.mockImplementation((name) => {
      if (name === 'portoHubTraceId') {
        return { value: mockedPortoHubTraceIdCookieValue }
      }
    })
    mockedHeaderGet.mockImplementation((name) => {
      if (name === 'x-forwarded-for') return '131.229.146.37'
      if (name === 'carbon-trace-id') return mockedCarbonTraceIdHeaderValue
    })

    await expect(getTraceId()).resolves.toBe(mockedPortoHubTraceIdCookieValue)
  })

  it('should return porto-hub-trace-id header value when cookie is absent and carbon-trace-id header is present', async () => {
    mockedHeaderGet.mockImplementation((name) => {
      if (name === 'x-forwarded-for') return '131.229.146.37'
      if (name === 'porto-hub-trace-id') return mockedPortoHubTraceIdHeaderValue
      if (name === 'carbon-trace-id') return mockedCarbonTraceIdHeaderValue
    })

    await expect(getTraceId()).resolves.toBe(mockedPortoHubTraceIdHeaderValue)
  })

  it('should return porto-hub-trace-id header value when cookie is absent and carbon-trace-id header is also absent', async () => {
    mockedHeaderGet.mockImplementation((name) => {
      if (name === 'x-forwarded-for') return '131.229.146.37'
      if (name === 'porto-hub-trace-id') return mockedPortoHubTraceIdHeaderValue
    })

    await expect(getTraceId()).resolves.toBe(mockedPortoHubTraceIdHeaderValue)
  })

  it('should return carbon-trace-id header value when cookie is absent and porto-hub-trace-id header is absent', async () => {
    mockedHeaderGet.mockImplementation((name) => {
      if (name === 'x-forwarded-for') return '131.229.146.37'
      if (name === 'carbon-trace-id') return mockedCarbonTraceIdHeaderValue
    })

    await expect(getTraceId()).resolves.toBe(mockedCarbonTraceIdHeaderValue)
  })

  it('should return a randomly generated trace id when cookie and both trace headers are absent', async () => {
    await expect(getTraceId()).resolves.toBe(mockedRandomGeneratedTraceId)
  })
})
