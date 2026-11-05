import { resolveCookiePayload } from '@/utils/resolveCookiePayload'

function buildCookieStore(values: Record<string, string>) {
  return {
    get: (name: string) =>
      name in values ? { value: values[name] } : undefined
  }
}

describe('resolveCookiePayload', () => {
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
  })

  it.each([
    {
      client: '',
      server: 'server-token',
      expected: { CommerceCustomerToken: 'server-token' }
    },
    {
      client: 'client-token',
      server: '',
      expected: { CommerceCustomerToken: 'client-token' }
    },
    {
      client: 'client-token',
      server: 'server-token',
      expected: { CommerceCustomerToken: 'client-token' }
    },
    {
      client: 'same-token',
      server: 'same-token',
      expected: { CommerceCustomerToken: 'same-token' }
    },
    {
      client: undefined,
      server: undefined,
      expected: {}
    },
    {
      client: '',
      server: '',
      expected: {}
    }
  ])('resolves client=$client and server=$server', ({
    client,
    server,
    expected
  }) => {
    const cookieStore = {
      get: () => (server === undefined ? undefined : { value: server })
    }

    const result = resolveCookiePayload(
      { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
      cookieStore,
      client === undefined ? undefined : { CommerceCustomerToken: client }
    )

    expect(result).toEqual(expected)
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify({
        event: 'cookie_resolution',
        cookieName: 'CommerceCustomerToken',
        clientPresent: !!client,
        serverPresent: !!server,
        valuesDiffer: !!client && !!server && client !== server,
        source: client ? 'client' : server ? 'server' : 'missing',
        userAgent: 'unknown'
      })
    )
  })

  it('includes the supplied user-agent without exposing cookie values', () => {
    resolveCookiePayload(
      { token: '{{cookies.CommerceCustomerToken}}' },
      buildCookieStore({ CommerceCustomerToken: 'server-secret' }),
      { CommerceCustomerToken: 'client-secret' },
      'test-user-agent'
    )

    expect(warn).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify({
        event: 'cookie_resolution',
        cookieName: 'CommerceCustomerToken',
        clientPresent: true,
        serverPresent: true,
        valuesDiffer: true,
        source: 'client',
        userAgent: 'test-user-agent'
      })
    )
  })

  it('resolves cookie placeholders using only the referenced cookie names', () => {
    const cookieStore = buildCookieStore({ CommerceCustomerToken: 'abc123' })

    const result = resolveCookiePayload(
      { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
      cookieStore
    )

    expect(result).toEqual({ CommerceCustomerToken: 'abc123' })
  })

  it('omits the field when the referenced cookie is missing', () => {
    const cookieStore = buildCookieStore({})

    const result = resolveCookiePayload(
      { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
      cookieStore
    )

    expect(result).toEqual({})
  })

  it('prefers the client-read cookie over the server cookie store', () => {
    const cookieStore = buildCookieStore({ CommerceCustomerToken: 'server' })

    const result = resolveCookiePayload(
      { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
      cookieStore,
      { CommerceCustomerToken: 'client' }
    )

    expect(result).toEqual({ CommerceCustomerToken: 'client' })
  })

  it('falls back to the server cookie store when the client value is absent', () => {
    const cookieStore = buildCookieStore({ CommerceCustomerToken: 'server' })

    const result = resolveCookiePayload(
      { CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}' },
      cookieStore,
      {}
    )

    expect(result).toEqual({ CommerceCustomerToken: 'server' })
  })

  it('returns the payload unchanged when there are no cookie placeholders', () => {
    const cookieStore = buildCookieStore({})
    const payload = { occupation: '601' }

    expect(resolveCookiePayload(payload, cookieStore)).toBe(payload)
    expect(warn).not.toHaveBeenCalled()
  })

  it('falls back to the original payload when reading cookies throws', () => {
    const cookieStore = {
      get: () => {
        throw new Error('cookie store unavailable')
      }
    }
    const payload = {
      CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}'
    }

    expect(resolveCookiePayload(payload, cookieStore)).toBe(payload)
  })
})
