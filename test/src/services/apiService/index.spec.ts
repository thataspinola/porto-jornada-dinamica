import { cookies } from 'next/headers'
import { type Mock, vi } from 'vitest'

import { carbonClient } from '@/lib/carbonClient'

import { resolveCookiePayload } from '@/utils/resolveCookiePayload'

import { callApi } from '@/services/apiService'
import type { ApiServiceInput } from '@/services/apiService/types'

vi.mock('next/headers', () => ({
  cookies: vi.fn()
}))

vi.mock('@/lib/carbonClient', () => ({
  carbonClient: { post: vi.fn() }
}))

vi.mock('@/utils', () => ({
  getTraceId: vi.fn().mockResolvedValue('trace-id'),
  resolveCookiePayload
}))

const mockedCookies = cookies as unknown as Mock
const mockedCookieGet = vi.fn()
const mockedCookieSet = vi.fn()
const mockedPost = carbonClient.post as unknown as Mock

function buildInput(
  fields: Record<string, unknown>,
  variant: ApiServiceInput['variant'] = 'web',
  clientCookies?: Record<string, string>
): ApiServiceInput {
  return {
    variant,
    serviceConfig: {
      headers: {},
      ...(clientCookies !== undefined && { clientCookies })
    },
    fields,
    business: { metadata: {} }
  }
}

beforeEach(() => {
  mockedCookieGet.mockReset()
  mockedCookieSet.mockReset()
  mockedPost.mockReset()
  mockedCookies.mockImplementation(async () => ({
    get: mockedCookieGet,
    set: mockedCookieSet
  }))
  mockedPost.mockResolvedValue({ data: {}, headers: {} })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('callApi', () => {
  it('resolves a cookie placeholder in the payload with the matching cookie value', async () => {
    mockedCookieGet.mockImplementation((name: string) => {
      if (name === 'CommerceCustomerToken') return { value: 'abc123' }
    })

    await callApi(
      buildInput({
        CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}'
      }),
      'recaptcha-token'
    )

    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        payload: expect.objectContaining({
          CommerceCustomerToken: 'abc123'
        })
      }),
      expect.anything()
    )
  })

  it('omits the field when the referenced cookie is missing', async () => {
    mockedCookieGet.mockImplementation(() => undefined)

    await callApi(
      buildInput({
        CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}'
      }),
      'recaptcha-token'
    )

    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        payload: expect.not.objectContaining({
          CommerceCustomerToken: expect.anything()
        })
      }),
      expect.anything()
    )
  })

  it('uses the client-delivered token without re-setting the cookie', async () => {
    mockedCookieGet.mockImplementation(() => undefined)

    await callApi(
      buildInput(
        { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
        'web',
        { CommerceCustomerToken: 'from-client' }
      ),
      'recaptcha-token'
    )

    expect(mockedCookieSet).not.toHaveBeenCalledWith(
      'CommerceCustomerToken',
      expect.anything(),
      expect.anything()
    )
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        payload: { CommerceCustomerToken: 'from-client' }
      }),
      expect.anything()
    )
  })

  it('falls back to the server when the client token is empty', async () => {
    mockedCookieGet.mockImplementation((name: string) => {
      if (name === 'CommerceCustomerToken') return { value: 'server-token' }
    })
    const input = buildInput(
      { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
      'web',
      { CommerceCustomerToken: '' }
    )
    await callApi(input, 'recaptcha-token')

    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        payload: { CommerceCustomerToken: 'server-token' }
      }),
      expect.anything()
    )
  })

  it('does not re-set the token when it already matches the server cookie', async () => {
    mockedCookieGet.mockImplementation((name: string) => {
      if (name === 'CommerceCustomerToken') return { value: 'same' }
    })

    await callApi(
      buildInput(
        { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
        'web',
        { CommerceCustomerToken: 'same' }
      ),
      'recaptcha-token'
    )

    expect(mockedCookieSet).not.toHaveBeenCalledWith(
      'CommerceCustomerToken',
      expect.anything(),
      expect.anything()
    )
  })
})
