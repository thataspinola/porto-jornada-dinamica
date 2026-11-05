import { vi } from 'vitest'

import { readReferencedCookies } from '.'

const cookiesGet = vi.fn()

vi.mock('js-cookie', () => ({
  default: {
    get: (name: string) => cookiesGet(name)
  }
}))

describe('readReferencedCookies', () => {
  let debug: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    cookiesGet.mockReset()
    debug = vi.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    debug.mockRestore()
  })

  it.each([
    { value: 'synthetic-token', present: true },
    { value: '', present: false },
    { value: undefined, present: false }
  ])('debugs cookie availability without exposing its value: $present', ({
    value,
    present
  }) => {
    cookiesGet.mockReturnValue(value)

    readReferencedCookies({
      CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}'
    })

    expect(debug).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify({
        event: 'cookie_read',
        cookieName: 'CommerceCustomerToken',
        present
      })
    )
  })

  it('reads values for cookies referenced by the payload', () => {
    cookiesGet.mockImplementation((name: string) =>
      name === 'CommerceCustomerToken' ? 'abc123' : undefined
    )

    const result = readReferencedCookies({
      CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}',
      occupation: '601'
    })

    expect(result).toEqual({ CommerceCustomerToken: 'abc123' })
  })

  it('skips cookies that are not available in the browser', () => {
    cookiesGet.mockReturnValue(undefined)

    const result = readReferencedCookies({
      CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}'
    })

    expect(result).toEqual({})
  })

  it('skips empty cookies so the server can supply the value', () => {
    cookiesGet.mockReturnValue('')

    expect(
      readReferencedCookies({
        CommerceCustomerToken: '{{cookies.CommerceCustomerToken}}'
      })
    ).toEqual({})
  })

  it('returns an empty object when there are no cookie placeholders', () => {
    const result = readReferencedCookies({ occupation: '601' })

    expect(result).toEqual({})
    expect(cookiesGet).not.toHaveBeenCalled()
    expect(debug).not.toHaveBeenCalled()
  })
})
